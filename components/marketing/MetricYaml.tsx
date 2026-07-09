import { Fragment } from "react";
import type { CSSProperties } from "react";

import { getMetric, metricYaml } from "@/lib/semantic-layer";

const CLASS = { key: "k", string: "s", ref: "f", comment: "c" } as const;

/** A metric's YAML definition as it lives in the metrics repo, syntax-highlighted. */
export function MetricYaml({
  metricKey = "net_revenue",
  style,
}: {
  metricKey?: string;
  style?: CSSProperties;
}) {
  const metric = getMetric(metricKey);
  const lines = metricYaml(
    metric,
    `metrics/${metric.owner.team.toLowerCase().replace(" ", "_")}/${metric.key}.yml`,
  );
  return (
    <pre className="code" style={style}>
      {lines.map((tokens, i) => (
        <Fragment key={i}>
          {i > 0 ? "\n" : null}
          {tokens.map((t, j) =>
            t.kind ? (
              <span key={j} className={CLASS[t.kind]}>
                {t.text}
              </span>
            ) : (
              <Fragment key={j}>{t.text}</Fragment>
            ),
          )}
        </Fragment>
      ))}
    </pre>
  );
}
