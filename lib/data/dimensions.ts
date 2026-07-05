import { AMBER, CORAL, INDIGO, TEAL, VIOLET } from "@/lib/palette";

export const CHANNELS = ["Organic search", "Paid search", "Paid social", "Email", "Direct"] as const;
export const CHANNEL_COLORS = [INDIGO, TEAL, AMBER, CORAL, VIOLET] as const;
/** Share of daily sessions and baseline session → order conversion rate per channel. */
export const CHANNEL_SHARE = [0.33, 0.24, 0.21, 0.12, 0.1] as const;
export const CHANNEL_CVR = [0.024, 0.033, 0.019, 0.048, 0.036] as const;

export const CATEGORIES = ["Apparel", "Footwear", "Camp & hike", "Accessories"] as const;
export const CATEGORY_COLORS = [INDIGO, TEAL, AMBER, CORAL] as const;

export const REGIONS = ["West", "Northeast", "South", "Midwest", "International"] as const;
export const REGION_SHARE = [0.34, 0.22, 0.2, 0.14, 0.1] as const;

export const CHANNEL = { organic: 0, paidSearch: 1, paidSocial: 2, email: 3, direct: 4 } as const;
export const REGION = { west: 0 } as const;

export const WORKSPACE = {
  id: "harbor-pine",
  name: "Harbor & Pine",
  legalName: "Harbor & Pine Supply Co.",
  initials: "HP",
  warehouse: "Snowflake · prod",
  certifiedMetrics: 48,
} as const;
