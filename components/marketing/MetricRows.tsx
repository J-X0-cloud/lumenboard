import { Sparkline } from "@/components/charts/Sparkline";
import { StatusTag } from "@/components/ui/Tag";
import { featuredMetrics } from "@/lib/catalog";

export function MetricRows() {
  return (
    <div className="panel layered">
      {featuredMetrics().map(({ metric, usage }) => (
        <div key={metric.key} className="mrow">
          <div>
            <b>
              {metric.label} <StatusTag status="certified" />
            </b>
            <small>
              <code>{metric.key}</code> · {metric.owner.team} · {metric.dashboards} dashboards
            </small>
          </div>
          <Sparkline values={usage} />
        </div>
      ))}
    </div>
  );
}
