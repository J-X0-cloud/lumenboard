import type { Metadata } from "next";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DemoBar } from "@/components/dashboard/DemoBar";
import { isRangeKey, isTabKey } from "@/lib/metrics";

export const metadata: Metadata = {
  title: { absolute: "Live demo — Executive overview · Lumenboard" },
  description:
    "Explore a working Lumenboard dashboard: switch date ranges and tabs, hover any chart, and ask the AI panel questions about a sample retail data set.",
};

interface DemoPageProps {
  searchParams: Promise<{ tab?: string; range?: string }>;
}

export default async function DemoPage({ searchParams }: DemoPageProps) {
  const { tab, range } = await searchParams;
  return (
    <div className="demo">
      <DemoBar />
      <DashboardShell
        initialTab={isTabKey(tab) ? tab : "overview"}
        initialRange={isRangeKey(range) ? range : "30d"}
      />
    </div>
  );
}
