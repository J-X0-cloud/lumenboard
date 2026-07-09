"use client";

import type { CSSProperties } from "react";

import { niceScale, stackTotals, xTickIndices } from "@/lib/charts";
import { formatAxis, formatValue } from "@/lib/format";
import type { StackedColumnsSpec } from "@/types/charts";

import { Legend } from "./Legend";
import { useTooltipTarget } from "./TooltipProvider";

/** Stacked column chart built from HTML boxes, one column per bucket. */
export function BarChart({ spec }: { spec: StackedColumnsSpec }) {
  const { labels, tips, names, colors, stacks, format, height = 210 } = spec;
  const bind = useTooltipTarget();
  const totals = stackTotals(stacks);
  const scale = niceScale(0, Math.max(...totals) * 1.04, 4);
  const n = labels.length;
  const ticks = xTickIndices(n);

  return (
    <>
      <Legend items={names.map((name, k) => ({ name, color: colors[k], kind: "box" }))} />
      <div className="chart cols-chart" style={{ "--h": `${height}px`, "--n": n } as CSSProperties}>
        <div className="yax">
          {scale.ticks.map((t) => (
            <span key={t} style={{ top: `${((1 - t / scale.max) * 100).toFixed(2)}%` }}>
              {formatAxis(format, t)}
            </span>
          ))}
        </div>
        <div className="plot">
          {scale.ticks.map((t) => (
            <b
              key={t}
              style={{ bottom: `${((t / scale.max) * 100).toFixed(2)}%` }}
              className={t === 0 ? "base" : undefined}
            />
          ))}
          <div className="cols">
            {stacks.map((stack, i) => (
              <div
                key={labels[i] + i}
                className="col"
                {...bind({
                  title: tips[i],
                  rows: [
                    ...stack.map((v, k) => ({
                      label: names[k],
                      value: formatValue(format, v),
                      color: colors[k],
                    })),
                    { label: "Total", value: formatValue(format, totals[i]), color: "#fff" },
                  ],
                })}
              >
                {stack.map((v, k) => (
                  <i
                    key={names[k]}
                    style={{ height: `${((v / scale.max) * 100).toFixed(3)}%`, background: colors[k] }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="xax mid">
          {ticks.map((i, k) => (
            <span
              key={i}
              style={{ left: `${(((i + 0.5) / n) * 100).toFixed(2)}%` }}
              className={k % 2 === 1 && ticks.length > 4 ? "o" : undefined}
            >
              {labels[i]}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
