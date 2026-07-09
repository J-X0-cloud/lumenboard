import { Fragment } from "react";

import type { MetricChange } from "@/types/metrics";

import { OwnerChip } from "./OwnerChip";

export function ChangeHistory({ changes }: { changes: MetricChange[] }) {
  return (
    <ul className="hist">
      {changes.map((change) => (
        <li key={change.date}>
          <OwnerChip initials={change.initials} color={change.color} />
          <span>
            {change.summary.map((part, i) =>
              part.code ? <code key={i}>{part.text}</code> : <Fragment key={i}>{part.text}</Fragment>,
            )}
          </span>
          <small>{change.date}</small>
        </li>
      ))}
    </ul>
  );
}
