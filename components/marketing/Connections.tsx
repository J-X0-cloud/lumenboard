import { CONNECTIONS } from "@/lib/data/product";

export function Connections() {
  return (
    <div className="conn">
      {CONNECTIONS.map((c) => (
        <div key={c.name}>
          {c.name}
          <small>{c.detail}</small>
        </div>
      ))}
    </div>
  );
}
