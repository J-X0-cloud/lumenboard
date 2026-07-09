import type { AskIntentRef, PanelModel } from "@/types/dashboard";

import { AcquisitionPanel } from "./AcquisitionPanel";
import { OverviewPanel } from "./OverviewPanel";
import { RetentionPanel } from "./RetentionPanel";
import { RevenuePanel } from "./RevenuePanel";

export function DashboardPanel({
  model,
  onAsk,
}: {
  model: PanelModel;
  onAsk?: (intent: AskIntentRef) => void;
}) {
  switch (model.tab) {
    case "overview":
      return <OverviewPanel model={model} onAsk={onAsk} />;
    case "revenue":
      return <RevenuePanel model={model} />;
    case "retention":
      return <RetentionPanel model={model} />;
    case "acquisition":
      return <AcquisitionPanel model={model} />;
  }
}
