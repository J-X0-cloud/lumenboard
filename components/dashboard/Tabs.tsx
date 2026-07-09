"use client";

import { useRef } from "react";
import type { KeyboardEvent } from "react";

interface TabsProps<K extends string> {
  tabs: Array<{ key: K; label: string }>;
  value: K;
  onChange: (key: K) => void;
  controls: string;
  label: string;
  interactive?: boolean;
}

/** WAI-ARIA tablist with roving tabindex and arrow-key navigation. */
export function Tabs<K extends string>({
  tabs,
  value,
  onChange,
  controls,
  label,
  interactive = true,
}: TabsProps<K>) {
  const listRef = useRef<HTMLDivElement>(null);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = tabs.findIndex((t) => t.key === value);
    const next = (i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
    onChange(tabs[next].key);
    listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  }

  return (
    <div
      className="tabs"
      role="tablist"
      aria-label={label}
      ref={listRef}
      onKeyDown={interactive ? onKeyDown : undefined}
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          className="tab"
          role="tab"
          type="button"
          aria-selected={t.key === value}
          aria-controls={controls}
          tabIndex={t.key === value && interactive ? 0 : -1}
          onClick={interactive ? () => onChange(t.key) : undefined}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
