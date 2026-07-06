import type { ValueFormat } from "@/types/charts";

const fixed = (v: number, digits: number) =>
  v.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });

/** Shortest representation, like Python's `:g` — 2.50 → "2.5", 3.00 → "3". */
const short = (v: number) => String(Number(v.toPrecision(6)));

export function money(v: number, decimals?: number): string {
  const a = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (a >= 1e6) return `${sign}$${(a / 1e6).toFixed(2)}M`;
  if (a >= 1e4) return `${sign}$${(a / 1e3).toFixed(1)}K`;
  if (decimals !== undefined) return `${sign}$${fixed(a, decimals)}`;
  return `${sign}$${fixed(a, 0)}`;
}

export function moneyAxis(v: number): string {
  if (v === 0) return "$0";
  if (v >= 1e6) return `$${short(v / 1e6)}M`;
  if (v >= 1e3) return `$${short(v / 1e3)}K`;
  return `$${short(v)}`;
}

export function compact(v: number): string {
  if (v >= 1e6) return `${(v / 1e6).toFixed(2)}M`;
  if (v >= 1e4) return `${(v / 1e3).toFixed(1)}K`;
  return fixed(v, 0);
}

export function compactAxis(v: number): string {
  if (v >= 1e6) return `${short(v / 1e6)}M`;
  if (v >= 1e3) return `${short(v / 1e3)}K`;
  return short(v);
}

export function percent(v: number, digits = 1): string {
  return `${v.toFixed(digits)}%`;
}

export function integer(v: number): string {
  return fixed(Math.round(v), 0);
}

export function formatValue(format: ValueFormat, v: number): string {
  switch (format) {
    case "currency":
      return money(v);
    case "currency2":
      return money(v, 2);
    case "number":
      return compact(v);
    case "percent":
      return percent(v, 1);
    case "percent2":
      return percent(v, 2);
    case "multiple":
      return `${v.toFixed(2)}×`;
    case "decimal":
      return v.toFixed(1);
    case "decimal2":
      return v.toFixed(2);
  }
}

export function formatAxis(format: ValueFormat, v: number): string {
  switch (format) {
    case "currency":
    case "currency2":
      return moneyAxis(v);
    case "number":
      return compactAxis(v);
    case "percent":
    case "percent2":
      return `${short(v)}%`;
    default:
      return short(v);
  }
}
