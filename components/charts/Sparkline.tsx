import { sparkline } from "@/lib/charts";
import { INDIGO } from "@/lib/palette";

interface SparklineProps {
  values: number[];
  color?: string;
  fill?: boolean;
  className?: string;
}

export function Sparkline({ values, color = INDIGO, fill = true, className = "spark" }: SparklineProps) {
  const { line, area } = sparkline(values);
  return (
    <svg className={className} viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true">
      {fill ? <path d={area} fill={color} opacity=".12" /> : null}
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </svg>
  );
}
