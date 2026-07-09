import { Icon } from "@/components/ui/icons";
import { highlightSql } from "@/lib/sql-highlight";

const CLASS = { keyword: "k", string: "s", comment: "c" } as const;

export function SqlBlock({ sql }: { sql: string }) {
  return (
    <details>
      <summary>
        <Icon name="code" />
        Show SQL
      </summary>
      <pre className="sql">
        {highlightSql(sql).map((t, i) =>
          t.kind ? (
            <span key={i} className={CLASS[t.kind]}>
              {t.text}
            </span>
          ) : (
            t.text
          ),
        )}
      </pre>
    </details>
  );
}
