import { KpiRow } from "@/components/dashboard/KpiTile";
import { DIGEST } from "@/lib/data/home";
import { selectWeeklyDigest } from "@/lib/metrics";

/** The Monday metrics email, rendered from the same certified metrics as the dashboard. */
export function WeeklyDigest() {
  return (
    <div className="digest">
      <div className="digest-h">
        <span>{DIGEST.from}</span>
        <b>{DIGEST.subject}</b>
        <span>{DIGEST.sent}</span>
      </div>
      <div className="digest-b">
        <KpiRow kpis={selectWeeklyDigest()} />
        <p>
          <strong>What changed:</strong> {DIGEST.summary}
        </p>
        <p style={{ fontSize: 12, color: "var(--faint)" }}>
          Written by Lumenboard from certified metrics · Open the dashboard to explore
        </p>
      </div>
    </div>
  );
}
