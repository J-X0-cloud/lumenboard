import { Icon } from "@/components/ui/icons";
import { RichText } from "@/components/ui/RichText";
import type { AskIntentRef, Insight } from "@/types/dashboard";

/** “Lumenboard noticed” callout; the link hands its question to the Ask panel. */
export function InsightCallout({
  insight,
  onAsk,
}: {
  insight: Insight;
  onAsk?: (intent: AskIntentRef) => void;
}) {
  return (
    <div className="insight">
      <Icon name="spark" />
      <div>
        <b>Lumenboard noticed</b>
        <p>
          <RichText value={insight.body} />
        </p>
        <a
          href="#ask"
          onClick={
            onAsk
              ? (e) => {
                  e.preventDefault();
                  onAsk(insight.question);
                }
              : undefined
          }
        >
          {insight.cta}
        </a>
      </div>
    </div>
  );
}
