/**
 * The semantic layer: one reviewed definition per metric. Dashboards, scheduled reports and Ask AI all
 * compile queries from these definitions, never from raw column names.
 */
import { AMBER, CORAL, INDIGO, TEAL } from "@/lib/palette";
import type { QueryPlan } from "@/types/ask";
import type { MetricDefinition, MetricOwner, Team } from "@/types/metrics";

export const OWNERS: Record<Team, MetricOwner> = {
  Finance: { team: "Finance", initials: "DR", color: INDIGO },
  "Data team": { team: "Data team", initials: "MT", color: TEAL },
  Growth: { team: "Growth", initials: "PS", color: AMBER },
  Operations: { team: "Operations", initials: "LM", color: CORAL },
};

const ORDER_FILTERS = ["is_test = false", "status != 'cancelled'"];
const ORDER_DIMENSIONS = ["channel", "ship_region", "category", "customer_type"];

export const METRICS: MetricDefinition[] = [
  {
    key: "net_revenue",
    label: "Net revenue",
    description: "Gross sales less discounts, returns and refunds. Excludes tax, shipping and test orders.",
    owner: OWNERS.Finance,
    model: "fct_order_lines",
    measure: { aggregation: "sum", expression: "gross_amount - discount_amount - refund_amount" },
    timeDimension: "ordered_at",
    filters: ORDER_FILTERS,
    dimensions: ORDER_DIMENSIONS,
    format: "currency_usd",
    status: "certified",
    freshness: "6 min ago",
    dashboards: 14,
    aiAnswers30d: 212,
  },
  {
    key: "orders",
    label: "Orders",
    description: "Completed, non-test orders.",
    owner: OWNERS["Data team"],
    model: "dim_orders",
    measure: { aggregation: "count_distinct", expression: "order_id" },
    timeDimension: "ordered_at",
    filters: ORDER_FILTERS,
    dimensions: ORDER_DIMENSIONS,
    format: "count",
    status: "certified",
    freshness: "6 min ago",
    dashboards: 11,
    aiAnswers30d: 148,
  },
  {
    key: "aov",
    label: "Average order value",
    description: "Net revenue ÷ orders.",
    owner: OWNERS.Finance,
    model: "fct_order_lines",
    measure: { aggregation: "ratio", expression: "net_revenue / orders" },
    timeDimension: "ordered_at",
    filters: ORDER_FILTERS,
    dimensions: ORDER_DIMENSIONS,
    format: "currency_usd",
    status: "certified",
    freshness: "6 min ago",
    dashboards: 8,
    aiAnswers30d: 64,
  },
  {
    key: "gross_margin_pct",
    label: "Gross margin %",
    description: "Net revenue less landed COGS, as a share of net revenue.",
    owner: OWNERS.Finance,
    model: "fct_order_lines",
    measure: { aggregation: "ratio", expression: "(net_revenue - landed_cogs) / net_revenue" },
    timeDimension: "ordered_at",
    filters: ORDER_FILTERS,
    dimensions: ["channel", "ship_region", "category"],
    format: "percent",
    status: "certified",
    freshness: "1 hr ago",
    dashboards: 6,
    aiAnswers30d: 57,
  },
  {
    key: "new_customers",
    label: "New customers",
    description: "Customers placing their first order.",
    owner: OWNERS.Growth,
    model: "dim_orders",
    measure: { aggregation: "count_distinct", expression: "case when is_first_order then customer_id end" },
    timeDimension: "ordered_at",
    filters: ORDER_FILTERS,
    dimensions: ["channel", "ship_region", "category"],
    format: "count",
    status: "certified",
    freshness: "6 min ago",
    dashboards: 9,
    aiAnswers30d: 131,
  },
  {
    key: "repeat_purchase_rate",
    label: "Repeat purchase rate",
    description: "Share of orders from returning customers.",
    owner: OWNERS.Growth,
    model: "dim_orders",
    measure: { aggregation: "ratio", expression: "(orders - new_customers) / orders" },
    timeDimension: "ordered_at",
    filters: ORDER_FILTERS,
    dimensions: ["channel", "ship_region", "category"],
    format: "percent",
    status: "certified",
    freshness: "6 min ago",
    dashboards: 5,
    aiAnswers30d: 88,
  },
  {
    key: "retention_90d",
    label: "90-day retention",
    description: "Share of first-time buyers who order again within 90 days.",
    owner: OWNERS["Data team"],
    model: "dim_orders",
    measure: { aggregation: "ratio", expression: "returning_within_90d / first_time_buyers" },
    timeDimension: "first_ordered_at",
    filters: ["is_test = false"],
    dimensions: ["channel", "category"],
    format: "percent",
    status: "certified",
    freshness: "Daily, 5:00 AM",
    dashboards: 4,
    aiAnswers30d: 73,
    customSql: `with firsts as (
  select customer_id, min(ordered_at) as first_at
  from analytics.dim_orders group by 1)
select date_trunc('month', f.first_at) as cohort,
       count(distinct case when o.ordered_at > f.first_at
         and o.ordered_at <= f.first_at + 90
         then f.customer_id end) * 1.0
       / count(distinct f.customer_id) as retention_90d
from firsts f left join analytics.dim_orders o
  on o.customer_id = f.customer_id
group by 1 order by 1`,
  },
  {
    key: "blended_cac",
    label: "Blended CAC",
    description: "Paid media spend ÷ new customers.",
    owner: OWNERS.Growth,
    model: "fct_media_spend",
    measure: { aggregation: "ratio", expression: "paid_media_spend / new_customers" },
    timeDimension: "spend_date",
    filters: [],
    dimensions: ["channel"],
    format: "currency_usd",
    status: "certified",
    freshness: "Hourly",
    dashboards: 4,
    aiAnswers30d: 96,
  },
  {
    key: "roas_paid",
    label: "ROAS (paid)",
    description: "Revenue from paid channels ÷ paid media spend.",
    owner: OWNERS.Growth,
    model: "fct_media_spend",
    measure: { aggregation: "ratio", expression: "paid_net_revenue / paid_media_spend" },
    timeDimension: "spend_date",
    filters: [],
    dimensions: ["channel", "campaign"],
    format: "ratio",
    status: "review",
    freshness: "Hourly",
    dashboards: 3,
    aiAnswers30d: 41,
  },
  {
    key: "session_cvr",
    label: "Conversion rate",
    description: "Orders ÷ sessions.",
    owner: OWNERS.Growth,
    model: "fct_sessions",
    measure: { aggregation: "ratio", expression: "orders / sessions" },
    timeDimension: "session_started_at",
    filters: ["is_bot = false"],
    dimensions: ["channel", "device"],
    format: "percent",
    status: "certified",
    freshness: "Hourly",
    dashboards: 7,
    aiAnswers30d: 52,
  },
  {
    key: "return_rate",
    label: "Return rate",
    description: "Returned units ÷ shipped units.",
    owner: OWNERS.Operations,
    model: "fct_shipments",
    measure: { aggregation: "ratio", expression: "returned_units / shipped_units" },
    timeDimension: "shipped_at",
    filters: [],
    dimensions: ["category", "ship_region"],
    format: "percent",
    status: "certified",
    freshness: "Daily, 5:00 AM",
    dashboards: 3,
    aiAnswers30d: 29,
  },
  {
    key: "inventory_doh",
    label: "Inventory days on hand",
    description: "On-hand units ÷ trailing 28-day daily sell-through.",
    owner: OWNERS.Operations,
    model: "fct_inventory_snapshots",
    measure: { aggregation: "ratio", expression: "on_hand_units / avg_daily_units_sold_28d" },
    timeDimension: "snapshot_date",
    filters: [],
    dimensions: ["category", "warehouse"],
    format: "days",
    status: "draft",
    freshness: "Daily, 5:00 AM",
    dashboards: 1,
    aiAnswers30d: 6,
  },
];

/** Total metrics in the workspace; the catalog table shows the most-used subset. */
export const WORKSPACE_METRIC_COUNT = 48;

export const DIMENSION_COLUMNS: Record<string, string> = {
  channel: "o.first_touch_channel",
  ship_region: "o.ship_region",
  category: "p.category",
  customer_type: "o.customer_type",
};

export function getMetric(key: string): MetricDefinition {
  const metric = METRICS.find((m) => m.key === key);
  if (!metric) throw new Error(`Unknown metric: ${key}`);
  return metric;
}

export const listMetrics = (status?: MetricDefinition["status"]) =>
  status ? METRICS.filter((m) => m.status === status) : METRICS;

const qualify = (expr: string, alias: string) =>
  expr.replace(/\b([a-z][a-z0-9_]*)\b/g, (word) =>
    /^(case|when|then|end|and|or|not|null|true|false)$/.test(word) ? word : `${alias}.${word}`,
  );

function measureSql(metric: MetricDefinition): string {
  const alias = metric.model === "fct_order_lines" ? "l" : "o";
  const { aggregation, expression } = metric.measure;
  if (aggregation === "sum") return `sum(${qualify(expression, alias)})`;
  if (aggregation === "count_distinct") return `count(distinct ${qualify(expression, alias)})`;
  throw new Error(`${metric.key} is a derived metric; compile its components instead`);
}

const quote = (v: string) => `'${v.replace(/'/g, "''")}'`;

/**
 * Compile a query plan to warehouse SQL. Supports a single aggregate metric with optional time grain,
 * dimensions, filters and a prior-period comparison; cohort metrics use their reviewed custom SQL.
 */
export function compileQuery(plan: QueryPlan): string {
  const metric = getMetric(plan.metrics[0]);
  if (metric.customSql) {
    return `-- metric: ${metric.key} (${metric.status}, owner: ${metric.owner.team.toLowerCase()})\n${metric.customSql}`;
  }

  const time = `o.${metric.timeDimension}`;
  const measure = measureSql(metric);
  const dims = plan.dimensions.map((d) => `${DIMENSION_COLUMNS[d] ?? `o.${d}`} as ${d}`);
  const from = [
    `from analytics.${metric.model} l`,
    "join analytics.dim_orders o on o.order_id = l.order_id",
    ...(plan.dimensions.includes("category")
      ? ["join analytics.dim_products p on p.product_id = l.product_id"]
      : []),
  ];
  const where = [
    ...plan.filters.map((f) =>
      Array.isArray(f.value)
        ? `${DIMENSION_COLUMNS[f.dimension]} in (${f.value.map(quote).join(", ")})`
        : `${DIMENSION_COLUMNS[f.dimension]} ${f.operator} ${quote(f.value)}`,
    ),
    ...metric.filters.map((f) => `o.${f}`),
  ];

  if (plan.comparison) {
    if (metric.measure.aggregation !== "sum")
      throw new Error(`Period comparison needs an additive metric, got ${metric.key}`);
    const d = plan.comparison.days;
    const inner = qualify(metric.measure.expression, "l");
    const select = [
      ...dims,
      `sum(case when ${time} >= current_date - ${d}\n           then ${inner} else 0 end) as current_${d}d`,
      `sum(case when ${time} < current_date - ${d}\n           then ${inner} else 0 end) as prior_${d}d`,
    ];
    return [
      `select ${select.join(",\n       ")}`,
      ...from,
      `where ${[`${time} >= current_date - ${d * 2}`, ...where].join("\n  and ")}`,
      `group by ${dims.map((_, i) => i + 1).join(", ")}`,
    ].join("\n");
  }

  const select = [
    ...(plan.grain ? [`date_trunc('${plan.grain}', ${time}) as ${plan.grain}`] : []),
    ...dims,
    `${measure} as ${metric.key}`,
  ];
  const groupCount = select.length - 1;
  return [
    "-- generated from the semantic model",
    `select ${select.join(",\n       ")}`,
    ...from,
    `where ${[...where.slice(0, plan.filters.length), `${time} between ${quote(plan.timeRange.start)} and ${quote(plan.timeRange.end)}`, ...where.slice(plan.filters.length)].join("\n  and ")}`,
    ...(groupCount ? [`group by ${Array.from({ length: groupCount }, (_, i) => i + 1).join(", ")}`] : []),
    ...(plan.grain ? ["order by 1"] : []),
  ].join("\n");
}

/** YAML source of a definition as stored in the metrics repo, split into highlighted tokens per line. */
export type YamlToken = { text: string; kind?: "key" | "string" | "ref" | "comment" };

export function metricYaml(metric: MetricDefinition, path: string): YamlToken[][] {
  const field = (key: string, ...value: YamlToken[]): YamlToken[] => [
    { text: key, kind: "key" },
    { text: ": " },
    ...value,
  ];
  const [first, ...rest] = metric.description.split(". ");
  const agg = metric.measure.aggregation === "count_distinct" ? "count_distinct" : metric.measure.aggregation;
  return [
    [{ text: `# ${path}`, kind: "comment" }],
    field("metric", { text: metric.key, kind: "ref" }),
    field("label", { text: metric.label, kind: "string" }),
    field("description", { text: rest.length ? `${first}.` : first, kind: "string" }),
    ...(rest.length ? [[{ text: `  ${rest.join(". ")}`, kind: "string" as const }]] : []),
    field("owner", { text: metric.owner.team.toLowerCase(), kind: "string" }),
    field("model", { text: metric.model, kind: "ref" }),
    field("measure", { text: agg, kind: "ref" }, { text: `(${metric.measure.expression})` }),
    field(
      "time",
      { text: `${metric.timeDimension}  ` },
      { text: "# day · week · month · quarter", kind: "comment" },
    ),
    field(
      "filters",
      { text: "[" },
      ...metric.filters.flatMap((f, i): YamlToken[] => {
        const m = f.match(/^(.*?)('.*')$/);
        const sep = i ? [{ text: ", " }] : [];
        return m ? [...sep, { text: m[1] }, { text: m[2], kind: "string" }] : [...sep, { text: f }];
      }),
      { text: "]" },
    ),
    field("dimensions", { text: `[${metric.dimensions.join(", ")}]` }),
    field("format", { text: metric.format }),
    field("certified", { text: String(metric.status === "certified"), kind: "ref" }),
  ];
}
