/** Lineage of `net_revenue`: warehouse tables → dbt models → metric → consumers. */
export const LINEAGE_COLUMNS = [
  {
    x: 10,
    title: "Warehouse tables",
    items: ["raw.orders", "raw.order_lines", "raw.refunds", "raw.product_costs"],
  },
  { x: 205, title: "dbt models", items: ["stg_orders", "fct_order_lines", "dim_products"] },
  { x: 400, title: "Metric", items: ["net_revenue"] },
  {
    x: 575,
    title: "Used by",
    items: ["Executive overview", "Monday metrics report", "212 AI answers (30d)", "Revenue alert · West"],
  },
] as const;

export const LINEAGE_FOCUS = "net_revenue";

export const LINEAGE_EDGES: Array<[string, string]> = [
  ["raw.orders", "stg_orders"],
  ["raw.order_lines", "fct_order_lines"],
  ["raw.refunds", "fct_order_lines"],
  ["raw.product_costs", "dim_products"],
  ["stg_orders", "fct_order_lines"],
  ["fct_order_lines", "net_revenue"],
  ["dim_products", "net_revenue"],
  ["net_revenue", "Executive overview"],
  ["net_revenue", "Monday metrics report"],
  ["net_revenue", "212 AI answers (30d)"],
  ["net_revenue", "Revenue alert · West"],
];
