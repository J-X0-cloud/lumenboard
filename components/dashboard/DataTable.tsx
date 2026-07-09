import clsx from "clsx";
import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  align?: "numeric" | "spark";
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  className?: string;
}

/** Dense data table that scrolls inside its card on narrow screens. */
export function DataTable<T>({ columns, rows, rowKey, className }: DataTableProps<T>) {
  const cellClass = (c: Column<T>) => (c.align === "numeric" ? "n" : c.align === "spark" ? "sp" : undefined);
  return (
    <div className="tscroll">
      <table className={clsx("dt", className)}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={c.align === "numeric" ? "n" : undefined}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((c) => (
                <td key={c.key} className={cellClass(c)}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Primary cell text with a muted second line. */
export function NameCell({ name, detail }: { name: string; detail?: string }) {
  return (
    <>
      <b>{name}</b>
      {detail ? <small>{detail}</small> : null}
    </>
  );
}
