import type { LucideIcon } from "lucide-react"
import {
  AlertTriangle,
  Database,
  FileWarning,
  ShieldCheck,
} from "lucide-react"

import type { SourceInventoryItem } from "@/lib/maintainer/source-api"

export type SourceKpiMetric = {
  label: string
  value: string
  detail: string
  icon: LucideIcon
  iconBgClass: string
  iconClassName: string
}

export function buildSourceMetrics(
  sources: SourceInventoryItem[]
): SourceKpiMetric[] {
  const activeSources = sources.filter(
    (source) => source.lifecycleState === "active"
  ).length
  const needsReview = sources.filter(
    (source) =>
      source.partialData.length > 0 ||
      source.ingestionReadiness !== "ready" ||
      source.lifecycleState !== "active"
  ).length
  const missingValidation = sources.filter(
    (source) => source.latestValidationOutcome == null
  ).length

  return [
    {
      label: "Total Sources",
      value: String(sources.length),
      detail: "Inventory records in scope for stewardship.",
      icon: Database,
      iconBgClass: "border-sky-300/20 bg-sky-300/10",
      iconClassName: "text-sky-300",
    },
    {
      label: "Active Sources",
      value: String(activeSources),
      detail: "Sources currently active for downstream use.",
      icon: ShieldCheck,
      iconBgClass: "border-emerald-300/20 bg-emerald-300/10",
      iconClassName: "text-emerald-300",
    },
    {
      label: "Needs Review",
      value: String(needsReview),
      detail: "Sources with lifecycle or ingestion follow-up.",
      icon: AlertTriangle,
      iconBgClass: "border-amber-300/20 bg-amber-300/10",
      iconClassName: "text-amber-300",
    },
    {
      label: "Missing Validation",
      value: String(missingValidation),
      detail: "Sources without a recorded validation outcome.",
      icon: FileWarning,
      iconBgClass: "border-fuchsia-300/20 bg-fuchsia-300/10",
      iconClassName: "text-fuchsia-300",
    },
  ]
}
