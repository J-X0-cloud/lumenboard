"use client";

import { waterfallBars } from "@/lib/charts";
import { formatValue } from "@/lib/format";
import { CORAL, INDIGO, PRIOR } from "@/lib/palette";
import type { ValueFormat } from "@/types/charts";
import type { WaterfallStep } from "@/types/dashboard";

import { Legend } from "./Legend";
import { useTooltipTarget } from "./TooltipProvider";

/** Gross-to-net bridge drawn as horizontal floating bars. */
export function Waterfall({ steps, format = "currency" }: { steps: WaterfallStep[]; format?: ValueFormat }) {
  const bind = useTooltipTarget();
  const bars = waterfallBars(steps);

  return (
    <>
      <Legend
        items={[
          { name: "Total", color: INDIGO, kind: "box" },
          { name: "Reduction", color: CORAL, kind: "box" },
        ]}
      />
      <div className="wf2">
        {steps.map((step, i) => {
          const total = step.kind === "total";
          const color = total ? INDIGO : CORAL;
          const value = `${total ? "" : "−"}${formatValue(format, step.value)}`;
          return (
            <div
              key={step.label}
              className={total ? "wrow tot" : "wrow"}
              {...bind({
                title: step.label,
                rows: [
                  { label: total ? "Amount" : "Reduction", value, color },
                  { label: "Share of gross", value: `${bars[i].shareOfMax.toFixed(1)}%`, color: PRIOR },
                ],
              })}
            >
              <span className="wl">{step.label}</span>
              <span className="wt">
                <i
                  style={{
                    left: `${bars[i].leftPct.toFixed(2)}%`,
                    width: `${bars[i].widthPct.toFixed(2)}%`,
                    background: color,
                  }}
                />
              </span>
              <span className="wv">{value}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
