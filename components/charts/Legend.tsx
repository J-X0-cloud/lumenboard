import type { CSSProperties } from "react";

import type { LegendItem } from "@/types/charts";

export function Legend({ items }: { items: LegendItem[] }) {
  return (
    <div className="legend">
      {items.map((item) => (
        <span key={item.name}>
          <i className={`sw ${item.kind}`} style={{ "--c": item.color } as CSSProperties} />
          {item.name}
        </span>
      ))}
    </div>
  );
}
