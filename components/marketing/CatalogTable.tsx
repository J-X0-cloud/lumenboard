import { Sparkline } from "@/components/charts/Sparkline";
import { DataTable, NameCell } from "@/components/dashboard/DataTable";
import type { Column } from "@/components/dashboard/DataTable";
import { StatusTag } from "@/components/ui/Tag";
import { catalogRows } from "@/lib/catalog";
import type { CatalogRow } from "@/lib/catalog";

import { OwnerChip } from "./OwnerChip";

const COLUMNS: Column<CatalogRow>[] = [
  {
    key: "metric",
    header: "Metric",
    render: ({ metric }) => <NameCell name={metric.label} detail={metric.description.replace(/\.$/, "")} />,
  },
  { key: "key", header: "Key", render: ({ metric }) => <code>{metric.key}</code> },
  {
    key: "owner",
    header: "Owner",
    render: ({ metric }) => (
      <OwnerChip initials={metric.owner.initials} color={metric.owner.color} label={metric.owner.team} />
    ),
  },
  { key: "status", header: "Status", render: ({ metric }) => <StatusTag status={metric.status} /> },
  { key: "freshness", header: "Freshness", render: ({ metric }) => metric.freshness },
  { key: "dashboards", header: "Dashboards", align: "numeric", render: ({ metric }) => metric.dashboards },
  {
    key: "answers",
    header: "AI answers (30d)",
    align: "numeric",
    render: ({ metric }) => metric.aiAnswers30d,
  },
  {
    key: "usage",
    header: "Last 20 weeks",
    align: "spark",
    render: ({ usage }) => <Sparkline values={usage} fill={false} />,
  },
];

export function CatalogTable() {
  return <DataTable className="cat" columns={COLUMNS} rows={catalogRows()} rowKey={(r) => r.metric.key} />;
}
