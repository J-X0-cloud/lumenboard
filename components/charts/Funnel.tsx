"use client";

import { compact } from "@/lib/format";
import { INDIGO, PRIOR } from "@/lib/palette";
import type { FunnelStep } from "@/types/dashboard";

import { useTooltipTarget } from "./TooltipProvider";

export function Funnel({ steps }: { steps: FunnelStep[] }) {
  const bind = useTooltipTarget();
  const top = steps[0].value;

  return (
    <div className="funnel">
      {steps.map((step, i) => (
        <div
          key={step.label}
          className="fstep"
          {...bind({
            title: step.label,
            rows: [
              { label: "Count", value: compact(step.value), color: INDIGO },
              { label: "Of sessions", value: `${((step.value / top) * 100).toFixed(1)}%`, color: PRIOR },
            ],
          })}
        >
          <div className="fl">
            <b>{step.label}</b>
            {i > 0 ? (
              <span className="fconv">
                {((step.value / steps[i - 1].value) * 100).toFixed(1)}% of previous
              </span>
            ) : null}
          </div>
          <div className="ft">
            <i style={{ width: `${((step.value / top) * 100).toFixed(2)}%` }} />
          </div>
          <span className="fv">{compact(step.value)}</span>
        </div>
      ))}
    </div>
  );
}
