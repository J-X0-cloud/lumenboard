"use client";

import clsx from "clsx";

import { useTooltipTarget } from "@/components/charts/TooltipProvider";
import { cohortShade } from "@/lib/charts";
import { integer } from "@/lib/format";
import { INDIGO, PRIOR } from "@/lib/palette";
import type { CohortTable } from "@/types/dashboard";

/** Retention heat map: one row per first-order cohort, one column per period since first order. */
export function CohortGrid({ table, compact = false }: { table: CohortTable; compact?: boolean }) {
  const bind = useTooltipTarget();

  return (
    <>
      <div className="tscroll">
        <table className={clsx("cohort", compact && "compact")}>
          <thead>
            <tr>
              <th>Cohort</th>
              <th>Customers</th>
              {table.headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td className="sz">{integer(row.size)}</td>
                {row.cells.map((v, c) => {
                  if (v === null) return <td key={c} className="na" />;
                  if (c === 0) {
                    return (
                      <td key={c} className="c0">
                        100%
                      </td>
                    );
                  }
                  const shade = cohortShade(v, table.reference);
                  return (
                    <td
                      key={c}
                      style={{
                        background: `rgba(74,91,212,${shade.alpha.toFixed(2)})`,
                        color: shade.inverse ? "#fff" : "var(--text)",
                      }}
                      {...bind({
                        title: `${row.label} cohort`,
                        rows: [
                          {
                            label: `${table.headers[c]} retention`,
                            value: `${v.toFixed(1)}%`,
                            color: INDIGO,
                          },
                          { label: "Customers", value: integer((row.size * v) / 100), color: PRIOR },
                        ],
                      })}
                    >
                      {v.toFixed(1)}%
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="scale">
        <span>Lower retention</span>
        <i />
        <span>Higher</span>
      </div>
    </>
  );
}
