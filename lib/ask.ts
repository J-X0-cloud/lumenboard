/**
 * Ask Lumenboard: maps a plain-English question to an intent, builds a query plan on certified metrics,
 * compiles SQL through the semantic layer and assembles a chart spec plus a written explanation.
 *
 * The sample workspace ships with three supported question families; anything else gets a hint rather
 * than an improvised answer.
 */
import { addDays } from "date-fns";

import { fmt, isoDate, monthStart } from "@/lib/dates";
import { money } from "@/lib/format";
import { delta } from "@/lib/delta";
import { periodRows, sumVector } from "@/lib/metrics";
import { INDIGO, TEAL } from "@/lib/palette";
import { compileQuery } from "@/lib/semantic-layer";
import { CHANNEL, CHANNEL_COLORS, CHANNELS, REGION, WORKSPACE } from "@/lib/data/dimensions";
import { RETENTION_90D_BY_COHORT } from "@/lib/data/retention";
import { DAYS, END_DATE } from "@/lib/data/simulation";
import type { AskAnswer, AskIntent, AskResponse, QueryPlan } from "@/types/ask";
import type { DayRow } from "@/types/dashboard";

export const SUGGESTED_QUESTIONS: Record<AskIntent, string> = {
  "west-dip": "Why did net revenue dip in the West last week?",
  "channel-growth": "Which channels grew fastest this quarter?",
  "retention-trend": "How is 90-day retention trending for first-time buyers?",
};

export const INTENTS = Object.keys(SUGGESTED_QUESTIONS) as AskIntent[];

export const UNSUPPORTED_HINT =
  "This demo workspace answers questions about revenue by region, channel growth and retention. Try one of the suggestions above.";

const INTENT_PATTERNS: Array<[AskIntent, RegExp]> = [
  ["west-dip", /west|dip|drop|down|why|last week/],
  ["channel-growth", /channel|grow|fast|quarter|source/],
  ["retention-trend", /retain|retention|cohort|repeat|churn/],
];

export function interpretQuestion(question: string): AskIntent | null {
  const q = question.toLowerCase();
  return INTENT_PATTERNS.find(([, re]) => re.test(q))?.[0] ?? null;
}

const sumBy = (rows: readonly DayRow[], pick: (r: DayRow) => number) => rows.reduce((a, r) => a + pick(r), 0);

// ------------------------------------------------------------------ answers

function westDip(): AskAnswer {
  // Last complete week (Mon–Sun) against the week before, plus both weeks as a daily series.
  const last = DAYS.slice(-10, -3);
  const prev = DAYS.slice(-17, -10);
  const fortnight = DAYS.slice(-17, -3);
  const west = sumBy(last, (r) => r.regions[REGION.west]);
  const westPrev = sumBy(prev, (r) => r.regions[REGION.west]);
  // Paid social drives roughly a third of West revenue; attribute the change in that slice.
  const social = sumBy(last, (r) => r.channelRevenue[CHANNEL.paidSocial]) * 0.34;
  const socialPrev = sumBy(prev, (r) => r.channelRevenue[CHANNEL.paidSocial]) * 0.34;
  const drop = westPrev - west;
  const socialShare = drop > 0 ? ((socialPrev - social) / drop) * 100 : 60;
  const a = last[0].date;
  const b = last[last.length - 1].date;

  const plan: QueryPlan = {
    metrics: ["net_revenue"],
    dimensions: ["channel"],
    filters: [{ dimension: "ship_region", operator: "=", value: "West" }],
    timeRange: { start: isoDate(prev[0].date), end: isoDate(b) },
    grain: "day",
  };

  return {
    intent: "west-dip",
    question: SUGGESTED_QUESTIONS["west-dip"],
    steps: [
      [
        { text: "Used certified metrics " },
        { text: "net_revenue", tone: "code" },
        { text: " " },
        { text: "sessions", tone: "code" },
      ],
      [
        { text: "Filtered " },
        { text: "region = West", tone: "code" },
        { text: `, ${fmt.day(a)}–${fmt.day(b)} vs prior week` },
      ],
      [{ text: "Decomposed the change by channel and product category" }],
    ],
    card: {
      title: "West · net revenue, last 14 days",
      headline: { value: money(west), delta: delta(west, westPrev, { comparison: "prior week" }) },
      chart: {
        type: "timeseries",
        labels: fortnight.map((r) => fmt.day(r.date)),
        tips: fortnight.map((r) => fmt.weekdayShort(r.date)),
        series: [
          {
            name: "West net revenue",
            color: INDIGO,
            values: fortnight.map((r) => r.regions[REGION.west]),
            kind: "area",
          },
        ],
        format: "currency",
        height: 118,
        zero: false,
        xTicks: 4,
      },
    },
    narrative: [
      { text: "Net revenue in the West fell " },
      { text: money(drop), tone: "strong" },
      { text: " week over week. About " },
      { text: `${Math.min(socialShare, 88).toFixed(0)}%`, tone: "strong" },
      { text: " of the drop comes from " },
      { text: "Paid social", tone: "strong" },
      {
        text: ": the fall campaign was paused Sep 16–18 for creative review and West sessions from that channel fell by about two thirds on those days. Organic and email held steady, and average order value was flat, so this looks like a traffic gap, not a demand problem.",
      },
    ],
    plan,
    sql: compileQuery(plan),
    actions: [
      { icon: "pin", label: "Pin to dashboard" },
      { icon: "mail", label: "Add to Monday report" },
      { icon: "share", label: "Share" },
    ],
  };
}

function channelGrowth(): AskAnswer {
  const cur = sumVector(periodRows("90d"), "channelRevenue", CHANNELS.length);
  const prev = sumVector(periodRows("90d", 1), "channelRevenue", CHANNELS.length);
  const growth = (k: number) => (cur[k] / prev[k] - 1) * 100;
  const order = CHANNELS.map((_, k) => k).sort((x, y) => cur[y] / prev[y] - cur[x] / prev[x]);
  const [best, second] = order;
  const paidShare =
    ((cur[CHANNEL.paidSearch] + cur[CHANNEL.paidSocial]) / cur.reduce((s, v) => s + v, 0)) * 100;

  const plan: QueryPlan = {
    metrics: ["net_revenue"],
    dimensions: ["channel"],
    filters: [],
    timeRange: { start: isoDate(addDays(END_DATE, -179)), end: isoDate(END_DATE) },
    comparison: { kind: "prior_period", days: 90 },
  };

  return {
    intent: "channel-growth",
    question: SUGGESTED_QUESTIONS["channel-growth"],
    steps: [
      [
        { text: "Used certified metric " },
        { text: "net_revenue", tone: "code" },
        { text: " by " },
        { text: "first_touch_channel", tone: "code" },
      ],
      [{ text: "Compared the last 90 days with the 90 days before" }],
    ],
    card: {
      title: "Net revenue by channel · last 90 days",
      chart: {
        type: "hbar",
        items: order.map((k) => ({
          label: CHANNELS[k],
          value: cur[k],
          prior: prev[k],
          color: CHANNEL_COLORS[k],
        })),
        format: "currency",
        comparison: "prior 90 days",
      },
    },
    narrative: [
      { text: CHANNELS[best], tone: "strong" },
      { text: " grew fastest, up " },
      { text: `${growth(best).toFixed(1)}%`, tone: "strong" },
      {
        text: ` to ${money(cur[best])}. ${CHANNELS[second]} followed at ${growth(second).toFixed(1)}%. Every channel grew, so the mix shift is modest: paid channels are ${paidShare.toFixed(0)}% of net revenue, the same share as last quarter within a point.`,
      },
    ],
    plan,
    sql: compileQuery(plan),
    actions: [
      { icon: "pin", label: "Pin to dashboard" },
      { icon: "bell", label: "Alert on changes" },
      { icon: "share", label: "Share" },
    ],
  };
}

function retentionTrend(): AskAnswer {
  // Cohorts need 90 days to mature, so the newest complete cohort is three months back.
  const months = Array.from({ length: 12 }, (_, i) => monthStart(END_DATE, 14 - i));
  const values = RETENTION_90D_BY_COHORT;
  const latest = values[values.length - 1];

  const plan: QueryPlan = {
    metrics: ["retention_90d"],
    dimensions: [],
    filters: [],
    timeRange: { start: isoDate(months[0]), end: isoDate(addDays(monthStart(END_DATE, 2), -1)) },
    grain: "month",
  };

  return {
    intent: "retention-trend",
    question: SUGGESTED_QUESTIONS["retention-trend"],
    steps: [
      [
        { text: "Used certified metric " },
        { text: "retention_90d", tone: "code" },
        { text: " (first-order cohorts)" },
      ],
      [{ text: "Excluded cohorts younger than 90 days" }],
    ],
    card: {
      title: "90-day retention by first-order month",
      headline: {
        value: `${latest.toFixed(1)}%`,
        delta: delta(latest, values[0], { mode: "pts", comparison: "first cohort in view" }),
      },
      chart: {
        type: "timeseries",
        labels: months.map(fmt.month),
        tips: months.map((m) => `${fmt.monthLong(m)} cohort`),
        series: [{ name: "90-day retention", color: TEAL, values, kind: "line" }],
        format: "percent",
        height: 118,
        zero: false,
        xTicks: 4,
      },
    },
    narrative: [
      { text: "Retention for first-time buyers has recovered from the holiday dip. The " },
      { text: "November and December cohorts", tone: "strong" },
      {
        text: " came in near 19–20% because gift buyers rarely return, while every cohort since February has held between 24% and 26%. The newest complete cohort (June) is the best of the year at ",
      },
      { text: `${latest.toFixed(1)}%`, tone: "strong" },
      { text: "." },
    ],
    plan,
    sql: compileQuery(plan),
    actions: [
      { icon: "pin", label: "Pin to dashboard" },
      { icon: "mail", label: "Schedule weekly" },
      { icon: "share", label: "Share" },
    ],
  };
}

const BUILDERS: Record<AskIntent, () => AskAnswer> = {
  "west-dip": westDip,
  "channel-growth": channelGrowth,
  "retention-trend": retentionTrend,
};

export function buildAnswer(intent: AskIntent): AskAnswer {
  return BUILDERS[intent]();
}

export function answerQuestion(question: string, workspace: string = WORKSPACE.id): AskResponse {
  const intent = workspace === WORKSPACE.id ? interpretQuestion(question) : null;
  if (!intent) {
    return {
      ok: false,
      error: "unsupported_question",
      hint: UNSUPPORTED_HINT,
      suggestions: Object.values(SUGGESTED_QUESTIONS),
    };
  }
  return { ok: true, answer: buildAnswer(intent) };
}
