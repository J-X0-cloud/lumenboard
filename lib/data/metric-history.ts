import { OWNERS } from "@/lib/semantic-layer";
import type { MetricChange } from "@/types/metrics";

const dr = { initials: OWNERS.Finance.initials, color: OWNERS.Finance.color };
const mt = { initials: OWNERS["Data team"].initials, color: OWNERS["Data team"].color };

/** Reviewed changes to `net_revenue`, newest first. */
export const NET_REVENUE_HISTORY: MetricChange[] = [
  {
    ...dr,
    summary: [
      { text: "Excluded " },
      { text: "status = 'cancelled'", code: true },
      { text: " orders, matching the ledger close policy" },
    ],
    date: "Sep 2",
  },
  {
    ...mt,
    summary: [
      { text: "Added " },
      { text: "customer_type", code: true },
      { text: " dimension for new vs returning splits" },
    ],
    date: "Aug 18",
  },
  {
    ...dr,
    summary: [{ text: "Certified after reconciling July against the general ledger" }],
    date: "Aug 5",
  },
  {
    ...mt,
    summary: [
      { text: "Moved refunds to " },
      { text: "refund_amount", code: true },
      { text: " on order lines" },
    ],
    date: "Jul 29",
  },
];

export const NET_REVENUE_STEWARD = "Dana R.";
export const NET_REVENUE_REVIEWER = "Marcus T.";
