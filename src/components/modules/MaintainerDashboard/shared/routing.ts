import type {
  SourceInventoryItem,
  StewardshipDashboard,
} from "@/lib/maintainer/source-api"

import type { MaintainerPreset, MaintainerRoute } from "./types"

function parseMaintainerPreset(value: string | null): MaintainerPreset | null {
  if (
    value === "sources-needing-attention" ||
    value === "validation-follow-up" ||
    value === "operations-recent-activity"
  ) {
    return value
  }
  return null
}

export function parseMaintainerRoute(pathname: string): MaintainerRoute {
  const url = new URL(pathname, "https://maintainer.local")
  const normalized = url.pathname.replace(/\/+$/, "") || "/maintainer"
  const preset = parseMaintainerPreset(url.searchParams.get("preset"))
  const path = `${normalized}${url.search}`

  if (normalized === "/maintainer" || normalized === "/maintainer/overview") {
    return { section: "overview", path, preset }
  }
  if (normalized === "/maintainer/sources") {
    return { section: "sources", path, preset }
  }
  if (normalized === "/maintainer/sources/new") {
    return { section: "sourceNew", path, preset }
  }
  if (normalized.startsWith("/maintainer/sources/")) {
    const sourceSegment = normalized.replace("/maintainer/sources/", "")
    try {
      const sourceId = decodeURIComponent(sourceSegment)
      if (sourceId) {
        return { section: "sourceDetail", path, preset, sourceId }
      }
    } catch {
      return { section: "overview", path: "/maintainer", preset: null }
    }
  }
  if (normalized === "/maintainer/validation") {
    return { section: "validation", path, preset }
  }
  if (normalized === "/maintainer/audit-trail") {
    return { section: "auditTrail", path, preset }
  }
  if (normalized === "/maintainer/chatbot-trust") {
    return { section: "chatbotTrust", path, preset }
  }
  if (normalized === "/maintainer/operations") {
    return { section: "operations", path, preset }
  }
  return { section: "overview", path: "/maintainer", preset: null }
}

export function buildSourceDetailPath(
  sourceId: string,
  preset: MaintainerPreset | null
) {
  const encoded = encodeURIComponent(sourceId)
  return preset
    ? `/maintainer/sources/${encoded}?preset=${preset}`
    : `/maintainer/sources/${encoded}`
}

export function filterSourcesForPreset(
  sources: SourceInventoryItem[],
  preset: MaintainerPreset | null
) {
  if (preset === "sources-needing-attention") {
    return sources.filter(
      (source) =>
        source.partialData.length > 0 ||
        source.ingestionReadiness !== "ready" ||
        source.lifecycleState !== "active"
    )
  }
  if (preset === "validation-follow-up") {
    return sources.filter(
      (source) => source.latestValidationOutcome !== "succeeded"
    )
  }
  return sources
}

export function getPresetFocusItems(
  dashboard: StewardshipDashboard,
  preset: MaintainerPreset | null
) {
  if (preset === "operations-recent-activity") {
    return dashboard.auditEvents.slice(0, 3).map((event) => ({
      id: event.eventId,
      label: event.sourceId,
      summary: event.summary,
      path: buildSourceDetailPath(event.sourceId, preset),
    }))
  }

  return filterSourcesForPreset(dashboard.sources, preset)
    .slice(0, 3)
    .map((source) => ({
      id: source.sourceId,
      label: source.title,
      summary:
        preset === "validation-follow-up"
          ? source.latestValidationOutcome == null
            ? "No validation evidence has been recorded yet."
            : `Latest validation outcome is ${source.latestValidationOutcome}.`
          : (source.partialData[0]?.reason ??
            `${source.lifecycleState} sources still need maintainer follow-through.`),
      path: buildSourceDetailPath(source.sourceId, preset),
    }))
}
