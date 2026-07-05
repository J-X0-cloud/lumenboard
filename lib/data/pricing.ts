import { WALKTHROUGH_URL } from "./site";

export interface PricingTier {
  name: string;
  audience: string;
  price: string;
  unit?: string;
  cta: { label: string; href: string; variant: "ghost" | "ink" | "amber" };
  features: string[];
  popular?: boolean;
}

export const TIERS: PricingTier[] = [
  {
    name: "Free",
    audience: "For a small data team trying Lumenboard on real data.",
    price: "$0",
    cta: { label: "Start with the demo", href: "/demo", variant: "ghost" },
    features: ["Up to 3 editors", "1 warehouse connection", "250 AI questions / month", "Metrics catalog"],
  },
  {
    name: "Team",
    audience: "For growing companies standardizing their core metrics.",
    price: "$59",
    unit: "/ editor / mo",
    cta: { label: "Talk to us", href: WALKTHROUGH_URL, variant: "ink" },
    features: [
      "Unlimited editors",
      "3 warehouse connections",
      "5,000 AI questions / month",
      "Scheduled reports",
      "dbt sync & metrics in Git",
    ],
  },
  {
    name: "Business",
    audience: "For companies rolling governed BI out to every department.",
    price: "$99",
    unit: "/ editor / mo",
    cta: { label: "Book a walkthrough", href: WALKTHROUGH_URL, variant: "amber" },
    features: [
      "Everything in Team",
      "25,000 AI questions / month",
      "Alerts & anomaly detection",
      "Row-level permissions",
      "SSO & SCIM",
      "Guided onboarding",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    audience: "For large or regulated teams with custom requirements.",
    price: "Custom",
    cta: { label: "Contact sales", href: WALKTHROUGH_URL, variant: "ghost" },
    features: [
      "Everything in Business",
      "Custom AI volume",
      "Audit log export",
      "Uptime SLA",
      "Dedicated support channel",
    ],
  },
];

/** `true` renders a check, `false` a dash, strings are shown as-is. Order: Free, Team, Business, Enterprise. */
export type PlanCell = string | boolean;

export interface ComparisonGroup {
  group: string;
  rows: Array<{ feature: string; plans: [PlanCell, PlanCell, PlanCell, PlanCell] }>;
}

export const COMPARISON: ComparisonGroup[] = [
  {
    group: "Usage",
    rows: [
      { feature: "Editors", plans: ["Up to 3", "Unlimited", "Unlimited", "Unlimited"] },
      { feature: "Viewers", plans: ["Unlimited", "Unlimited", "Unlimited", "Unlimited"] },
      { feature: "Warehouse connections", plans: ["1", "3", "Unlimited", "Unlimited"] },
      { feature: "AI questions per month", plans: ["250", "5,000", "25,000", "Custom"] },
    ],
  },
  {
    group: "Analysis",
    rows: [
      { feature: "Ask AI with SQL and explanations", plans: [true, true, true, true] },
      { feature: "Auto-built dashboards", plans: [true, true, true, true] },
      { feature: "Drill down to rows", plans: [true, true, true, true] },
      { feature: "Scheduled email & Slack reports", plans: [false, true, true, true] },
      { feature: "Metric alerts & anomaly detection", plans: [false, false, true, true] },
    ],
  },
  {
    group: "Governance",
    rows: [
      { feature: "Metrics catalog & certification", plans: [true, true, true, true] },
      { feature: "dbt sync & metrics in Git", plans: [false, true, true, true] },
      { feature: "Row-level permissions", plans: [false, false, true, true] },
      { feature: "SSO (SAML) & SCIM", plans: [false, false, true, true] },
      { feature: "Audit log export", plans: [false, false, false, true] },
    ],
  },
  {
    group: "Support",
    rows: [
      { feature: "Help center & community", plans: [true, true, true, true] },
      { feature: "Email support", plans: [false, true, true, true] },
      { feature: "Onboarding with a data engineer", plans: [false, false, true, true] },
      { feature: "Uptime SLA & dedicated channel", plans: [false, false, false, true] },
    ],
  },
];

export const PRICING_FAQ = [
  {
    q: "Who counts as an editor?",
    a: "Anyone who creates or edits dashboards, metrics or scheduled reports. People who view dashboards, receive reports or ask the AI questions are viewers, and viewers are free on every plan.",
  },
  {
    q: "Does our data leave the warehouse?",
    a: "Queries run in your warehouse using a read-only role. Lumenboard stores metadata such as metric definitions and dashboard layouts, plus short-lived cached results to keep dashboards fast. You can set the cache duration or turn it off.",
  },
  {
    q: "What happens when we hit the AI question limit?",
    a: "Nothing breaks. Dashboards and reports keep working and we'll let admins know so you can move to the next plan or add a question pack.",
  },
  {
    q: "Do we need dbt?",
    a: "No. You can define metrics in the app on top of any tables. If you do use dbt, Lumenboard syncs your models and keeps metric definitions next to them in Git.",
  },
  {
    q: "Can we try it on our own data?",
    a: "Yes. The Free plan connects to one warehouse with up to three editors, with no time limit. For a guided pilot on Business, book a walkthrough and we'll set it up with your team.",
  },
];
