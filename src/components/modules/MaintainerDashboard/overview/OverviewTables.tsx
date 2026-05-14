import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function DashboardPanel({
  title,
  subtitle,
  badge,
  footer,
  onFooterClick,
  className,
  children,
}: {
  title: string
  subtitle?: string
  badge?: string
  footer?: string
  onFooterClick?: () => void
  className?: string
  children: ReactNode
}) {
  return (
    <section
      className={cn(
        "rounded-md border border-sky-300/18 bg-slate-950/44 p-3 shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-md",
        className
      )}
    >
      <div className="mb-1.5 flex items-center justify-between gap-3 border-b border-sky-300/10 pb-2">
        <h2 className="text-sm font-semibold text-white">
          {title}
          {subtitle ? (
            <span className="ml-1 font-normal text-slate-300">
              ({subtitle})
            </span>
          ) : null}
          {badge ? (
            <span className="ml-2 inline-flex size-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
              {badge}
            </span>
          ) : null}
        </h2>
        {footer ? (
          <button
            type="button"
            className="text-xs font-medium text-sky-300 hover:text-sky-100"
            onClick={onFooterClick}
          >
            {footer}
          </button>
        ) : null}
      </div>
      {children}
    </section>
  )
}

export function CompactTable({
  columns,
  children,
}: {
  columns: string[]
  children: ReactNode
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[470px] text-left">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="pr-2 pb-2 text-[11px] font-medium text-slate-400"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}
