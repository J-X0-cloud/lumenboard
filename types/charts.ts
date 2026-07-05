/** How a numeric value is rendered in labels, axes and tooltips. */
export type ValueFormat =
  | "currency"
  | "currency2"
  | "number"
  | "percent"
  | "percent2"
  | "multiple"
  | "decimal"
  | "decimal2";

export type SeriesKind = "area" | "line" | "dash";

export interface ChartSeries {
  name: string;
  color: string;
  values: number[];
  kind: SeriesKind;
}

/** A time-series chart with one or more series sharing an x axis. */
export interface TimeSeriesSpec {
  type: "timeseries";
  labels: string[];
  tips: string[];
  series: ChartSeries[];
  format: ValueFormat;
  height?: number;
  /** Anchor the y axis at zero (default) or fit it to the data. */
  zero?: boolean;
  /** Number of x-axis labels to aim for. */
  xTicks?: number;
  /** Print series names at the right edge of the plot. */
  endLabels?: boolean;
  showLegend?: boolean;
}

export interface StackedColumnsSpec {
  type: "stacked";
  labels: string[];
  tips: string[];
  names: string[];
  colors: string[];
  stacks: number[][];
  format: ValueFormat;
  height?: number;
}

export interface HBarItem {
  label: string;
  value: number;
  prior: number | null;
  color: string;
}

export interface HBarSpec {
  type: "hbar";
  items: HBarItem[];
  format: ValueFormat;
  comparison: string;
  goodUp?: boolean;
}

export type ChartSpec = TimeSeriesSpec | StackedColumnsSpec | HBarSpec;

export interface TooltipRow {
  label: string;
  value: string;
  color: string;
}

export interface TooltipContent {
  title: string;
  rows: TooltipRow[];
}

export interface LegendItem {
  name: string;
  color: string;
  kind: SeriesKind | "box";
}

export interface WaterfallBar {
  leftPct: number;
  widthPct: number;
  shareOfMax: number;
}
