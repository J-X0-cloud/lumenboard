"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AskPanel } from "@/components/ask/AskPanel";
import { INTENTS, buildAnswer } from "@/lib/ask";
import { selectPanel } from "@/lib/metrics";
import type { AskAnswer, AskIntent } from "@/types/ask";
import type { RangeKey, TabKey } from "@/types/dashboard";

import { DashboardControls } from "./DashboardControls";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardPanel } from "./panels/DashboardPanel";
import { Sidebar } from "./Sidebar";

/** Below this width the Ask panel stacks under the dashboard instead of sitting beside it. */
const STACKED_ASK_BREAKPOINT = 1361;

interface DashboardShellProps {
  initialTab?: TabKey;
  initialRange?: RangeKey;
}

/**
 * The live dashboard: workspace sidebar, tabbed panels driven by the metrics service, and the Ask panel.
 * Tab and range are mirrored to the URL so a shared link opens the same view.
 */
export function DashboardShell({ initialTab = "overview", initialRange = "30d" }: DashboardShellProps) {
  const [tab, setTab] = useState<TabKey>(initialTab);
  const [range, setRange] = useState<RangeKey>(initialRange);
  const [intent, setIntent] = useState<AskIntent>("west-dip");

  const model = useMemo(() => selectPanel(tab, range), [tab, range]);
  const answers = useMemo(
    () => Object.fromEntries(INTENTS.map((i) => [i, buildAnswer(i)])) as Record<AskIntent, AskAnswer>,
    [],
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    url.searchParams.set("range", range);
    window.history.replaceState(null, "", url);
  }, [tab, range]);

  const openAnswer = useCallback((next: AskIntent) => {
    setIntent(next);
    if (window.innerWidth < STACKED_ASK_BREAKPOINT) {
      document.getElementById("ask")?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="shell">
      <Sidebar active={tab} onSelect={setTab} />
      <main className="dmain" id="main">
        <DashboardHeader />
        <DashboardControls tab={tab} range={range} onTabChange={setTab} onRangeChange={setRange} />
        <div id="dash">
          <div className="dpanel" id={`p-${tab}-${range}`} role="tabpanel">
            <DashboardPanel model={model} onAsk={openAnswer} />
          </div>
        </div>
      </main>
      <AskPanel answers={answers} selected={intent} onSelect={setIntent} />
    </div>
  );
}
