import { LINEAGE_COLUMNS, LINEAGE_EDGES, LINEAGE_FOCUS } from "@/lib/data/lineage";
import { BRAND } from "@/lib/palette";

const W = 760;
const H = 300;
const BOX_H = 34;

interface Box {
  x: number;
  y: number;
  w: number;
  label: string;
}

function layout(): Box[] {
  return LINEAGE_COLUMNS.flatMap((col) =>
    col.items.map((label, i) => ({
      x: col.x,
      y: 40 + ((H - 60) * (i + 0.5)) / col.items.length - BOX_H / 2,
      w: col.x === 575 ? 175 : 160,
      label,
    })),
  );
}

/** Column-level lineage for a metric, from raw tables to every dashboard, report and alert that reads it. */
export function LineageDiagram() {
  const boxes = layout();
  const byLabel = new Map(boxes.map((b) => [b.label, b]));

  return (
    <svg
      className="lineage"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Lineage: warehouse tables feed dbt models, which feed the net_revenue metric, which powers dashboards, reports, AI answers and alerts"
    >
      <defs>
        <marker id="ah" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L8,4 L0,8z" fill="#9aa3d8" />
        </marker>
      </defs>
      {LINEAGE_EDGES.map(([from, to]) => {
        const a = byLabel.get(from)!;
        const b = byLabel.get(to)!;
        const y1 = a.y + BOX_H / 2;
        const y2 = b.y + BOX_H / 2;
        if (a.x === b.x) {
          // vertical hop inside the dbt column
          return (
            <path
              key={from + to}
              d={`M${a.x + 80},${y1 + 17} L${a.x + 80},${y2 - 17}`}
              stroke={BRAND.indigoPale}
              strokeWidth={1.5}
              fill="none"
              markerEnd="url(#ah)"
            />
          );
        }
        const sx = a.x + a.w;
        const ex = b.x;
        const mx = (sx + ex) / 2;
        return (
          <path
            key={from + to}
            d={`M${sx},${y1.toFixed(1)} C${mx},${y1.toFixed(1)} ${mx},${y2.toFixed(1)} ${ex - 2},${y2.toFixed(1)}`}
            stroke={from === LINEAGE_FOCUS ? BRAND.amber : BRAND.indigoPale}
            strokeWidth={1.5}
            fill="none"
            markerEnd="url(#ah)"
          />
        );
      })}
      {LINEAGE_COLUMNS.map((col) => (
        <text key={col.title} x={col.x} y={18} className="m">
          {col.title.toUpperCase()}
        </text>
      ))}
      {boxes.map((box) => {
        const focus = box.label === LINEAGE_FOCUS;
        return (
          <g key={box.label}>
            <rect
              x={box.x}
              y={box.y.toFixed(1)}
              width={box.w}
              height={BOX_H}
              rx={8}
              fill={focus ? BRAND.ink : "#fff"}
              stroke={focus ? BRAND.ink : "#d5d9e6"}
            />
            <text
              x={box.x + 12}
              y={(box.y + 21.5).toFixed(1)}
              style={{ fontFamily: "var(--mono)", fontSize: "11.5px", fill: focus ? "#fff" : undefined }}
            >
              {box.label}
            </text>
            {focus ? <circle cx={box.x + 146} cy={(box.y + 17).toFixed(1)} r={4} fill={BRAND.amber} /> : null}
          </g>
        );
      })}
    </svg>
  );
}
