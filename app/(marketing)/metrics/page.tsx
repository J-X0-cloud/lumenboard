import type { Metadata } from "next";

import { AreaChart } from "@/components/charts/AreaChart";
import { LineageDiagram } from "@/components/charts/LineageDiagram";
import { CatalogTable } from "@/components/marketing/CatalogTable";
import { ChangeHistory } from "@/components/marketing/ChangeHistory";
import { CtaBox } from "@/components/marketing/CtaBox";
import { MetricYaml } from "@/components/marketing/MetricYaml";
import { PageHero } from "@/components/marketing/PageHero";
import { TileGrid } from "@/components/marketing/TileGrid";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/icons";
import { StatusTag } from "@/components/ui/Tag";
import { NET_REVENUE_HISTORY, NET_REVENUE_STEWARD } from "@/lib/data/metric-history";
import { CATALOG_FILTERS, CATALOG_TILES } from "@/lib/data/product";
import { WALKTHROUGH_URL } from "@/lib/data/site";
import { selectNetRevenueTrend } from "@/lib/metrics";
import { WORKSPACE_METRIC_COUNT, getMetric } from "@/lib/semantic-layer";

export const metadata: Metadata = {
  title: "Metrics catalog — governed metric definitions",
  description:
    "Lumenboard's metrics catalog: certified definitions in code, owners, freshness, lineage and change history behind every dashboard and AI answer.",
};

export default function MetricsPage() {
  const metric = getMetric("net_revenue");
  const trend = selectNetRevenueTrend();

  return (
    <>
      <PageHero
        eyebrow="Metrics catalog"
        title="Every number your company runs on, defined once"
        lead="The catalog is the source of truth behind every dashboard, report and AI answer: who owns each metric, how it's calculated, how fresh it is and where it's used."
      />

      <section className="sec-tight" style={{ paddingTop: 8 }}>
        <div className="wrap">
          <div className="catalog-tools">
            <div className="search">
              <Icon name="search" />
              Search {WORKSPACE_METRIC_COUNT} metrics, dimensions and owners…
            </div>
            <div className="fchips">
              {CATALOG_FILTERS.map((f, i) => (
                <span key={f} className={i === 0 ? "on" : undefined}>
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-b" style={{ paddingTop: 4 }}>
              <CatalogTable />
            </div>
          </div>

          <div className="mdetail">
            <Card
              title={
                <span style={{ fontSize: 18 }}>
                  {metric.label}{" "}
                  <span style={{ marginLeft: 6, verticalAlign: 2, display: "inline-block" }}>
                    <StatusTag status={metric.status} />
                  </span>
                </span>
              }
              subtitle={`${metric.key} · owned by ${metric.owner.team} · ${NET_REVENUE_STEWARD}`}
            >
              <p style={{ fontSize: 14, color: "var(--muted)" }}>
                {metric.description} Recognized on order date.
              </p>
              <div className="stats3">
                <div>
                  <b>{trend.last30}</b>Last 30 days
                </div>
                <div>
                  <b>{metric.dashboards}</b>Dashboards
                </div>
                <div>
                  <b>{metric.aiAnswers30d}</b>AI answers (30d)
                </div>
              </div>
              <AreaChart spec={trend.chart} />
              <h4 style={{ fontSize: 13, margin: "18px 0 6px" }}>Lineage</h4>
              <LineageDiagram />
            </Card>
            <div style={{ display: "grid", gap: 20, alignContent: "start", minWidth: 0 }}>
              <Card title="Definition" subtitle="metrics/finance/net_revenue.yml · main" tools={false}>
                <MetricYaml metricKey={metric.key} style={{ fontSize: 11.5 }} />
              </Card>
              <Card title="Change history" subtitle="Reviewed in pull requests" tools={false}>
                <ChangeHistory changes={NET_REVENUE_HISTORY} />
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <TileGrid tiles={CATALOG_TILES} />
        </div>
      </section>

      <CtaBox
        title="Start with the metrics you already have"
        body="Import your dbt models and Lumenboard suggests a starter catalog you can review and certify in a day."
        primary={{ label: "Open the live demo", href: "/demo", arrow: true }}
        secondary={{ label: "Book a walkthrough", href: WALKTHROUGH_URL }}
      />
    </>
  );
}
