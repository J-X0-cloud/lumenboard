/**
 * Chart geometry shared by the hand-rolled SVG/HTML charts. Everything here is pure so it can run
 * during server rendering and in the browser with identical results.
 */
import type { ChartSeries, WaterfallBar } from "@/types/charts";

export interface Scale {
  ticks: number[];
  min: number;
  max: number;
}

/** Plot coordinate system for line charts: a 1000×300 viewBox stretched to the container. */
export const PLOT_W = 1000;
export const PLOT_H = 300;

function niceOnce(lo: number, hi: number, count: number): Scale {
  const span = Math.max(hi - lo, 1e-9);
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  let step = mag;
  for (const m of [1, 2, 2.5, 5, 10]) {
    step = m * mag;
    if (step >= raw) break;
  }
  const min = Math.floor(lo / step) * step;
  const max = Math.ceil(hi / step) * step;
  const ticks: number[] = [];
  for (let t = min; t <= max + step * 0.01; t += step) ticks.push(Number(t.toFixed(10)));
  return { ticks, min, max };
}

/**
 * Round axis bounds to friendly steps (1, 2, 2.5, 5 × 10ⁿ). Tries n-1…n+1 ticks and keeps the
 * candidate that wastes the least vertical space, preferring the requested count on near-ties.
 */
export function niceScale(lo: number, hi: number, count = 4): Scale {
  let best: { waste: number; scale: Scale } | null = null;
  for (const k of [count, count + 1, count - 1]) {
    const scale = niceOnce(lo, hi, k);
    const waste = (scale.max - scale.min) / Math.max(hi - lo, 1e-9);
    if (!best || waste < best.waste - 0.08) best = { waste, scale };
  }
  return best!.scale;
}

/** Up to `max` evenly spaced label indices, always including the first and last point. */
export function xTickIndices(count: number, max = 6): number[] {
  if (count <= max) return Array.from({ length: count }, (_, i) => i);
  const set = new Set<number>();
  for (let k = 0; k < max; k++) set.add(Math.round((k * (count - 1)) / (max - 1)));
  return [...set].sort((a, b) => a - b);
}

/** Y domain for a time-series chart before rounding. */
export function seriesDomain(series: ChartSeries[], zero: boolean): [number, number] {
  const all = series.flatMap((s) => s.values);
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  return [zero ? 0 : lo - (hi - lo) * 0.15, hi * 1.04];
}

export const xAt = (i: number, count: number) => (count > 1 ? (i / (count - 1)) * PLOT_W : PLOT_W / 2);
export const yAt = (v: number, scale: Scale) => PLOT_H - ((v - scale.min) / (scale.max - scale.min)) * PLOT_H;

/** Vertical position as a percentage from the top of the plot (for HTML overlays). */
export const topPct = (v: number, scale: Scale) => (1 - (v - scale.min) / (scale.max - scale.min)) * 100;

export function polylinePoints(values: number[], scale: Scale): string {
  return values.map((v, i) => `${xAt(i, values.length).toFixed(1)},${yAt(v, scale).toFixed(1)}`).join(" ");
}

export function areaPath(values: number[], scale: Scale): string {
  const pts = values
    .map((v, i) => `L${xAt(i, values.length).toFixed(1)},${yAt(v, scale).toFixed(1)}`)
    .join(" ");
  return `M0,${PLOT_H} ${pts} L${PLOT_W},${PLOT_H}Z`;
}

/** Nearest data index for a pointer position inside the plot rectangle. */
export function hoverIndex(clientX: number, rect: DOMRect, count: number): number {
  const f = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  return Math.round(f * (count - 1));
}

/** Sparkline geometry in a 100×28 viewBox with 2px padding top and bottom. */
export function sparkline(values: number[]): { line: string; area: string } {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;
  const n = values.length;
  const pts = values.map(
    (v, i) => `${((i / (n - 1)) * 100).toFixed(1)},${(26 - ((v - lo) / span) * 22).toFixed(1)}`,
  );
  return { line: pts.join(" "), area: `M0,28 L${pts.join(" L")} L100,28Z` };
}

export function stackTotals(stacks: number[][]): number[] {
  return stacks.map((s) => s.reduce((a, b) => a + b, 0));
}

/** Horizontal bridge: totals start at zero, reductions hang off the running total. */
export function waterfallBars(steps: Array<{ value: number; kind: "total" | "reduction" }>): WaterfallBar[] {
  const hi = Math.max(...steps.map((s) => s.value));
  let run = 0;
  return steps.map((s) => {
    const [a, b] = s.kind === "total" ? [0, s.value] : [run - s.value, run];
    run = s.kind === "total" ? s.value : run - s.value;
    return {
      leftPct: (a / hi) * 100,
      widthPct: Math.max(((b - a) / hi) * 100, 0.6),
      shareOfMax: (s.value / hi) * 100,
    };
  });
}

/** Heat-map shading for cohort cells: opacity scales with retention relative to the first period. */
export function cohortShade(value: number, reference: number): { alpha: number; inverse: boolean } {
  const alpha = Math.min(0.92, 0.07 + (value / reference) * 0.8);
  return { alpha, inverse: alpha > 0.52 };
}
