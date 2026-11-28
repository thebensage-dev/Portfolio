import type { Block } from "@thebensage-dev/cms-client";

/** Which group unlocks what in each app. A table from `sm` up; on phones each row is a small card. */
export default function AccessTable({
  columns,
  rows,
}: Pick<Block<"accessTable">, "columns" | "rows">) {
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-surface-muted/60 max-sm:sr-only">
          <tr>
            <th scope="col" className="px-5 py-3 font-semibold">
              {columns.app}
            </th>
            <th scope="col" className="px-5 py-3 font-semibold">
              {columns.group}
            </th>
            <th scope="col" className="px-5 py-3 font-semibold">
              {columns.unlocks}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr key={row.id ?? row.app} className="max-sm:grid max-sm:gap-1 max-sm:p-5">
              <th scope="row" className="font-semibold sm:px-5 sm:py-4">
                {row.app}
              </th>
              <td className="sm:px-5 sm:py-4">
                <code className="code-badge break-all">{row.group}</code>
              </td>
              <td className="text-foreground-muted sm:px-5 sm:py-4">{row.unlocks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
