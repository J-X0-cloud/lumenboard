/**
 * Metrics service for the sample workspace: date-range bucketing, period comparisons and one selector
 * per dashboard tab. Selectors return plain, serialisable view models; components only lay them out.
 */
import { addDays } from "date-fns";

import { buildCohortTable } from "@/lib/cohorts";
import { fmt, monthStart } from "@/lib/dates";
import { delta } from "@/lib/delta";
import { formatValue, money } from "@/lib/format";
import { AMBER, CORAL, INDIGO, PRIOR, TEAL } from "@/lib/palette";
import { createRng } from "@/lib/random";
import { CAMPAIGNS, PRODUCTS } from "@/lib/data/products";
import {
  CATEGORIES,
  CATEGORY_COLORS,
  CHANNEL,
  CHANNEL_COLORS,
  CHANNEL_CVR,
  CHANNELS,
  REGIONS,
} from "@/lib/data/dimensions";
import {
  CATEGORY_REPEAT_RATE,
  CHANNEL_RETENTION_CURVES,
  MATURITY_FACTOR,
  RETENTION_SNAPSHOT,
} from "@/lib/data/retention";
import { DAYS, END_DATE, PAUSED_SOCIAL_DAYS, dayIndex } from "@/lib/data/simulation";
import type { HBarItem, TimeSeriesSpec } from "@/types/charts";
import type {
  AcquisitionModel,
  Bucket,
  CampaignRow,
  DayRow,
  Insight,
  Kpi,
  KpiInput,
  OverviewModel,
  PanelModel,
  ProductRow,
  RangeDefinition,
  RangeKey,
  RegionRow,
  RetentionModel,
  RevenueModel,
  ScalarKey,
  TabKey,
  VectorKey,
} from "@/types/dashboard";

// ------------------------------------------------------------------ ranges & buckets

export const RANGES: Record<RangeKey, RangeDefinition> = {
  "7d": { key: "7d", label: "Last 7 days", short: "7D", days: 7, comparison: "prior 7 days" },
  "30d": { key: "30d", label: "Last 30 days", short: "30D", days: 30, comparison: "prior 30 days" },
  "90d": { key: "90d", label: "Last 90 days", short: "90D", days: 91, comparison: "prior 90 days" },
  "12m": { key: "12m", label: "Last 12 months", short: "12M", days: null, comparison: "prior 12 months" },
};

export const RANGE_KEYS = Object.keys(RANGES) as RangeKey[];

export const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "revenue", label: "Revenue" },
  { key: "retention", label: "Retention" },
  { key: "acquisition", label: "Acquisition" },
];

const inRange = (from: Date, to: Date) => DAYS.filter((r) => r.date >= from && r.date <= to);

/**
 * Split a range into chart buckets: days for 7D/30D, 13 weeks for 90D, calendar months for 12M.
 * `offset = 1` returns the comparison period immediately before.
 */
export function buckets(range: RangeKey, offset = 0): Bucket[] {
  if (range === "12m") {
    const out: Bucket[] = [];
    for (let k = 11; k >= 0; k--) {
      const start = monthStart(END_DATE, k + 12 * offset);
      let end = addDays(monthStart(END_DATE, k - 1 + 12 * offset), -1);
      if (k === 0)
        end =
          offset === 0
            ? END_DATE
            : new Date(END_DATE.getFullYear() - offset, END_DATE.getMonth(), END_DATE.getDate());
      const toDate = k === 0 && offset === 0 ? " (to date)" : "";
      out.push({ label: fmt.month(start), tip: fmt.monthLong(start) + toDate, rows: inRange(start, end) });
    }
    return out;
  }

  const n = RANGES[range].days!;
  const hi = DAYS.length - 1 - n * offset;
  const rows = DAYS.slice(hi - n + 1, hi + 1);

  if (range === "90d") {
    return Array.from({ length: 13 }, (_, w) => {
      const week = rows.slice(w * 7, (w + 1) * 7);
      const a = week[0].date;
      const b = week[week.length - 1].date;
      return { label: fmt.day(a), tip: `Week of ${fmt.day(a)} – ${fmt.day(b)}`, rows: week };
    });
  }
  return rows.map((r) => ({
    label: n === 7 ? fmt.weekdayDay(r.date) : fmt.day(r.date),
    tip: fmt.full(r.date),
    rows: [r],
  }));
}

export function periodRows(range: RangeKey, offset = 0): DayRow[] {
  return buckets(range, offset).flatMap((b) => b.rows);
}

export function periodText(range: RangeKey): string {
  const rows = periodRows(range);
  return `${fmt.long(rows[0].date)} – ${fmt.long(rows[rows.length - 1].date)}`;
}

export function granularity(range: RangeKey): "daily" | "weekly" | "monthly" {
  return range === "90d" ? "weekly" : range === "12m" ? "monthly" : "daily";
}

// ------------------------------------------------------------------ aggregation

export const sum = (rows: readonly DayRow[], key: ScalarKey) => rows.reduce((a, r) => a + r[key], 0);

export const sumVector = (rows: readonly DayRow[], key: VectorKey, size: number) =>
  Array.from({ length: size }, (_, k) => rows.reduce((a, r) => a + r[key][k], 0));

const totalSpend = (rows: readonly DayRow[]) => rows.reduce((a, r) => a + r.spend[0] + r.spend[1], 0);
const paidRevenue = (rows: readonly DayRow[]) =>
  rows.reduce((a, r) => a + r.channelRevenue[CHANNEL.paidSearch] + r.channelRevenue[CHANNEL.paidSocial], 0);
const repeatRate = (rows: readonly DayRow[]) => (1 - sum(rows, "newCustomers") / sum(rows, "orders")) * 100;
const marginRate = (rows: readonly DayRow[]) => (sum(rows, "margin") / sum(rows, "net")) * 100;

const per = (bk: Bucket[], fn: (rows: DayRow[]) => number) => bk.map((b) => fn(b.rows));

// ------------------------------------------------------------------ KPIs

function kpi(input: KpiInput, comparison: string): Kpi {
  return {
    label: input.label,
    value: formatValue(input.format, input.current),
    delta: delta(input.current, input.prior, { goodUp: input.goodUp, mode: input.mode, comparison }),
    spark: input.spark,
    sparkColor: input.sparkColor,
    certified: input.certified ?? true,
  };
}

function priorBars(
  labels: readonly string[],
  cur: number[],
  prev: number[],
  colors: readonly string[] | string,
): HBarItem[] {
  return labels.map((label, k) => ({
    label,
    value: cur[k],
    prior: prev[k],
    color: typeof colors === "string" ? colors : colors[k],
  }));
}

// ------------------------------------------------------------------ overview

function overviewInsight(
  range: RangeKey,
  channelCur: number[],
  channelPrev: number[],
  comparison: string,
): Insight {
  if (range === "7d" || range === "30d") {
    const idx = PAUSED_SOCIAL_DAYS.map(dayIndex);
    const social = CHANNEL.paidSocial;
    const now = idx.reduce((a, i) => a + DAYS[i].channelSessions[social], 0);
    const weekBefore = idx.reduce((a, i) => a + DAYS[i - 7].channelSessions[social], 0);
    const impact = idx.reduce(
      (a, i) => a + DAYS[i - 7].channelRevenue[social] - DAYS[i].channelRevenue[social],
      0,
    );
    return {
      body: [
        {
          text: `Paid social sessions fell ${((1 - now / weekBefore) * 100).toFixed(0)}% on Sep 16–18 while the fall campaign was paused for creative review. Estimated net revenue impact: `,
        },
        { text: `−${money(impact)}`, tone: "strong" },
        { text: ", mostly in the West region." },
      ],
      cta: "Ask why →",
      question: "west-dip",
    };
  }
  const best = channelCur.reduce(
    (b, v, k) => (v / channelPrev[k] > channelCur[b] / channelPrev[b] ? k : b),
    0,
  );
  return {
    body: [
      { text: `${CHANNELS[best]} is the fastest-growing channel this period, up ` },
      { text: `${((channelCur[best] / channelPrev[best] - 1) * 100).toFixed(1)}%`, tone: "strong" },
      { text: ` in net revenue vs the ${comparison}.` },
    ],
    cta: "Break it down →",
    question: "channel-growth",
  };
}

export function selectOverview(range: RangeKey): OverviewModel {
  const { comparison } = RANGES[range];
  const cur = periodRows(range);
  const prev = periodRows(range, 1);
  const bk = buckets(range);
  const bkPrev = buckets(range, 1);

  const net = per(bk, (r) => sum(r, "net"));
  const orders = per(bk, (r) => sum(r, "orders"));
  const kNet = sum(cur, "net");
  const pNet = sum(prev, "net");
  const kOrders = sum(cur, "orders");
  const pOrders = sum(prev, "orders");

  const kpis = [
    kpi({ label: "Net revenue", current: kNet, prior: pNet, format: "currency", spark: net }, comparison),
    kpi({ label: "Orders", current: kOrders, prior: pOrders, format: "number", spark: orders }, comparison),
    kpi(
      {
        label: "Avg. order value",
        current: kNet / kOrders,
        prior: pNet / pOrders,
        format: "currency2",
        spark: net.map((n, i) => n / orders[i]),
      },
      comparison,
    ),
    kpi(
      {
        label: "New customers",
        current: sum(cur, "newCustomers"),
        prior: sum(prev, "newCustomers"),
        format: "number",
        spark: per(bk, (r) => sum(r, "newCustomers")),
      },
      comparison,
    ),
    kpi(
      {
        label: "Gross margin",
        current: marginRate(cur),
        prior: marginRate(prev),
        format: "percent",
        mode: "pts",
        spark: per(bk, marginRate),
      },
      comparison,
    ),
    kpi(
      {
        label: "Repeat rate",
        current: repeatRate(cur),
        prior: repeatRate(prev),
        format: "percent",
        mode: "pts",
        spark: per(bk, repeatRate),
        certified: false,
      },
      comparison,
    ),
  ];

  const revenue: TimeSeriesSpec = {
    type: "timeseries",
    labels: bk.map((b) => b.label),
    tips: bk.map((b) => b.tip),
    series: [
      { name: "Net revenue", color: INDIGO, values: net, kind: "area" },
      { name: "Prior period", color: PRIOR, values: per(bkPrev, (r) => sum(r, "net")), kind: "dash" },
    ],
    format: "currency",
    height: 236,
  };

  const channelCur = sumVector(cur, "channelRevenue", CHANNELS.length);
  const channelPrev = sumVector(prev, "channelRevenue", CHANNELS.length);
  const channels = priorBars(CHANNELS, channelCur, channelPrev, CHANNEL_COLORS).sort(
    (a, b) => b.value - a.value,
  );

  const rng = createRng(cur.length);
  const products: ProductRow[] = PRODUCTS.map((p) => {
    const revenueNow = kNet * p.share * rng.uniform(0.94, 1.06);
    const revenuePrev = pNet * p.share * rng.uniform(0.9, 1.08);
    const trend = net.map((v) => v * p.share * rng.uniform(0.85, 1.15));
    return {
      name: p.name,
      category: p.category,
      units: revenueNow / p.price,
      revenue: revenueNow,
      delta: delta(revenueNow, revenuePrev, { comparison }),
      margin: (0.52 + rng.uniform(0, 0.12)) * 100,
      trend,
    };
  });

  const regions = priorBars(REGIONS, sumVector(cur, "regions", 5), sumVector(prev, "regions", 5), TEAL);
  const cadence = granularity(range);

  return {
    tab: "overview",
    kpis,
    revenue,
    revenueSubtitle: `${cadence[0].toUpperCase()}${cadence.slice(1)} · ${comparison} dashed`,
    channels,
    products,
    regions,
    insight: overviewInsight(range, channelCur, channelPrev, comparison),
    comparison,
  };
}

// ------------------------------------------------------------------ revenue

export function selectRevenue(range: RangeKey): RevenueModel {
  const { comparison, label } = RANGES[range];
  const cur = periodRows(range);
  const prev = periodRows(range, 1);
  const bk = buckets(range);

  const gross = sum(cur, "gross");
  const discounts = sum(cur, "discounts");
  const returns = sum(cur, "returns");
  const net = sum(cur, "net");
  const margin = sum(cur, "margin");
  const pGross = sum(prev, "gross");
  const pDiscounts = sum(prev, "discounts");

  const kpis = [
    kpi(
      {
        label: "Gross sales",
        current: gross,
        prior: pGross,
        format: "currency",
        spark: per(bk, (r) => sum(r, "gross")),
      },
      comparison,
    ),
    kpi(
      {
        label: "Discounts",
        current: discounts,
        prior: pDiscounts,
        format: "currency",
        goodUp: false,
        spark: per(bk, (r) => sum(r, "discounts")),
        sparkColor: CORAL,
      },
      comparison,
    ),
    kpi(
      {
        label: "Returns & refunds",
        current: returns,
        prior: sum(prev, "returns"),
        format: "currency",
        goodUp: false,
        spark: per(bk, (r) => sum(r, "returns")),
        sparkColor: CORAL,
      },
      comparison,
    ),
    kpi(
      {
        label: "Net revenue",
        current: net,
        prior: sum(prev, "net"),
        format: "currency",
        spark: per(bk, (r) => sum(r, "net")),
      },
      comparison,
    ),
    kpi(
      {
        label: "Gross margin $",
        current: margin,
        prior: sum(prev, "margin"),
        format: "currency",
        spark: per(bk, (r) => sum(r, "margin")),
        sparkColor: TEAL,
      },
      comparison,
    ),
    kpi(
      {
        label: "Discount rate",
        current: (discounts / gross) * 100,
        prior: (pDiscounts / pGross) * 100,
        format: "percent",
        mode: "pts",
        goodUp: false,
        spark: per(bk, (r) => sum(r, "discounts") / sum(r, "gross")),
        sparkColor: CORAL,
      },
      comparison,
    ),
  ];

  const regionCur = sumVector(cur, "regions", 5);
  const regionPrev = sumVector(prev, "regions", 5);
  const aov = net / sum(cur, "orders");
  const rng = createRng(cur.length * 3);
  const regions: RegionRow[] = REGIONS.map((region, k) => {
    const orders = (regionCur[k] / aov) * rng.uniform(0.96, 1.04);
    return {
      region,
      revenue: regionCur[k],
      orders,
      aov: regionCur[k] / orders,
      margin: 54 + rng.uniform(0, 5),
      delta: delta(regionCur[k], regionPrev[k], { comparison }),
      trend: per(bk, (rows) => rows.reduce((a, r) => a + r.regions[k], 0)),
    };
  });

  return {
    tab: "revenue",
    kpis,
    categories: {
      type: "stacked",
      labels: bk.map((b) => b.label),
      tips: bk.map((b) => b.tip),
      names: [...CATEGORIES],
      colors: [...CATEGORY_COLORS],
      stacks: bk.map((b) => sumVector(b.rows, "categories", CATEGORIES.length)),
      format: "currency",
      height: 236,
    },
    categoriesSubtitle: `Stacked · ${granularity(range)}`,
    bridge: [
      { label: "Gross sales", value: gross, kind: "total" },
      { label: "Discounts", value: discounts, kind: "reduction" },
      { label: "Returns & refunds", value: returns, kind: "reduction" },
      { label: "Net revenue", value: net, kind: "total" },
      { label: "Landed COGS", value: net - margin, kind: "reduction" },
      { label: "Gross margin", value: margin, kind: "total" },
    ],
    regions,
    margin: {
      type: "timeseries",
      labels: bk.map((b) => b.label),
      tips: bk.map((b) => b.tip),
      series: [{ name: "Gross margin %", color: TEAL, values: per(bk, marginRate), kind: "line" }],
      format: "percent",
      height: 170,
      zero: false,
    },
    rangeLabel: label,
    comparison,
  };
}

// ------------------------------------------------------------------ retention

export function selectRetention(range: RangeKey): RetentionModel {
  const { comparison } = RANGES[range];
  const cur = periodRows(range);
  const prev = periodRows(range, 1);
  const bk = buckets(range);
  const f = MATURITY_FACTOR[range];
  const s = RETENTION_SNAPSHOT;

  // Active customers: distinct buyers over a trailing year (≈ 0.61 customers per order).
  const active = sum(DAYS.slice(-365), "orders") * 0.61;
  const activePrior = sum(DAYS.slice(-365 - cur.length, -cur.length), "orders") * 0.61;

  const kpis = [
    kpi(
      {
        label: "Active customers",
        current: active,
        prior: activePrior,
        format: "number",
        spark: per(bk, (r) => sum(r, "orders")),
      },
      comparison,
    ),
    kpi(
      {
        label: "Repeat purchase rate",
        current: repeatRate(cur),
        prior: repeatRate(prev),
        format: "percent",
        mode: "pts",
        spark: per(bk, repeatRate),
      },
      comparison,
    ),
    kpi(
      {
        label: "90-day retention",
        current: s.retention90d.current * f,
        prior: s.retention90d.prior,
        format: "percent",
        mode: "pts",
        spark: [...s.retention90d.history, s.retention90d.current * f],
      },
      comparison,
    ),
    kpi(
      {
        label: "12-month LTV",
        current: s.ltv12m.current * f,
        prior: s.ltv12m.prior,
        format: "currency2",
        spark: [...s.ltv12m.history, 214 * f],
      },
      comparison,
    ),
    kpi(
      {
        label: "Days to 2nd order",
        current: s.daysToSecondOrder.current / f,
        prior: s.daysToSecondOrder.prior,
        format: "decimal",
        goodUp: false,
        spark: [...s.daysToSecondOrder.history, s.daysToSecondOrder.current / f],
        sparkColor: TEAL,
        certified: false,
      },
      comparison,
    ),
    kpi(
      {
        label: "Orders per customer",
        current: s.ordersPerCustomer.current * f,
        prior: s.ordersPerCustomer.prior,
        format: "decimal2",
        spark: [...s.ordersPerCustomer.history, s.ordersPerCustomer.current * f],
      },
      comparison,
    ),
  ];

  const months = Array.from({ length: 11 }, (_, i) => i + 1);

  return {
    tab: "retention",
    kpis,
    cohorts: buildCohortTable(range === "7d" || range === "30d" ? "week" : "month"),
    curves: {
      type: "timeseries",
      labels: months.map((m) => `M${m}`),
      tips: months.map((m) => `Month ${m} after first order`),
      series: CHANNEL_RETENTION_CURVES.map((c) => ({
        name: c.name,
        color: c.color,
        values: c.values.slice(1),
        kind: "line" as const,
      })),
      format: "percent",
      height: 200,
      endLabels: true,
    },
    categoryRepeat: CATEGORY_REPEAT_RATE.map(([label, value, prior]) => ({
      label,
      value,
      prior,
      color: INDIGO,
    })),
    comparison,
  };
}

// ------------------------------------------------------------------ acquisition

export function selectAcquisition(range: RangeKey): AcquisitionModel {
  const { comparison, label } = RANGES[range];
  const cur = periodRows(range);
  const prev = periodRows(range, 1);
  const bk = buckets(range);

  const sessions = sum(cur, "sessions");
  const pSessions = sum(prev, "sessions");
  const orders = sum(cur, "orders");
  const pOrders = sum(prev, "orders");
  const spend = totalSpend(cur);
  const pSpend = totalSpend(prev);
  const newCustomers = sum(cur, "newCustomers");
  const pNewCustomers = sum(prev, "newCustomers");

  const kpis = [
    kpi(
      {
        label: "Sessions",
        current: sessions,
        prior: pSessions,
        format: "number",
        spark: per(bk, (r) => sum(r, "sessions")),
      },
      comparison,
    ),
    kpi(
      {
        label: "Conversion rate",
        current: (orders / sessions) * 100,
        prior: (pOrders / pSessions) * 100,
        format: "percent2",
        mode: "pts",
        spark: per(bk, (r) => sum(r, "orders") / sum(r, "sessions")),
      },
      comparison,
    ),
    kpi(
      {
        label: "Paid media spend",
        current: spend,
        prior: pSpend,
        format: "currency",
        goodUp: false,
        spark: per(bk, totalSpend),
        sparkColor: AMBER,
      },
      comparison,
    ),
    kpi(
      {
        label: "Blended CAC",
        current: spend / newCustomers,
        prior: pSpend / pNewCustomers,
        format: "currency2",
        goodUp: false,
        spark: per(bk, (r) => totalSpend(r) / sum(r, "newCustomers")),
        sparkColor: CORAL,
      },
      comparison,
    ),
    kpi(
      {
        label: "ROAS (paid)",
        current: paidRevenue(cur) / spend,
        prior: paidRevenue(prev) / pSpend,
        format: "multiple",
        spark: per(bk, (r) => paidRevenue(r) / totalSpend(r)),
      },
      comparison,
    ),
    kpi(
      {
        label: "New customers",
        current: newCustomers,
        prior: pNewCustomers,
        format: "number",
        spark: per(bk, (r) => sum(r, "newCustomers")),
      },
      comparison,
    ),
  ];

  const channelSeries = CHANNELS.map((name, k) => ({
    name,
    color: CHANNEL_COLORS[k],
    values: per(bk, (rows) => rows.reduce((a, r) => a + r.channelSessions[k], 0)),
    kind: "line" as const,
  }));

  const aov = sum(cur, "net") / orders;
  const rng = createRng(cur.length * 5);
  const campaigns: CampaignRow[] = CAMPAIGNS.map((c) => {
    const campaignSpend = cur.reduce((a, r) => a + r.spend[c.channel - 1], 0) * c.share;
    const campaignSessions =
      cur.reduce((a, r) => a + r.channelSessions[c.channel], 0) * c.share * rng.uniform(0.9, 1.1);
    const cvr = CHANNEL_CVR[c.channel] * rng.uniform(0.85, 1.2);
    return {
      name: c.name,
      channel: CHANNELS[c.channel],
      color: CHANNEL_COLORS[c.channel],
      spend: campaignSpend,
      sessions: campaignSessions,
      cvr: cvr * 100,
      // ~62% of campaign orders come from first-time buyers
      cac: campaignSpend / (campaignSessions * cvr * 0.62),
      roas: (campaignSessions * cvr * aov) / campaignSpend,
      trend: channelSeries[c.channel].values.map((v) => v * rng.uniform(0.8, 1.2)),
    };
  });

  return {
    tab: "acquisition",
    kpis,
    sessions: {
      type: "timeseries",
      labels: bk.map((b) => b.label),
      tips: bk.map((b) => b.tip),
      series: channelSeries,
      format: "number",
      height: 236,
    },
    funnel: [
      { label: "Sessions", value: sessions },
      { label: "Viewed a product", value: sum(cur, "productViews") },
      { label: "Added to cart", value: sum(cur, "addToCart") },
      { label: "Reached checkout", value: sum(cur, "checkouts") },
      { label: "Placed an order", value: orders },
    ],
    campaigns,
    rangeLabel: label,
    comparison,
  };
}

// ------------------------------------------------------------------ entry points

export function selectPanel(tab: TabKey, range: RangeKey): PanelModel {
  switch (tab) {
    case "overview":
      return selectOverview(range);
    case "revenue":
      return selectRevenue(range);
    case "retention":
      return selectRetention(range);
    case "acquisition":
      return selectAcquisition(range);
  }
}

/** The Monday email: last 7 days against the week before. */
export function selectWeeklyDigest(): Kpi[] {
  const cur = periodRows("7d");
  const prev = periodRows("7d", 1);
  const comparison = "prior week";
  const net = sum(cur, "net");
  const pNet = sum(prev, "net");
  return [
    kpi(
      { label: "Net revenue", current: net, prior: pNet, format: "currency", spark: cur.map((r) => r.net) },
      comparison,
    ),
    kpi(
      {
        label: "Orders",
        current: sum(cur, "orders"),
        prior: sum(prev, "orders"),
        format: "number",
        spark: cur.map((r) => r.orders),
      },
      comparison,
    ),
    kpi(
      {
        label: "New customers",
        current: sum(cur, "newCustomers"),
        prior: sum(prev, "newCustomers"),
        format: "number",
        spark: cur.map((r) => r.newCustomers),
      },
      comparison,
    ),
    kpi(
      {
        label: "Gross margin",
        current: marginRate(cur),
        prior: marginRate(prev),
        format: "percent",
        mode: "pts",
        spark: cur.map((r) => r.margin / r.net),
        sparkColor: TEAL,
      },
      comparison,
    ),
  ];
}

/** Weekly net revenue for the metric detail page (last 12 full weeks) and the trailing 30-day total. */
export function selectNetRevenueTrend(): { chart: TimeSeriesSpec; last30: string } {
  const window = DAYS.slice(-90);
  const starts = Array.from({ length: 12 }, (_, w) => w * 7);
  return {
    chart: {
      type: "timeseries",
      labels: starts.map((i) => fmt.day(window[i].date)),
      tips: starts.map((i) => `Week of ${fmt.day(window[i].date)}`),
      series: [
        {
          name: "Net revenue",
          color: INDIGO,
          values: starts.map((i) => sum(window.slice(i, i + 7), "net")),
          kind: "area",
        },
      ],
      format: "currency",
      height: 170,
    },
    last30: money(sum(DAYS.slice(-30), "net")),
  };
}

// ------------------------------------------------------------------ guards

export const isRangeKey = (v: unknown): v is RangeKey => typeof v === "string" && v in RANGES;
export const isTabKey = (v: unknown): v is TabKey => TABS.some((t) => t.key === v);
