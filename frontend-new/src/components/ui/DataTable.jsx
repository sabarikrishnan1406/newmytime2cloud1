"use client";

export default function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  error = null,
  emptyMessage = "No data found.",
  onRowClick = () => {},
  pagination = null,
  className = "",
}) {
  return (
    <div className="glass-panel rounded-xl shadow-soft overflow-hidden min-w-0">
      <div className="overflow-x-auto h-full max-h-[700px] min-h-[0vh]">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="py-4 px-3 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            <>
              {data.map((item, i) => (
                <tr
                  key={item.id || i}
                  className="hover:bg-white/50 dark:hover:bg-slate-700/30 transition-colors group cursor-pointer"
                  onClick={() => onRowClick(item)}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="py-4 px-3 whitespace-nowrap">
                      {col.render ? col.render(item) : item[col.key] || "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </>
          </tbody>
        </table>
      </div>
      {pagination && <div className="">{pagination}</div>}
    </div>
  );
}
