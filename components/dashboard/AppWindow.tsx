import { AskPanel } from "@/components/ask/AskPanel";
import { buildAnswer } from "@/lib/ask";
import { APP_HOST } from "@/lib/data/site";
import { WORKSPACE } from "@/lib/data/dimensions";
import { selectOverview } from "@/lib/metrics";
import type { AskIntent } from "@/types/ask";

import { DashboardControls } from "./DashboardControls";
import { DashboardHeader } from "./DashboardHeader";
import { OverviewPanel } from "./panels/OverviewPanel";
import { Sidebar } from "./Sidebar";

/** Browser-window screenshot of the dashboard for the home page hero, rendered from live components. */
export function AppWindow({ intent = "west-dip" }: { intent?: AskIntent }) {
  return (
    <div className="window">
      <div className="win-bar">
        <i />
        <i />
        <i />
        <span>
          {APP_HOST}/{WORKSPACE.id}
        </span>
      </div>
      <div className="shell mini">
        <Sidebar active="overview" />
        <div className="dmain">
          <DashboardHeader asHeading={false} />
          <DashboardControls tab="overview" range="30d" />
          <OverviewPanel model={selectOverview("30d")} condensed />
        </div>
        <AskPanel variant="static" answers={{ [intent]: buildAnswer(intent) }} selected={intent} />
      </div>
    </div>
  );
}
