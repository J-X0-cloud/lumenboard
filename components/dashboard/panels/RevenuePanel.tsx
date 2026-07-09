import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { Sparkline } from "@/components/charts/Sparkline";
import { Waterfall } from "@/components/charts/Waterfall";
import { Card } from "@/components/ui/Card";
import { compact, money, percent } from "@/lib/format";
import { TEAL } from "@/lib/palette";
import type { RegionRow, RevenueModel } from "@/types/dashboard";

import { DataTable, NameCell } from "../DataTable";
import type { Column } from "../DataTable";
import { DeltaBadge } from "../DeltaBadge";
import { KpiRow } from "../KpiTile";

const REGION_COLUMNS: Column<RegionRow>[] = [
  { key: "region", header: "Region", render: (r) => <NameCell name={r.region} /> },
  { key: "revenue", header: "Net revenue", align: "numeric", render: (r) => money(r.revenue) },
  { key: "orders", header: "Orders", align: "numeric", render: (r) => compact(r.orders) },
  { key: "aov", header: "AOV", align: "numeric", render: (r) => money(r.aov, 2) },
  { key: "margin", header: "Margin", align: "numeric", render: (r) => percent(r.margin) },
  { key: "delta", header: "vs prior", align: "numeric", render: (r) => <DeltaBadge delta={r.delta} /> },
  {
    key: "trend",
    header: "Trend",
    align: "spark",
    render: (r) => <Sparkline values={r.trend} color={TEAL} fill={false} />,
  },
];

export function RevenuePanel({ model }: { model: RevenueModel }) {
  return (
    <>
      <KpiRow kpis={model.kpis} />
      <div className="dgrid">
        <Card title="Net revenue by category" subtitle={model.categoriesSubtitle} span={2}>
          <BarChart spec={model.categories} />
        </Card>
        <Card title="Gross to net" subtitle={model.rangeLabel}>
          <Waterfall steps={model.bridge} />
        </Card>
        <Card title="Revenue by region" subtitle="Net of discounts and returns" span={2}>
          <DataTable columns={REGION_COLUMNS} rows={model.regions} rowKey={(r) => r.region} />
        </Card>
        <Card title="Gross margin %" subtitle="Net revenue less landed COGS">
          <AreaChart spec={model.margin} />
        </Card>
      </div>
    </>
  );
}
