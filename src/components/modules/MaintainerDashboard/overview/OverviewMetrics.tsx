import type { ReactNode } from "react"
import {
  AlertTriangle,
  CalendarCheck,
  Check,
  ChevronRight,
  Eye,
  Info,
  Link2,
  RefreshCcw,
  Search,
  ShieldCheck,
} from "lucide-react"

import { cn } from "@/lib/utils"

export function StatusCard({
  title,
  icon,
  body,
  accent,
}: {
  title: string
  icon: ReactNode
  body: ReactNode
  accent?: "green"
}) {
  return (
    <article
      className={cn(
        "relative min-h-[118px] rounded-md border border-sky-300/18 bg-slate-950/40 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur-md",
        accent === "green" &&
          "before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:rounded-l-md before:bg-green-500"
      )}
    >
      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-white">
        <span>{title}</span>
        <span className="text-slate-400">{icon}</span>
      </div>
      {body}
    </article>
  )
}

export function StatusPill({
  tone,
  children,
}: {
  tone: "green" | "amber" | "blue"
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        "mt-2 inline-flex min-h-5 items-center rounded-full border px-3 text-xs font-semibold",
        tone === "green" &&
          "border-green-500/40 bg-green-500/15 text-green-300",
        tone === "amber" &&
          "border-amber-400/40 bg-amber-400/15 text-amber-300",
        tone === "blue" && "border-blue-400/40 bg-blue-500/15 text-blue-300"
      )}
    >
      {children}
    </span>
  )
}

export function SourceStatusPill({
  tone,
  children,
}: {
  tone: "approved" | "review" | "failed"
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded px-2 py-0.5 text-[11px] font-semibold",
        tone === "approved" && "bg-green-500/18 text-green-300",
        tone === "review" && "bg-amber-400/18 text-amber-300",
        tone === "failed" && "bg-red-500/18 text-red-300"
      )}
    >
      {children}
    </span>
  )
}

export function RunStatusPill({
  result,
  children,
}: {
  result: "Passed" | "Warning" | "Failed"
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded px-2 py-0.5 text-[11px] font-semibold",
        result === "Passed" && "bg-green-500/18 text-green-300",
        result === "Warning" && "bg-amber-400/18 text-amber-300",
        result === "Failed" && "bg-red-500/18 text-red-300"
      )}
    >
      {children}
    </span>
  )
}

export function SeverityPill({ severity }: { severity: "High" | "Medium" }) {
  return (
    <span
      className={cn(
        "rounded border px-2 py-1 text-[11px] font-semibold",
        severity === "High"
          ? "border-red-500/45 bg-red-500/12 text-red-300"
          : "border-amber-400/45 bg-amber-400/12 text-amber-300"
      )}
    >
      {severity}
    </span>
  )
}

export function ActionPill({
  tone,
  children,
}: {
  tone: "blue" | "green" | "amber"
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded px-2 py-0.5 text-[11px]",
        tone === "blue" && "border border-blue-500/45 text-blue-300",
        tone === "green" && "bg-green-500/18 text-green-300",
        tone === "amber" && "bg-amber-400/18 text-amber-300"
      )}
    >
      {children}
    </span>
  )
}

export function CoverageBar({ value }: { value: number }) {
  const tone =
    value >= 90 ? "bg-green-500" : value >= 70 ? "bg-amber-400" : "bg-red-500"
  return (
    <div className="flex items-center gap-2">
      <span className="w-7 text-xs text-slate-300">{value}%</span>
      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800">
        <span
          className={cn("block h-full", tone)}
          style={{ width: `${value}%` }}
        />
      </span>
    </div>
  )
}

export function RingMetric({ value, tone }: { value: number; tone: "green" }) {
  return (
    <div
      className="flex size-16 items-center justify-center rounded-full text-sm font-bold text-white"
      style={{
        background: `conic-gradient(${tone === "green" ? "#4ade80" : "#38bdf8"} ${value * 3.6}deg, rgba(30, 41, 59, 0.85) 0deg)`,
      }}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-slate-950">
        {value}%
      </span>
    </div>
  )
}

export function ActionIcon({
  type,
}: {
  type: "search" | "refresh" | "link" | "calendar"
}) {
  const className = "mt-1 size-5 shrink-0 text-blue-400"
  if (type === "refresh") {
    return <RefreshCcw className={className} aria-hidden />
  }
  if (type === "link") {
    return <Link2 className={className} aria-hidden />
  }
  if (type === "calendar") {
    return <CalendarCheck className={className} aria-hidden />
  }
  return <Search className={className} aria-hidden />
}

export function Sparkline({ tone }: { tone: "good" | "warn" }) {
  const values =
    tone === "warn"
      ? [35, 42, 37, 50, 45, 53, 48, 57, 46, 55]
      : [42, 36, 49, 43, 52, 46, 58, 51, 63, 57]
  const color = tone === "warn" ? "#f59e0b" : "#22c55e"
  return (
    <svg className="mt-3 h-7 w-full" viewBox="0 0 100 32" aria-hidden>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={values
          .map((value, index) => `${index * 11},${32 - value / 2}`)
          .join(" ")}
      />
    </svg>
  )
}

export function FilterChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex min-h-7 items-center rounded-md border border-sky-300/15 bg-slate-950/35 px-3 text-slate-300">
      {children}
    </span>
  )
}

export function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("size-2 rounded-sm", color)} />
      {label}
    </span>
  )
}

export { AlertTriangle, Check, ChevronRight, Eye, Info, ShieldCheck }
