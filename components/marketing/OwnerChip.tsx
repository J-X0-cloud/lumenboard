export function OwnerChip({ initials, color, label }: { initials: string; color: string; label?: string }) {
  return (
    <span className="owner">
      <i style={{ background: color }}>{initials}</i>
      {label}
    </span>
  );
}
