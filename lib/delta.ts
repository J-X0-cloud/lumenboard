import type { Delta, DeltaMode } from "@/types/dashboard";

/**
 * Period-over-period change. Percent mode compares relative change; points mode subtracts rates
 * (margin, conversion, retention) so a 2.1% → 2.4% move reads as "0.3 pts", not "14%".
 */
export function delta(
  current: number,
  prior: number,
  {
    goodUp = true,
    mode = "pct",
    comparison = "",
  }: { goodUp?: boolean; mode?: DeltaMode; comparison?: string } = {},
): Delta {
  const change = mode === "pts" ? current - prior : prior ? ((current - prior) / prior) * 100 : 0;
  if (Math.abs(change) < 0.05) return { text: "0.0%", direction: "flat", tone: "flat", comparison };
  const up = change >= 0;
  return {
    text: mode === "pts" ? `${Math.abs(change).toFixed(1)} pts` : `${Math.abs(change).toFixed(1)}%`,
    direction: up ? "up" : "down",
    tone: up === goodUp ? "good" : "bad",
    comparison,
  };
}
