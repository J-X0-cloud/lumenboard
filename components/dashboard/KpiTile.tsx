import { Sparkline } from "@/components/charts/Sparkline";
import type { Kpi } from "@/types/dashboard";

import { DeltaBadge } from "./DeltaBadge";

function CertifiedSeal() {
  return (
    <svg className="cert" viewBox="0 0 16 16" aria-label="Certified metric">
      <path
        d="M8 1.5l1.7 1.3 2.1-.1.6 2 1.7 1.3-.7 2 .7 2-1.7 1.3-.6 2-2.1-.1L8 14.5l-1.7-1.3-2.1.1-.6-2-1.7-1.3.7-2-.7-2 1.7-1.3.6-2 2.1.1z"
        fill="currentColor"
      />
      <path
        d="M5.6 8.1l1.6 1.6 3.2-3.3"
        fill="none"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function KpiTile({ kpi }: { kpi: Kpi }) {
  return (
    <div className="kpi">
      <div className="kpi-l">
        {kpi.label}
        {kpi.certified ? <CertifiedSeal /> : null}
      </div>
      <div className="kpi-v">{kpi.value}</div>
      <div className="kpi-f">
        <DeltaBadge delta={kpi.delta} />
      </div>
      <Sparkline values={kpi.spark} color={kpi.sparkColor} />
    </div>
  );
}

export function KpiRow({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="kpis">
      {kpis.map((k) => (
        <KpiTile key={k.label} kpi={k} />
      ))}
    </div>
  );
}
