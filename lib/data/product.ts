import type { IconName } from "@/components/ui/icons";

export const PRODUCT_SECTIONS = [
  { id: "ask", label: "Ask AI" },
  { id: "dashboards", label: "Dashboards" },
  { id: "metrics", label: "Semantic layer" },
  { id: "reports", label: "Reports & alerts" },
  { id: "security", label: "Security" },
  { id: "connect", label: "Connections" },
] as const;

export interface Tile {
  icon: IconName;
  title: string;
  body: string;
}

export const ASK_CAPABILITIES = [
  "Shows metrics used, filters and generated SQL on every answer",
  "Breaks a change down by channel, region or product automatically",
  "Follow-up questions keep context: “now only returning customers”",
  "Admins can review, correct and approve answers the whole team sees",
];

export const DASHBOARD_TILES: Tile[] = [
  {
    icon: "filter",
    title: "Shared filters and ranges",
    body: "One date picker and comparison period for the whole page, with URL state so shared links open exactly what you saw.",
  },
  {
    icon: "table",
    title: "Drill down to rows",
    body: "Click any bar or point to see the orders, customers or products behind it, filtered by the same certified definition.",
  },
  {
    icon: "eye",
    title: "Usage you can see",
    body: "Know which dashboards get opened and which tiles nobody reads, so cleanup is a decision instead of a guess.",
  },
];

export const SEMANTIC_LAYER_POINTS = [
  "Imports existing dbt semantic models and exposures",
  "Joins, filters and time grains declared once",
  "Column-level lineage from raw table to every consumer",
  "Query results cached per metric to keep warehouse costs predictable",
];

export const REPORT_POINTS = [
  "Per-recipient filters: each region lead gets their own region",
  "Written summaries generated from certified metrics only",
  "Quiet hours and digest mode, so alerts stay useful",
];

export const SECURITY_TILES: Tile[] = [
  {
    icon: "lock",
    title: "Read-only by design",
    body: "Connect with a read-only role. Lumenboard never writes to your warehouse and never copies full tables out of it.",
  },
  {
    icon: "users",
    title: "SSO, SCIM and roles",
    body: "SAML single sign-on, automatic provisioning and roles for admins, editors and viewers.",
  },
  {
    icon: "shield",
    title: "Row-level permissions",
    body: "Rules follow the metric: a regional manager sees their region in dashboards, reports and AI answers alike.",
  },
  {
    icon: "eye",
    title: "Audit log",
    body: "Every query, export, definition change and AI answer is logged with who asked and what ran.",
  },
  {
    icon: "bolt",
    title: "Model controls",
    body: "AI features can be scoped per workspace. Row-level data isn't used to train models.",
  },
  {
    icon: "git",
    title: "Change review",
    body: "Metric changes go through review and can be rolled back, with a diff of which dashboards will change.",
  },
];

export const CONNECTIONS = [
  { name: "Snowflake", detail: "Key-pair or OAuth" },
  { name: "BigQuery", detail: "Service account" },
  { name: "Databricks", detail: "SQL warehouse" },
  { name: "Redshift", detail: "IAM or password" },
  { name: "Postgres", detail: "Direct or SSH tunnel" },
  { name: "ClickHouse", detail: "Cloud & self-hosted" },
  { name: "dbt Core & Cloud", detail: "Models & metrics sync" },
  { name: "Slack & email", detail: "Reports and alerts" },
];

export const MONDAY_SCHEDULE = {
  name: "Monday metrics",
  source: "Executive overview · 4 tiles + AI summary",
  recipient: "exec@harborpine.example",
  channels: ["#leadership", "+2"],
  days: ["M", "T", "W", "T", "F", "S", "S"],
  activeDays: [0],
  time: "7:30 AM PT",
  tiles: ["Net revenue", "Orders", "New customers", "Gross margin"],
  alert: { channel: "#growth", metric: "blended_cac", rule: "rises above $48 for 2 days" },
};

export const CATALOG_TILES: Tile[] = [
  {
    icon: "book",
    title: "Certification that means something",
    body: "A certified badge requires an owner, a description, a reviewed definition and passing tests against sample periods.",
  },
  {
    icon: "clock",
    title: "Freshness on every metric",
    body: "See when each metric last refreshed and get a warning on any dashboard tile that's running on stale data.",
  },
  {
    icon: "chart",
    title: "Usage-aware cleanup",
    body: "Spot duplicate or unused metrics and merge them, with a list of every dashboard and report that would change.",
  },
];

export const CATALOG_FILTERS = [
  "All",
  "Certified",
  "Finance",
  "Growth",
  "Operations",
  "Needs review",
] as const;
