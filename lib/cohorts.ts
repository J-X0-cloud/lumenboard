/**
 * First-order cohort tables. Cohort sizes come from the simulated new-customer counts; retention cells
 * vary around the workspace's average curve, with holiday cohorts retaining noticeably worse.
 */
import { addDays } from "date-fns";

import { fmt, monthStart } from "@/lib/dates";
import { createRng } from "@/lib/random";
import { MONTHLY_BASE_CURVE, MONTH_COHORT_ADJUSTMENT, WEEKLY_BASE_CURVE } from "@/lib/data/retention";
import { DAYS, END_DATE } from "@/lib/data/simulation";
import type { CohortRow, CohortTable, DayRow } from "@/types/dashboard";

const newCustomers = (rows: readonly DayRow[]) => rows.reduce((a, r) => a + r.newCustomers, 0);

function monthlyCohorts(): Array<{ label: string; size: number }> {
  return Array.from({ length: 12 }, (_, i) => {
    const k = 11 - i;
    const start = monthStart(END_DATE, k);
    const end = addDays(monthStart(END_DATE, k - 1), -1);
    const rows = DAYS.filter((r) => r.date >= start && r.date <= (end < END_DATE ? end : END_DATE));
    return { label: fmt.monthYear(start), size: newCustomers(rows) };
  });
}

function weeklyCohorts(): Array<{ label: string; size: number }> {
  return Array.from({ length: 8 }, (_, i) => {
    const w = 7 - i;
    const end = DAYS.length - 1 - w * 7;
    const rows = DAYS.slice(end - 6, end + 1);
    return { label: `Wk of ${fmt.day(rows[0].date)}`, size: newCustomers(rows) };
  });
}

export function buildCohortTable(kind: "week" | "month"): CohortTable {
  const rng = createRng(kind === "month" ? 7 : 11);
  const base = kind === "month" ? MONTHLY_BASE_CURVE : WEEKLY_BASE_CURVE;
  const cohorts = kind === "month" ? monthlyCohorts() : weeklyCohorts();
  const prefix = kind === "month" ? "M" : "W";
  const n = base.length;
  const reference = base[1];

  const rows: CohortRow[] = cohorts.map(({ label, size }, r) => {
    const adjustment = kind === "month" ? (MONTH_COHORT_ADJUSTMENT[label.slice(0, 3)] ?? 0) : 0;
    const available = n - r; // the newest cohorts have fewer periods observed
    const cells = base.map((b, c) => {
      if (c >= available) return null;
      if (c === 0) return 100;
      const scale = b / reference;
      return Math.max(2, b + adjustment * scale + rng.uniform(-1.1, 1.1) * scale);
    });
    return { label, size, cells };
  });

  return { kind, headers: base.map((_, c) => `${prefix}${c}`), rows, reference };
}
