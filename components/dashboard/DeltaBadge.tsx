import type { Delta } from "@/types/dashboard";

export function DeltaBadge({ delta }: { delta: Delta }) {
  const title = delta.comparison ? `vs ${delta.comparison}` : undefined;
  if (delta.direction === "flat") {
    return (
      <span className="dl flat" title={title}>
        – {delta.text}
      </span>
    );
  }
  return (
    <span className={`dl ${delta.tone}`} title={title}>
      <span aria-hidden="true">{delta.direction === "up" ? "▲" : "▼"}</span> {delta.text}
    </span>
  );
}
