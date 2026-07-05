export const CONTACT_EMAIL = "hello@lumenboard.com";
export const SUPPORT_EMAIL = "support@lumenboard.com";
export const WALKTHROUGH_URL = `mailto:${CONTACT_EMAIL}?subject=Lumenboard%20walkthrough`;
export const APP_HOST = "app.lumenboard.com";

export const NAV_LINKS = [
  { href: "/product", label: "Product" },
  { href: "/metrics", label: "Metrics catalog" },
  { href: "/pricing", label: "Pricing" },
  { href: "/demo", label: "Live demo" },
] as const;

export interface FooterColumn {
  title: string;
  links: Array<{ href: string; label: string }>;
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { href: "/product#ask", label: "Ask AI" },
      { href: "/product#dashboards", label: "Auto-built dashboards" },
      { href: "/metrics", label: "Metrics catalog" },
      { href: "/product#reports", label: "Scheduled reports" },
      { href: "/product#security", label: "Security" },
      { href: "/demo", label: "Live demo" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/pricing", label: "Pricing" },
      { href: "#", label: "Customer stories" },
      { href: "#", label: "Changelog" },
      { href: "#", label: "Careers" },
      { href: "#", label: "Docs & API" },
    ],
  },
  {
    title: "Get in touch",
    links: [
      { href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL },
      { href: `mailto:${SUPPORT_EMAIL}`, label: SUPPORT_EMAIL },
      { href: WALKTHROUGH_URL, label: "Book a walkthrough" },
      { href: "#", label: "Status" },
    ],
  },
];

export const LEGAL_LINKS = ["Privacy", "Terms", "DPA"];

export const TAGLINE =
  "AI-native business intelligence. Connect your warehouse, define metrics once, and let everyone ask questions in plain English.";
