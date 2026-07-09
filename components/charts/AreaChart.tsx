"use client";

import clsx from "clsx";
import { useId, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";

import {
  PLOT_H,
  PLOT_W,
  areaPath,
  hoverIndex,
  niceScale,
  polylinePoints,
  seriesDomain,
  topPct,
  xTickIndices,
  yAt,
} from "@/lib/charts";
import { formatAxis, formatValue } from "@/lib/format";
import type { TimeSeriesSpec } from "@/types/charts";

import { Legend } from "./Legend";
import { useTooltip } from "./TooltipProvider";

/**
 * Line / area chart: a stretched SVG plot with HTML axes (so labels never distort), a crosshair and
 * per-series dots on hover, and dashed comparison series drawn underneath.
 */
export function AreaChart({ spec }: { spec: TimeSeriesSpec }) {
  const {
    labels,
    tips,
    series,
    format,
    height = 210,
    zero = true,
    xTicks = 6,
    endLabels = false,
    showLegend = true,
  } = spec;
  const gradientId = `g${useId().replace(/:/g, "")}`;
  const plotRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const tooltip = useTooltip();

  const [lo, hi] = seriesDomain(series, zero);
  const scale = niceScale(lo, hi, 4);
  const n = labels.length;
  const ticks = xTickIndices(n, xTicks);
  const leftPct = (i: number) => (n > 1 ? (i / (n - 1)) * 100 : 50);
  const ordered = [...series].sort((a, b) => Number(a.kind !== "dash") - Number(b.kind !== "dash"));

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const plot = plotRef.current;
    if (!plot) return;
    const r = plot.getBoundingClientRect();
    const inside =
      e.clientX >= r.left - 6 &&
      e.clientX <= r.right + 6 &&
      e.clientY >= r.top - 6 &&
      e.clientY <= r.bottom + 6;
    if (!inside) {
      setHover(null);
      tooltip.hide();
      return;
    }
    const i = hoverIndex(e.clientX, r, n);
    setHover(i);
    tooltip.show(
      {
        title: tips[i],
        rows: series.map((s) => ({ label: s.name, value: formatValue(format, s.values[i]), color: s.color })),
      },
      r.left + (leftPct(i) / 100) * r.width,
      e.clientY,
    );
  }

  function onPointerLeave() {
    setHover(null);
    tooltip.hide();
  }

  return (
    <>
      {showLegend && series.length > 1 ? (
        <Legend items={series.map((s) => ({ name: s.name, color: s.color, kind: s.kind }))} />
      ) : null}
      <div
        className={clsx("chart", endLabels && "has-dl", hover !== null && "hov")}
        style={{ "--h": `${height}px` } as CSSProperties}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <div className="yax">
          {scale.ticks.map((t) => (
            <span key={t} style={{ top: `${topPct(t, scale).toFixed(2)}%` }}>
              {formatAxis(format, t)}
            </span>
          ))}
        </div>
        <div className="plot" ref={plotRef}>
          <svg viewBox={`0 0 ${PLOT_W} ${PLOT_H}`} preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={series[0].color} stopOpacity=".26" />
                <stop offset="1" stopColor={series[0].color} stopOpacity="0" />
              </linearGradient>
            </defs>
            {scale.ticks.map((t) => (
              <line
                key={t}
                x1="0"
                x2={PLOT_W}
                y1={yAt(t, scale).toFixed(1)}
                y2={yAt(t, scale).toFixed(1)}
                className={t === scale.min ? "base" : "grid"}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {ordered.map((s) => (
              <g key={s.name}>
                {s.kind === "area" ? (
                  <path d={areaPath(s.values, scale)} fill={`url(#${gradientId})`} />
                ) : null}
                <polyline
                  points={polylinePoints(s.values, scale)}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={s.kind === "dash" ? 1.6 : 2}
                  strokeDasharray={s.kind === "dash" ? "5 4" : undefined}
                  vectorEffect="non-scaling-stroke"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </g>
            ))}
          </svg>
          <div className="xh" style={hover !== null ? { left: `${leftPct(hover)}%` } : undefined} />
          {hover !== null
            ? series.map((s) => (
                <span
                  key={s.name}
                  className="dot"
                  style={{
                    left: `${leftPct(hover)}%`,
                    top: `${topPct(s.values[hover], scale)}%`,
                    background: s.color,
                  }}
                />
              ))
            : null}
          {endLabels ? (
            <div className="dlabels">
              {series
                .filter((s) => s.kind !== "dash")
                .map((s) => (
                  <em
                    key={s.name}
                    style={{
                      top: `${topPct(s.values[s.values.length - 1], scale).toFixed(2)}%`,
                      color: "var(--text)",
                    }}
                  >
                    <i style={{ background: s.color }} />
                    {s.name}
                  </em>
                ))}
            </div>
          ) : null}
        </div>
        <div className="xax">
          {ticks.map((i, k) => (
            <span
              key={i}
              style={{ left: `${leftPct(i).toFixed(2)}%` }}
              className={
                clsx(i === 0 && "f", i === n - 1 && "l", k % 2 === 1 && ticks.length > 4 && "o") || undefined
              }
            >
              {labels[i]}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
