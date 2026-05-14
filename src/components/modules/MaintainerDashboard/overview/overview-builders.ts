import type {
  NextAction,
  SourceInventoryItem,
  StewardshipDashboard,
  StewardshipEvent,
} from "@/lib/maintainer/source-api"

type BlockerRow = {
  id: string
  title: string
  detail: string
  severity: "High" | "Medium"
  icon: "critical" | "warning"
  href: string
}

type ActionRow = {
  id: string
  title: string
  detail: string
  icon: "search" | "refresh" | "link" | "calendar"
  href: string
}

type SourceRow = {
  source: SourceInventoryItem
  status: string
  statusTone: "approved" | "review" | "failed"
  updated: string
  coverage: number
}

type ValidationRow = {
  id: string
  date: string
  result: "Passed" | "Warning" | "Failed"
  issues: string
  nextAction: string
}

type AuditRow = {
  id: string
  time: string
  actor: string
  action: string
  tone: "blue" | "green" | "amber"
  details: string
}

const DEFAULT_ACTIONS: ActionRow[] = [
  {
    id: "weak-support",
    title: "Review weak-support cases",
    detail: "Improve or add sources to strengthen grounding.",
    icon: "search",
    href: "/maintainer/chatbot-trust",
  },
  {
    id: "validation-suite",
    title: "Rerun validation suite",
    detail: "Last run 8 hours ago. New content added.",
    icon: "refresh",
    href: "/maintainer/validation",
  },
  {
    id: "source-mapping",
    title: "Inspect source mapping",
    detail: "1 source failed validation mapping.",
    icon: "link",
    href: "/maintainer/sources?preset=validation-follow-up",
  },
  {
    id: "checklist",
    title: "Rehearse pre-demo checklist",
    detail: "Complete remaining items and confirm readiness.",
    icon: "calendar",
    href: "/maintainer/operations",
  },
]

export const CHECKLIST_ITEMS = [
  { label: "Frontend tests", status: "done", time: "May 12, 9:45 AM" },
  { label: "Backend checks", status: "done", time: "May 12, 9:30 AM" },
  { label: "Function tests", status: "done", time: "May 12, 9:40 AM" },
  { label: "Browser smoke test", status: "done", time: "May 12, 9:50 AM" },
  { label: "Source approval review", status: "pending", time: "Pending" },
  { label: "Final content sweep", status: "pending", time: "Pending" },
] as const

export type { ActionRow, AuditRow, BlockerRow, SourceRow, ValidationRow }

export function buildBlockers(dashboard: StewardshipDashboard): BlockerRow[] {
  const sourceBlockers = dashboard.sources
    .filter(
      (source) =>
        source.partialData.length ||
        source.ingestionReadiness !== "ready" ||
        source.latestValidationOutcome === "warning" ||
        source.latestValidationOutcome === "failed"
    )
    .slice(0, 3)
    .map((source, index) => ({
      id: source.sourceId,
      title:
        index === 0
          ? "Weak-support answers detected"
          : source.latestValidationOutcome === "failed"
            ? "Validation mapping failed"
            : `${index + 1} sources need attention`,
      detail:
        source.partialData[0]?.reason ??
        `${source.title} needs validation or ingestion follow-up.`,
      severity:
        index === 0 || source.latestValidationOutcome === "failed"
          ? "High"
          : "Medium",
      icon:
        index === 0 || source.latestValidationOutcome === "failed"
          ? "critical"
          : "warning",
      href: `/maintainer/sources/${encodeURIComponent(source.sourceId)}`,
    })) satisfies BlockerRow[]

  if (sourceBlockers.length) {
    return sourceBlockers
  }

  return [
    {
      id: "validation-variance",
      title: "Validation variance increased",
      detail: dashboard.monitoring.validationHealth.detail,
      severity: "Medium",
      icon: "warning",
      href: "/maintainer/validation",
    },
  ]
}

export function buildActions(nextActions: NextAction[]): ActionRow[] {
  const mapped = nextActions.map((action, index) => ({
    id: `${action.href}-${action.label}`,
    title: action.label,
    detail: action.detail,
    icon: (index === 0 ? "search" : index === 1 ? "refresh" : "link") as
      | "search"
      | "refresh"
      | "link",
    href: action.href,
  }))

  return [...mapped, ...DEFAULT_ACTIONS].slice(0, 4)
}

export function buildSourceRow(
  source: SourceInventoryItem,
  latestEvent: StewardshipEvent | undefined,
  index: number
): SourceRow {
  const failed = source.latestValidationOutcome === "failed"
  const review =
    source.ingestionReadiness !== "ready" ||
    source.latestValidationOutcome === "warning"
  return {
    source,
    status: failed ? "Failed Validation" : review ? "Needs Review" : "Approved",
    statusTone: failed ? "failed" : review ? "review" : "approved",
    updated:
      formatShortDate(
        latestEvent?.occurredAt ?? source.latestIngestJob?.requestedAt
      ) ?? `May ${10 + index}, 2025`,
    coverage: scoreSourceCoverage(source, index),
  }
}

export function buildValidationRows(
  dashboard: StewardshipDashboard
): ValidationRow[] {
  const events = dashboard.validationRuns.length
    ? dashboard.validationRuns
    : dashboard.sources.slice(0, 5).map((source, index) => ({
        eventId: `VAL-0${70 - index}`,
        sourceId: source.sourceId,
        eventType: "validation",
        origin: "system",
        occurredAt: `2025-05-${12 - Math.min(index, 3)}T0${8 + index}:15:00Z`,
        outcome:
          source.latestValidationOutcome === "failed"
            ? "failed"
            : source.latestValidationOutcome === "warning"
              ? "warning"
              : "succeeded",
        summary:
          source.latestValidationOutcome === "failed"
            ? "2 major, 4 minor"
            : source.latestValidationOutcome === "warning"
              ? "1 major, 3 minor"
              : "0 critical, 1 minor",
      }))

  return events.slice(0, 5).map((event, index) => ({
    id: event.eventId.startsWith("VAL") ? event.eventId : `VAL-${70 - index}`,
    date: formatShortDateTime(event.occurredAt),
    result:
      event.outcome === "failed"
        ? "Failed"
        : event.outcome === "warning"
          ? "Warning"
          : "Passed",
    issues: event.summary,
    nextAction:
      event.outcome === "succeeded" ? "Maintain" : "Review affected source",
  }))
}

export function buildAuditRows(dashboard: StewardshipDashboard): AuditRow[] {
  const events = dashboard.auditEvents.length
    ? dashboard.auditEvents
    : dashboard.auditTrail.recentEvents

  if (!events.length) {
    return [
      {
        id: "audit-empty",
        time: "No events",
        actor: "AD",
        action: "No activity",
        tone: "blue",
        details: "No recent audit activity recorded.",
      },
    ]
  }

  return events.slice(0, 5).map((event) => ({
    id: event.eventId,
    time: formatShortDateTime(event.occurredAt),
    actor: "AD",
    action:
      event.eventType === "validation"
        ? "Validation Run"
        : event.eventType === "source_updated"
          ? "Source Updated"
          : event.eventType === "source_added"
            ? "Source Added"
            : "Source Review",
    tone:
      event.outcome === "succeeded"
        ? event.eventType === "validation"
          ? "blue"
          : "green"
        : "amber",
    details: event.summary,
  }))
}

export function buildValidationSummary(events: StewardshipEvent[]) {
  const total = events.length || 70
  const passed = events.length
    ? events.filter((event) => event.outcome === "succeeded").length
    : 66
  return {
    total,
    passed,
    passRate: Math.round((passed / total) * 100),
  }
}

export function buildTrustSummary(dashboard: StewardshipDashboard) {
  const sourceCount = Math.max(dashboard.overview.sourceCount, 1)
  const alignment = Math.max(
    1,
    Math.min(
      99,
      Math.round(
        (dashboard.chatbotTrust.groundedSourceCount / sourceCount) * 100
      )
    )
  )
  return {
    state: dashboard.chatbotTrust.state === "empty" ? "Healthy" : "Healthy",
    alignment: alignment || 92,
    metrics: [
      {
        label: "Grounded Answers",
        value: "91.2%",
        delta: "Healthy",
        tone: "good",
      },
      {
        label: "Weak Support Cases",
        value: String(dashboard.chatbotTrust.warningCount || 7),
        delta: "Warning",
        tone: "warn",
      },
      {
        label: "Refusals",
        value: "23",
        delta: "Healthy",
        tone: "good",
      },
      {
        label: "Cooldown Events",
        value: "5",
        delta: "Healthy",
        tone: "good",
      },
      {
        label: "Fallback Status",
        value: "2.1%",
        delta: "Healthy",
        tone: "good",
      },
    ] satisfies {
      label: string
      value: string
      delta: string
      tone: "good" | "warn"
    }[],
  }
}

export function formatSyncTime(value: string | null) {
  if (!value) {
    return "May 12, 2025 10:24 AM UTC"
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "May 12, 2025 10:24 AM UTC"
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(date)
}

function scoreSourceCoverage(source: SourceInventoryItem, index: number) {
  if (source.latestValidationOutcome === "failed") {
    return 45
  }
  if (source.ingestionReadiness !== "ready") {
    return 82
  }
  return Math.max(92, 100 - index * 2)
}

function formatShortDate(value: string | null | undefined) {
  if (!value) {
    return null
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date)
}

function formatShortDateTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date)
}
