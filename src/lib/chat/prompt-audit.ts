import type { SourceAwareChatStarterPromptAuditEntry } from "../../data/chat/source-aware-chat.ts"

export type PromptAuditClassification =
  | "answered"
  | "limitedSupport"
  | "boundaryRefusal"
  | "fallback"
  | "weakCitation"
  | "cooldown"
  | "transportFailure"
  | "missingSource"

export type PromptAuditFollowUpAction =
  | "keep"
  | "reword"
  | "remove"
  | "widenApprovedScope"
  | "addApprovedSource"

export type PromptAuditRow = {
  section: string
  depthMode: string
  id: string
  label: string
  prompt: string
  classification: PromptAuditClassification
  sourceIds: string[]
  responseState: string
  supportLevel: string | null
  returnedCitationSourceIds: string[]
  visibleCard: string
  followUpAction: PromptAuditFollowUpAction
  endpointMode: string
  notes: string
  isPrimaryChapter: boolean
}

export function classifyPromptAuditOutcome(
  entry: SourceAwareChatStarterPromptAuditEntry,
  data: Record<string, unknown>,
  endpointMode: string
): PromptAuditRow {
  const state = readString(data.state)

  if (state === "answered") {
    return classifyAnsweredPrompt(entry, data, endpointMode)
  }

  if (state === "weakSupport") {
    return buildAuditRow(entry, {
      classification: "limitedSupport",
      followUpAction: entry.isPrimaryChapter ? "reword" : "keep",
      endpointMode,
      responseState: state,
      supportLevel:
        readString(asRecord(data.grounding)?.supportLevel) || "weak",
      returnedCitationSourceIds: readCitationSourceIds(data.citations),
      visibleCard: "Limited support in approved materials",
      notes:
        readString(data.nextStep) ||
        "The prompt stayed in scope but only reached limited support.",
    })
  }

  if (state === "refused") {
    return buildAuditRow(entry, {
      classification: "boundaryRefusal",
      followUpAction: entry.isPrimaryChapter ? "reword" : "keep",
      endpointMode,
      responseState: state,
      supportLevel: null,
      returnedCitationSourceIds: readCitationSourceIds(data.citations),
      visibleCard: "Course boundary reached",
      notes:
        readString(data.code) ||
        "The prompt was refused by the boundary guard.",
    })
  }

  if (state === "cooldown") {
    const retryAfterSeconds = readNumber(data.retryAfterSeconds)

    return buildAuditRow(entry, {
      classification: "cooldown",
      followUpAction: entry.isPrimaryChapter ? "reword" : "keep",
      endpointMode,
      responseState: state,
      supportLevel: null,
      returnedCitationSourceIds: readCitationSourceIds(data.citations),
      visibleCard: "Cooldown active",
      notes:
        retryAfterSeconds === null
          ? "The endpoint returned a cooldown without a valid retry duration."
          : `retryAfterSeconds=${retryAfterSeconds}`,
    })
  }

  if (state === "fallback") {
    const hasApprovedSourceMapping = entry.readiness.sourceIds.length > 0

    return buildAuditRow(entry, {
      classification: "fallback",
      followUpAction: hasApprovedSourceMapping ? "reword" : "addApprovedSource",
      endpointMode,
      responseState: state,
      supportLevel: readString(asRecord(data.grounding)?.supportLevel) || null,
      returnedCitationSourceIds: readCitationSourceIds(data.citations),
      visibleCard: "Grounded answer unavailable",
      notes:
        readString(data.message) ||
        "The endpoint returned a fallback instead of a stable typed answer.",
    })
  }

  return buildAuditRow(entry, {
    classification: "transportFailure",
    followUpAction: "reword",
    endpointMode,
    responseState: state || "unknown",
    supportLevel: readString(asRecord(data.grounding)?.supportLevel) || null,
    returnedCitationSourceIds: readCitationSourceIds(data.citations),
    visibleCard: "Unsupported chat response",
    notes: `Unsupported response state: ${state || "unknown"}`,
  })
}

export function classifyPromptAuditEnvelopeFailure(
  entry: SourceAwareChatStarterPromptAuditEntry,
  endpointMode: string,
  notes: string
): PromptAuditRow {
  return buildAuditRow(entry, {
    classification: "transportFailure",
    followUpAction: "reword",
    endpointMode,
    responseState: "envelopeFailure",
    supportLevel: null,
    returnedCitationSourceIds: [],
    visibleCard: "Transport failure",
    notes,
  })
}

export function hasStrictPromptAuditMiss(rows: PromptAuditRow[]) {
  return rows.some((row) => row.classification !== "answered")
}

function classifyAnsweredPrompt(
  entry: SourceAwareChatStarterPromptAuditEntry,
  data: Record<string, unknown>,
  endpointMode: string
): PromptAuditRow {
  const citationSourceIds = readCitationSourceIds(data.citations)
  const supportLevel = readString(asRecord(data.grounding)?.supportLevel)
  const matchesExpectedSource = citationSourceIds.some((sourceId) =>
    entry.readiness.sourceIds.includes(sourceId)
  )
  const classification: PromptAuditClassification =
    supportLevel === "strong" && matchesExpectedSource
      ? "answered"
      : "weakCitation"

  return buildAuditRow(entry, {
    classification,
    followUpAction:
      classification === "answered"
        ? "keep"
        : entry.section === "west-philippine-sea-dossier"
          ? "widenApprovedScope"
          : "reword",
    endpointMode,
    responseState: "answered",
    supportLevel: supportLevel || null,
    returnedCitationSourceIds: citationSourceIds,
    visibleCard:
      classification === "answered"
        ? "Grounded answer"
        : "Grounded answer citation gap",
    notes: answeredNotes({
      citationSourceIds,
      matchesExpectedSource,
      supportLevel,
    }),
  })
}

function buildAuditRow(
  entry: SourceAwareChatStarterPromptAuditEntry,
  outcome: {
    classification: PromptAuditClassification
    followUpAction: PromptAuditFollowUpAction
    endpointMode: string
    responseState: string
    supportLevel: string | null
    returnedCitationSourceIds: string[]
    visibleCard: string
    notes: string
  }
): PromptAuditRow {
  return {
    section: entry.section,
    depthMode: entry.depthMode,
    id: entry.id,
    label: entry.label,
    prompt: entry.prompt,
    classification: outcome.classification,
    sourceIds: [...entry.readiness.sourceIds],
    responseState: outcome.responseState,
    supportLevel: outcome.supportLevel,
    returnedCitationSourceIds: [...outcome.returnedCitationSourceIds],
    visibleCard: outcome.visibleCard,
    followUpAction: outcome.followUpAction,
    endpointMode: outcome.endpointMode,
    notes: outcome.notes,
    isPrimaryChapter: entry.isPrimaryChapter,
  }
}

function answeredNotes({
  citationSourceIds,
  matchesExpectedSource,
  supportLevel,
}: {
  citationSourceIds: string[]
  matchesExpectedSource: boolean
  supportLevel: string
}) {
  if (supportLevel !== "strong") {
    return `Expected strong support but received ${supportLevel || "unknown"}.`
  }

  if (!matchesExpectedSource) {
    return citationSourceIds.length > 0
      ? `Returned non-matching citations: ${citationSourceIds.join(", ")}`
      : "The answer completed without a matching approved source citation."
  }

  return `Returned citations: ${citationSourceIds.join(", ")}`
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function readCitationSourceIds(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((citation) => readString(asRecord(citation)?.sourceId))
    .filter((sourceId) => sourceId.length > 0)
}
