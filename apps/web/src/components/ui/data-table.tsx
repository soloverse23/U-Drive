import type { ReactNode } from "react";
import { cx } from "./cx";

export interface Column<T> {
  key: string;
  header: string;
  /** Numeric columns are right-aligned with tabular figures (spec §3.5). */
  numeric?: boolean | undefined;
  render: (row: T) => ReactNode;
}

/** Dense table: no zebra stripes, gray-200 row dividers. Scrolls inside itself on small screens. */
export function DataTable<T>({
  caption,
  columns,
  rows,
  rowKey,
}: {
  caption: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-body">
        <caption className="pb-3 text-left text-label">{caption}</caption>
        <thead className="text-body-sm text-fg-muted">
          <tr className="border-b border-border">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cx("py-3 pr-4 font-medium last:pr-0", column.numeric && "text-right")}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-b border-border">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cx(
                    "py-3 pr-4 last:pr-0",
                    column.numeric && "text-right whitespace-nowrap tabular-nums",
                  )}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
