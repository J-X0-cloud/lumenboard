export type CertificationStatus = "certified" | "review" | "draft";
export type Team = "Finance" | "Data team" | "Growth" | "Operations";
export type MetricFormat = "currency_usd" | "count" | "percent" | "ratio" | "days";

export interface MetricMeasure {
  aggregation: "sum" | "count_distinct" | "ratio";
  /** Column expression on the model (sum / count_distinct) or an expression over other metric keys (ratio). */
  expression: string;
}

export interface MetricOwner {
  team: Team;
  initials: string;
  color: string;
}

/** A governed metric definition, mirroring the YAML files in the metrics repo. */
export interface MetricDefinition {
  key: string;
  label: string;
  description: string;
  owner: MetricOwner;
  model: string;
  measure: MetricMeasure;
  timeDimension: string;
  filters: string[];
  dimensions: string[];
  format: MetricFormat;
  status: CertificationStatus;
  freshness: string;
  dashboards: number;
  aiAnswers30d: number;
  /** Hand-written SQL for metrics that are not a simple aggregate (e.g. cohort metrics). */
  customSql?: string;
}

export interface MetricChange {
  initials: string;
  color: string;
  summary: Array<{ text: string; code?: boolean }>;
  date: string;
}
