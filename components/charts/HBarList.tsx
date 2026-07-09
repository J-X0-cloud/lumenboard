"use client";

import { DeltaBadge } from "@/components/dashboard/DeltaBadge";
import { delta } from "@/lib/delta";
import { formatValue } from "@/lib/format";
import { PRIOR } from "@/lib/palette";
import type { HBarSpec } from "@/types/charts";

import { useTooltipTarget } from "./TooltipProvider";

/** Ranked horizontal bars with a tick for the comparison period and a delta badge. */
export function HBarList({ spec }: { spec: Omit<HBarSpec, "type"> }) {
  const { items, format, comparison, goodUp = true } = spec;
  const bind = useTooltipTarget();
  const max = Math.max(...items.map((it) => it.value));

  return (
    <div className="hbars">
      {items.map((it) => (
        <div
          key={it.label}
          className="hb"
          {...bind({
            title: it.label,
            rows: [
              { label: "Current", value: formatValue(format, it.value), color: it.color },
              ...(it.prior !== null
                ? [{ label: "Prior period", value: formatValue(format, it.prior), color: PRIOR }]
                : []),
            ],
          })}
        >
          <span className="hb-l">{it.label}</span>
          <span className="hb-t">
            <i style={{ width: `${((it.value / max) * 100).toFixed(2)}%`, background: it.color }} />
            {it.prior ? <u style={{ left: `${(Math.min(it.prior / max, 1) * 100).toFixed(2)}%` }} /> : null}
          </span>
          <span className="hb-v">{formatValue(format, it.value)}</span>
          {it.prior ? <DeltaBadge delta={delta(it.value, it.prior, { goodUp, comparison })} /> : null}
        </div>
      ))}
    </div>
  );
}
