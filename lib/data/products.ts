import type { CATEGORIES } from "./dimensions";

export interface Product {
  name: string;
  category: (typeof CATEGORIES)[number];
  price: number;
  /** Share of net revenue in a typical period. */
  share: number;
}

export const PRODUCTS: Product[] = [
  { name: "Ridgeline 32L Daypack", category: "Camp & hike", price: 129, share: 0.118 },
  { name: "Alder Fleece Quarter-Zip", category: "Apparel", price: 98, share: 0.104 },
  { name: "Switchback Trail Runner", category: "Footwear", price: 145, share: 0.097 },
  { name: "Headwall 3L Rain Shell", category: "Apparel", price: 189, share: 0.083 },
  { name: "Cedar Merino Crew", category: "Apparel", price: 74, share: 0.071 },
  { name: "Basin Insulated Bottle 24 oz", category: "Accessories", price: 34, share: 0.052 },
  { name: "Driftwood Camp Chair", category: "Camp & hike", price: 88, share: 0.047 },
  { name: "Talus Hiking Boot", category: "Footwear", price: 175, share: 0.044 },
];

export interface Campaign {
  name: string;
  /** Index into CHANNELS (1 = paid search, 2 = paid social). */
  channel: 1 | 2;
  /** Share of the channel's spend and sessions attributed to the campaign. */
  share: number;
}

export const CAMPAIGNS: Campaign[] = [
  { name: "Fall layering — prospecting", channel: 2, share: 0.26 },
  { name: "Brand search — core", channel: 1, share: 0.31 },
  { name: "Trail runner launch", channel: 2, share: 0.18 },
  { name: "Non-brand — daypacks", channel: 1, share: 0.22 },
  { name: "Retargeting — 30-day viewers", channel: 2, share: 0.14 },
  { name: "Shopping — rain shells", channel: 1, share: 0.19 },
];
