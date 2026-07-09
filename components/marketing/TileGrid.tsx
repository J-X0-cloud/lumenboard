import type { CSSProperties } from "react";

import { Icon } from "@/components/ui/icons";
import type { Tile } from "@/lib/data/product";

export function TileGrid({ tiles, style }: { tiles: Tile[]; style?: CSSProperties }) {
  return (
    <div className="grid3" style={style}>
      {tiles.map((tile) => (
        <div key={tile.title} className="tile">
          <Icon name={tile.icon} />
          <h3>{tile.title}</h3>
          <p>{tile.body}</p>
        </div>
      ))}
    </div>
  );
}
