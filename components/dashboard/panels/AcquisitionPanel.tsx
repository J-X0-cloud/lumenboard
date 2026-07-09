import { AreaChart } from "@/components/charts/AreaChart";
import { Funnel } from "@/components/charts/Funnel";
import { Sparkline } from "@/components/charts/Sparkline";
import { Card } from "@/components/ui/Card";
import { compact, money, percent } from "@/lib/format";
import type { AcquisitionModel, CampaignRow } from "@/types/dashboard";

import { DataTable, NameCell } from "../DataTable";
import type { Column } from "../DataTable";
import { KpiRow } from "../KpiTile";

const CAMPAIGN_COLUMNS: Column<CampaignRow>[] = [
  { key: "campaign", header: "Campaign", render: (c) => <NameCell name={c.name} detail={c.channel} /> },
  { key: "spend", header: "Spend", align: "numeric", render: (c) => money(c.spend) },
  { key: "sessions", header: "Sessions", align: "numeric", render: (c) => compact(c.sessions) },
  { key: "cvr", header: "CVR", align: "numeric", render: (c) => percent(c.cvr, 2) },
  { key: "cac", header: "CAC", align: "numeric", render: (c) => money(c.cac, 2) },
  { key: "roas", header: "ROAS", align: "numeric", render: (c) => `${c.roas.toFixed(2)}×` },
  {
    key: "trend",
    header: "Trend",
    align: "spark",
    render: (c) => <Sparkline values={c.trend} color={c.color} fill={false} />,
  },
];

export function AcquisitionPanel({ model }: { model: AcquisitionModel }) {
  return (
    <>
      <KpiRow kpis={model.kpis} />
      <div className="dgrid">
        <Card title="Sessions by channel" subtitle="Last-touch attribution" span={2}>
          <AreaChart spec={model.sessions} />
        </Card>
        <Card title="Checkout funnel" subtitle={model.rangeLabel}>
          <Funnel steps={model.funnel} />
        </Card>
        <Card title="Paid campaigns" subtitle="Spend and outcomes by campaign" span={3}>
          <DataTable columns={CAMPAIGN_COLUMNS} rows={model.campaigns} rowKey={(c) => c.name} />
        </Card>
      </div>
    </>
  );
}
