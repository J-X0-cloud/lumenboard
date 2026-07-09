import type { ChartSpec } from "@/types/charts";

import { AreaChart } from "./AreaChart";
import { BarChart } from "./BarChart";
import { HBarList } from "./HBarList";

/** Render any serialisable chart spec (dashboard tiles, AI answers, pinned charts). */
export function Chart({ spec }: { spec: ChartSpec }) {
  switch (spec.type) {
    case "timeseries":
      return <AreaChart spec={spec} />;
    case "stacked":
      return <BarChart spec={spec} />;
    case "hbar":
      return <HBarList spec={spec} />;
  }
}
