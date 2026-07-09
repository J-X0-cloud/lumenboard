import clsx from "clsx";
import type { ReactNode } from "react";

interface FeatureSplitProps {
  id?: string;
  eyebrow: string;
  title: string;
  lead: string;
  /** Put the visual on the left. */
  reverse?: boolean;
  /** Extra copy under the lead (check lists, links, chips). */
  children?: ReactNode;
  /** The visual: a product screenshot, code block or diagram. */
  stage: ReactNode;
  flush?: boolean;
}

export function FeatureSplit({
  id,
  eyebrow,
  title,
  lead,
  reverse = false,
  children,
  stage,
  flush = true,
}: FeatureSplitProps) {
  return (
    <section className="sec" id={id} style={flush ? { paddingTop: 0 } : undefined}>
      <div className="wrap">
        <div className={clsx("feat", reverse && "rev")}>
          <div className="feat-copy">
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
            <p className="lead">{lead}</p>
            {children}
          </div>
          {stage}
        </div>
      </div>
    </section>
  );
}
