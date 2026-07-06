import { createRng } from "@/lib/random";
import { METRICS } from "@/lib/semantic-layer";
import type { MetricDefinition } from "@/types/metrics";

export interface CatalogRow {
  metric: MetricDefinition;
  /** Weekly query volume, indexed to 100, for the last 20 weeks. */
  usage: number[];
}

function usageSeries(rng: ReturnType<typeof createRng>): number[] {
  return Array.from({ length: 20 }, (_, i) => 100 + i * rng.uniform(0.5, 3) + rng.uniform(-6, 6));
}

export function catalogRows(metrics: MetricDefinition[] = METRICS): CatalogRow[] {
  const rng = createRng(3);
  return metrics.map((metric) => ({ metric, usage: usageSeries(rng) }));
}

/** The most-used certified metrics, shown on the home page next to the YAML definition. */
export function featuredMetrics(count = 5): CatalogRow[] {
  const rng = createRng(5);
  return METRICS.slice(0, count).map((metric) => ({ metric, usage: usageSeries(rng) }));
}
