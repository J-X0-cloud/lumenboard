"use client";

import { Icon } from "@/components/ui/icons";
import { RANGES, TABS, periodText } from "@/lib/metrics";
import type { RangeKey, TabKey } from "@/types/dashboard";

import { RangePicker } from "./RangePicker";
import { Tabs } from "./Tabs";

interface DashboardControlsProps {
  tab: TabKey;
  range: RangeKey;
  onTabChange?: (tab: TabKey) => void;
  onRangeChange?: (range: RangeKey) => void;
}

export function DashboardControls({ tab, range, onTabChange, onRangeChange }: DashboardControlsProps) {
  const interactive = Boolean(onTabChange && onRangeChange);
  const noop = () => undefined;

  return (
    <>
      <div className="controls">
        <Tabs
          tabs={TABS}
          value={tab}
          onChange={onTabChange ?? noop}
          controls="dash"
          label="Dashboard sections"
          interactive={interactive}
        />
        <div className="rctl">
          <RangePicker value={range} onChange={onRangeChange ?? noop} interactive={interactive} />
          <span className="chip hide-sm">
            <Icon name="filter" />
            Region <b>All</b>
          </span>
          <span className="chip hide-sm">
            <Icon name="cal" />
            vs <b>Prior period</b>
          </span>
        </div>
      </div>
      <p className="period" id="period" aria-live="polite">
        {periodText(range)} · compared with {RANGES[range].comparison}
      </p>
    </>
  );
}
