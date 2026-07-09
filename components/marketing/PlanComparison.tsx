import { Fragment } from "react";

import { Icon } from "@/components/ui/icons";
import { COMPARISON, TIERS } from "@/lib/data/pricing";
import type { PlanCell } from "@/lib/data/pricing";

function Cell({ value }: { value: PlanCell }) {
  if (value === true) return <Icon name="check" />;
  if (value === false) return <span className="no">—</span>;
  return <>{value}</>;
}

export function PlanComparison() {
  return (
    <div className="tbl-wrap">
      <table className="cmp">
        <thead>
          <tr>
            <th>Compare plans</th>
            {TIERS.map((t) => (
              <th key={t.name}>{t.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARISON.map((group) => (
            <Fragment key={group.group}>
              <tr className="grp">
                <td colSpan={5}>{group.group}</td>
              </tr>
              {group.rows.map((row) => (
                <tr key={row.feature}>
                  <td>{row.feature}</td>
                  {row.plans.map((cell, i) => (
                    <td key={i}>
                      <Cell value={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
