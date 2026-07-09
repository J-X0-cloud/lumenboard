import { Chart } from "@/components/charts/Chart";
import { DeltaBadge } from "@/components/dashboard/DeltaBadge";
import { Icon } from "@/components/ui/icons";
import { RichText } from "@/components/ui/RichText";
import type { AskAnswer as AskAnswerModel } from "@/types/ask";

import { SqlBlock } from "./SqlBlock";

/** One answered question: the steps taken, a chart card, the explanation, the SQL and follow-up actions. */
export function AskAnswer({ answer }: { answer: AskAnswerModel }) {
  const { card } = answer;
  return (
    <>
      <div className="q">{answer.question}</div>
      <div className="a">
        <div className="steps">
          {answer.steps.map((step, i) => (
            <div key={i}>
              <Icon name="check" />
              <span>
                <RichText value={step} />
              </span>
            </div>
          ))}
        </div>
        <div className="a-card">
          <div className="t">{card.title}</div>
          {card.headline ? (
            <div className="big">
              {card.headline.value} {card.headline.delta ? <DeltaBadge delta={card.headline.delta} /> : null}
            </div>
          ) : (
            <div style={{ height: 8 }} />
          )}
          <Chart spec={card.chart} />
        </div>
        <p>
          <RichText value={answer.narrative} />
        </p>
        <SqlBlock sql={answer.sql} />
        <div className="a-act">
          {answer.actions.map((action) => (
            <span key={action.label}>
              <Icon name={action.icon} />
              {action.label}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
