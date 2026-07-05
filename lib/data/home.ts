import type { IconName } from "@/components/ui/icons";

export const HERO_NOTES: Array<{ icon: IconName; text: string }> = [
  { icon: "lock", text: "Read-only warehouse access" },
  { icon: "db", text: "Queries run in your warehouse" },
  { icon: "check", text: "Free for up to 3 editors" },
];

export const WAREHOUSES = [
  "Snowflake",
  "BigQuery",
  "Databricks",
  "Redshift",
  "Postgres",
  "ClickHouse",
  "MotherDuck",
  "dbt Core & Cloud",
];

export const HOW_IT_WORKS: Array<{ step: string; icon: IconName; title: string; body: string }> = [
  {
    step: "01 · CONNECT",
    icon: "db",
    title: "Point it at your warehouse",
    body: "Read-only credentials, a schema picker and optional dbt sync. Lumenboard reads your models and suggests starter metrics.",
  },
  {
    step: "02 · DEFINE",
    icon: "book",
    title: "Certify your metrics",
    body: "Write definitions in YAML or the editor. Owners, filters, dimensions and formats live in one reviewed, versioned place.",
  },
  {
    step: "03 · ASK",
    icon: "spark",
    title: "Ask in plain English",
    body: "Anyone can ask a question and get a chart, a written explanation and the exact SQL, all from certified metrics.",
  },
  {
    step: "04 · SHARE",
    icon: "mail",
    title: "Pin, schedule, alert",
    body: "Turn any answer into a dashboard tile, a Monday email or a Slack alert when a metric moves outside its normal range.",
  },
];

export const ASK_POINTS = [
  "Grounded in certified metrics, never guessed column names",
  "Explains why a number moved, not just that it did",
  "One click to pin the chart or schedule it as a report",
];

export const GOVERNANCE_POINTS = [
  "YAML in Git or a visual editor, with the same result either way",
  "Owners, certification and change history on every metric",
  "Row-level permissions follow the metric, not the dashboard",
];

export const SCHEDULE_CHIPS: Array<{ icon: IconName; text: string }> = [
  { icon: "clock", text: "Every Monday · 7:30 AM PT" },
  { icon: "mail", text: "exec@ + #leadership" },
  { icon: "bell", text: "Alert if net revenue moves ±12% day over day" },
];

export const PERSONAS: Array<{
  tag: string;
  tone?: "amber" | "green";
  title: string;
  body: string;
  questions: string[];
}> = [
  {
    tag: "Data & analytics",
    title: "Define it once, stop rebuilding it",
    body: "Ship metrics like code, see which ones people actually use, and spend your week on analysis instead of one-off pulls.",
    questions: [
      "Which metrics haven't been queried in 90 days?",
      "Show every dashboard that uses gross_margin_pct",
    ],
  },
  {
    tag: "Finance",
    tone: "amber",
    title: "Close the month with numbers that tie",
    body: "Revenue, margin and refunds match the ledger definitions your controller signed off on, with every drill-down traceable to rows.",
    questions: ["Net revenue by region, month to date vs plan", "Why is gross margin down in August?"],
  },
  {
    tag: "Growth & marketing",
    tone: "green",
    title: "Know what's working this week",
    body: "Channel, campaign and cohort performance on demand, with CAC and ROAS calculated the same way in every meeting.",
    questions: [
      "Which campaigns brought in repeat buyers?",
      "Compare CAC for paid social vs search since July",
    ],
  },
];

export const TESTIMONIAL = {
  quote:
    "We used to spend Monday mornings arguing about whose revenue number was right. Now there is one definition, the AI explains the changes, and the meeting starts with decisions.",
  name: "Dana R.",
  role: "Director of Finance & Analytics, outdoor retail",
  proof: [
    "Answers cite the metric, filters and SQL they used",
    "Nothing leaves your warehouse; queries run in place",
    "SSO, SCIM and row-level permissions",
    "Metric definitions versioned alongside dbt",
  ],
};

export const DIGEST = {
  from: "From: Lumenboard · To: #leadership, exec@harborpine.example",
  subject: "Monday metrics — week of Sep 15",
  sent: "Sent Monday 7:30 AM PT · 4 certified metrics",
  summary:
    "Paid social was paused Sep 16–18 during creative review, which explains most of the dip in West revenue. Email and organic search were steady.",
};
