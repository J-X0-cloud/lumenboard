import { AreaChart } from "@/components/charts/AreaChart";
import { HBarList } from "@/components/charts/HBarList";
import { Card } from "@/components/ui/Card";
import type { RetentionModel } from "@/types/dashboard";

import { CohortGrid } from "../CohortGrid";
import { KpiRow } from "../KpiTile";

export function RetentionPanel({ model }: { model: RetentionModel }) {
  const cadence = model.cohorts.kind === "week" ? "Weekly" : "Monthly";
  return (
    <>
      <KpiRow kpis={model.kpis} />
      <div className="dgrid">
        <Card
          title="Customer retention by first-order cohort"
          subtitle={`${cadence} cohorts · share of customers placing another order`}
          span={3}
        >
          <CohortGrid table={model.cohorts} />
        </Card>
        <Card
          title="Retention curve by acquisition channel"
          subtitle="Monthly cohorts, trailing 12 months · M0 = 100%"
          span={2}
        >
          <AreaChart spec={model.curves} />
        </Card>
        <Card title="Repeat rate by first-order category" subtitle="Customers with 2+ orders within 180 days">
          <HBarList spec={{ items: model.categoryRepeat, format: "percent", comparison: model.comparison }} />
        </Card>
      </div>
    </>
  );
}
