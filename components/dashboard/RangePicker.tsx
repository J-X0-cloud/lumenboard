"use client";

import { RANGES, RANGE_KEYS } from "@/lib/metrics";
import type { RangeKey } from "@/types/dashboard";

interface RangePickerProps {
  value: RangeKey;
  onChange: (range: RangeKey) => void;
  interactive?: boolean;
}

/** Segmented 7D / 30D / 90D / 12M control. */
export function RangePicker({ value, onChange, interactive = true }: RangePickerProps) {
  return (
    <div className="seg" role="group" aria-label="Date range">
      {RANGE_KEYS.map((key) => (
        <button
          key={key}
          type="button"
          aria-pressed={key === value}
          aria-label={RANGES[key].label}
          tabIndex={interactive ? undefined : -1}
          onClick={interactive ? () => onChange(key) : undefined}
        >
          {RANGES[key].short}
        </button>
      ))}
    </div>
  );
}
