import type { HBarItem, StackedColumnsSpec, TimeSeriesSpec, ValueFormat } from "./charts";

export type RangeKey = "7d" | "30d" | "90d" | "12m";
export type TabKey = "overview" | "revenue" | "retention" | "acquisition";

/** One simulated trading day for the sample workspace. Vector fields are indexed by the dimension lists in lib/data/dimensions. */
export interface DayRow {
  date: Date;
  sessions: number;
  channelSessions: number[];
  channelOrders: number[];
  channelRevenue: number[];
  orders: number;
  net: number;
  gross: number;
  discounts: number;
  returns: number;
  margin: number;
  newCustomers: number;
  categories: number[];
  regions: number[];
  /** Paid media spend: [paid search, paid social]. */
  spend: [number, number];
  productViews: number;
  addToCart: number;
  checkouts: number;
}

export type ScalarKey = { [K in keyof DayRow]: DayRow[K] extends number ? K : never }[keyof DayRow];
export type VectorKey = { [K in keyof DayRow]: DayRow[K] extends number[] ? K : never }[keyof DayRow];

export interface RangeDefinition {
  key: RangeKey;
  label: string;
  short: string;
  /** Rolling window length in days; null for calendar months. */
  days: number | null;
  comparison: string;
}

export interface Bucket {
  label: string;
  tip: string;
  rows: DayRow[];
}

export type DeltaMode = "pct" | "pts";

export interface Delta {
  text: string;
  direction: "up" | "down" | "flat";
  tone: "good" | "bad" | "flat";
  comparison: string;
}

export interface Kpi {
  label: string;
  value: string;
  delta: Delta;
  spark: number[];
  sparkColor?: string;
  certified: boolean;
}

/** Inline rich text used by insights and AI answers, rendered without raw HTML. */
export type RichText = Array<{ text: string; tone?: "strong" | "code" }>;

export interface Insight {
  body: RichText;
  cta: string;
  question: AskIntentRef;
}

export type AskIntentRef = "west-dip" | "channel-growth" | "retention-trend";

export interface ProductRow {
  name: string;
  category: string;
  units: number;
  revenue: number;
  delta: Delta;
  margin: number;
  trend: number[];
}

export interface RegionRow {
  region: string;
  revenue: number;
  orders: number;
  aov: number;
  margin: number;
  delta: Delta;
  trend: number[];
}

export interface CampaignRow {
  name: string;
  channel: string;
  color: string;
  spend: number;
  sessions: number;
  cvr: number;
  cac: number;
  roas: number;
  trend: number[];
}

export interface WaterfallStep {
  label: string;
  value: number;
  kind: "total" | "reduction";
}

export interface FunnelStep {
  label: string;
  value: number;
}

export interface CohortRow {
  label: string;
  size: number;
  /** Retention by period; null where the cohort is too young to have a value. */
  cells: Array<number | null>;
}

export interface CohortTable {
  kind: "week" | "month";
  headers: string[];
  rows: CohortRow[];
  /** First-period retention of the base curve; cell shading is relative to it. */
  reference: number;
}

export interface OverviewModel {
  tab: "overview";
  kpis: Kpi[];
  revenue: TimeSeriesSpec;
  revenueSubtitle: string;
  channels: HBarItem[];
  products: ProductRow[];
  regions: HBarItem[];
  insight: Insight;
  comparison: string;
}

export interface RevenueModel {
  tab: "revenue";
  kpis: Kpi[];
  categories: StackedColumnsSpec;
  categoriesSubtitle: string;
  bridge: WaterfallStep[];
  regions: RegionRow[];
  margin: TimeSeriesSpec;
  rangeLabel: string;
  comparison: string;
}

export interface RetentionModel {
  tab: "retention";
  kpis: Kpi[];
  cohorts: CohortTable;
  curves: TimeSeriesSpec;
  categoryRepeat: HBarItem[];
  comparison: string;
}

export interface AcquisitionModel {
  tab: "acquisition";
  kpis: Kpi[];
  sessions: TimeSeriesSpec;
  funnel: FunnelStep[];
  campaigns: CampaignRow[];
  rangeLabel: string;
  comparison: string;
}

export type PanelModel = OverviewModel | RevenueModel | RetentionModel | AcquisitionModel;

export interface KpiInput {
  label: string;
  current: number;
  prior: number;
  format: ValueFormat;
  spark: number[];
  sparkColor?: string;
  goodUp?: boolean;
  mode?: DeltaMode;
  certified?: boolean;
}
