import { AreaChart } from "@/components/charts/AreaChart";
import { HBarList } from "@/components/charts/HBarList";
import { Sparkline } from "@/components/charts/Sparkline";
import { Card } from "@/components/ui/Card";
import { compact, money, percent } from "@/lib/format";
import { INDIGO } from "@/lib/palette";
import type { AskIntentRef, OverviewModel, ProductRow } from "@/types/dashboard";

import { DataTable, NameCell } from "../DataTable";
import type { Column } from "../DataTable";
import { DeltaBadge } from "../DeltaBadge";
import { InsightCallout } from "../InsightCallout";
import { KpiRow } from "../KpiTile";

const PRODUCT_COLUMNS: Column<ProductRow>[] = [
  { key: "product", header: "Product", render: (p) => <NameCell name={p.name} detail={p.category} /> },
  { key: "units", header: "Units", align: "numeric", render: (p) => compact(p.units) },
  { key: "revenue", header: "Net revenue", align: "numeric", render: (p) => money(p.revenue) },
  { key: "delta", header: "vs prior", align: "numeric", render: (p) => <DeltaBadge delta={p.delta} /> },
  { key: "margin", header: "Margin", align: "numeric", render: (p) => percent(p.margin) },
  {
    key: "trend",
    header: "Trend",
    align: "spark",
    render: (p) => <Sparkline values={p.trend} color={INDIGO} fill={false} />,
  },
];

interface OverviewPanelProps {
  model: OverviewModel;
  /** Screenshot mode: KPI row and the first two cards only. */
  condensed?: boolean;
  onAsk?: (intent: AskIntentRef) => void;
}

export function OverviewPanel({ model, condensed = false, onAsk }: OverviewPanelProps) {
  return (
    <>
      <KpiRow kpis={model.kpis} />
      <div className="dgrid">
        <Card title="Net revenue" subtitle={model.revenueSubtitle} span={2}>
          <AreaChart spec={model.revenue} />
        </Card>
        <Card title="Net revenue by channel" subtitle={`Tick marks show ${model.comparison}`}>
          <HBarList spec={{ items: model.channels, format: "currency", comparison: model.comparison }} />
        </Card>
        {condensed ? null : (
          <>
            <Card title="Top products" subtitle="By net revenue" span={2}>
              <DataTable columns={PRODUCT_COLUMNS} rows={model.products} rowKey={(p) => p.name} />
            </Card>
            <Card title="Net revenue by region" subtitle="Ship-to region">
              <HBarList spec={{ items: model.regions, format: "currency", comparison: model.comparison }} />
              <InsightCallout insight={model.insight} onAsk={onAsk} />
            </Card>
          </>
        )}
      </div>
    </>
  );
}
