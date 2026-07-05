import { AMBER, INDIGO, TEAL } from "@/lib/palette";
import type { RangeKey } from "@/types/dashboard";

/** Average retention curves (% of cohort placing another order) that cohort grids are generated around. */
export const MONTHLY_BASE_CURVE = [100, 31.2, 24.1, 21.0, 19.1, 17.6, 16.5, 15.7, 15.0, 14.4, 13.9, 13.5];
export const WEEKLY_BASE_CURVE = [100, 14.2, 10.6, 9.1, 8.2, 7.6, 7.1, 6.8];

/** Holiday gift buyers rarely come back; January buyers slightly more often. Points added at M1. */
export const MONTH_COHORT_ADJUSTMENT: Record<string, number> = { Nov: -4.2, Jan: 1.8 };

export const CHANNEL_RETENTION_CURVES = [
  {
    name: "Email sign-up",
    color: INDIGO,
    values: [100, 38.5, 30.9, 27.4, 25.1, 23.6, 22.4, 21.5, 20.8, 20.2, 19.7, 19.3],
  },
  {
    name: "Organic search",
    color: TEAL,
    values: [100, 31.4, 24.2, 21.1, 19.2, 17.8, 16.7, 15.9, 15.2, 14.6, 14.1, 13.7],
  },
  {
    name: "Paid social",
    color: AMBER,
    values: [100, 22.8, 16.6, 14.1, 12.6, 11.6, 10.8, 10.2, 9.7, 9.3, 9.0, 8.8],
  },
];

/** Customers with 2+ orders within 180 days, by the category of their first order: [current, prior]. */
export const CATEGORY_REPEAT_RATE: Array<[string, number, number]> = [
  ["Footwear", 34.2, 33.1],
  ["Apparel", 31.8, 31.5],
  ["Camp & hike", 27.4, 28.2],
  ["Accessories", 22.9, 21.7],
];

/**
 * Longer windows include more mature cohorts, which lifts the retention-derived KPIs slightly.
 * Applied to the certified snapshot values below.
 */
export const MATURITY_FACTOR: Record<RangeKey, number> = { "7d": 1, "30d": 1.01, "90d": 1.03, "12m": 1.06 };

export const RETENTION_SNAPSHOT = {
  retention90d: { current: 24.6, prior: 24.1, history: [23.2, 23.8, 23.5, 24.1, 24.4, 24.0] },
  ltv12m: { current: 214.4, prior: 206.9, history: [198, 201, 203, 206, 205, 209] },
  daysToSecondOrder: { current: 41.3, prior: 43.0, history: [45, 44.2, 44.8, 43.4, 42.6, 43.0] },
  ordersPerCustomer: { current: 1.62, prior: 1.58, history: [1.51, 1.53, 1.55, 1.56, 1.58, 1.6] },
} as const;

/** 90-day retention of first-time buyers by first-order month, oldest complete cohort first. */
export const RETENTION_90D_BY_COHORT = [
  22.4, 22.9, 23.1, 19.2, 20.1, 24.8, 23.9, 24.2, 24.9, 25.3, 25.1, 25.8,
];
