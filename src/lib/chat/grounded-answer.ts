import { resolveApprovedSourceId } from "@/data/source-bundles/approved-source-bundle"
import type {
  ChatCitation,
  ChatError,
  ChatGrounding,
  GroundedChatEnvelope,
  GroundedChatRequest,
  GroundedChatSuccess,
} from "@/types/chat"

const sourceTypes = new Set(["primary", "course", "case", "reference"])
const userSafeErrorMessage =
  "The assistant could not return a grounded answer right now. Please try again with a course question."

function asRecord(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`Invalid grounded chat ${label}`)
  }

  return value as Record<string, unknown>
}

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid grounded chat ${label}`)
  }

  return value.trim()
}

function optionalString(value: unknown, label: string): string | undefined {
  if (value === undefined) {
    return undefined
  }

  return requireString(value, label)
}

function optionalSafePublicUrl(
  value: unknown,
  label: string
): string | undefined {
  const rawUrl = optionalString(value, label)

  if (!rawUrl) {
    return undefined
  }

  let parsed: URL
  try {
    parsed = new URL(rawUrl)
  } catch {
    throw new Error(`Invalid grounded chat ${label}`)
  }

  const hostname = parsed.hostname.toLowerCase()
  const isPrivateIpv4 =
    /^10\./.test(hostname) ||
    /^127\./.test(hostname) ||
    /^169\.254\./.test(hostname) ||
    /^192\.168\./.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
  const isPrivateHost =
    hostname === "localhost" ||
    hostname.endsWith(".local") ||
    hostname === "::1" ||
    hostname.startsWith("[") ||
    isPrivateIpv4

  if (
    (parsed.protocol !== "http:" && parsed.protocol !== "https:") ||
    isPrivateHost ||
    parsed.username.length > 0 ||
    parsed.password.length > 0
  ) {
    throw new Error(`Invalid grounded chat ${label}`)
  }

  return parsed.toString()
}

function requirePositiveInteger(value: unknown, label: string): number {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < 1 ||
    value > 300
  ) {
    throw new Error(`Invalid grounded chat ${label}`)
  }

  return value
}

function parseCitation(value: unknown): ChatCitation {
  const citation = asRecord(value, "citation")
  const sourceType = requireString(citation.sourceType, "citation source type")

  if (!sourceTypes.has(sourceType)) {
    throw new Error("Invalid grounded chat citation source type")
  }

  return {
    sourceId: resolveApprovedSourceId(
      requireString(citation.sourceId, "citation source id")
    ),
    title: requireString(citation.title, "citation title"),
    shortTitle: requireString(citation.shortTitle, "citation short title"),
    sourceType: sourceType as ChatCitation["sourceType"],
    detail: requireString(citation.detail, "citation detail"),
    url: optionalSafePublicUrl(citation.url, "citation url"),
  }
}

function parseGrounding(value: unknown): ChatGrounding {
  const grounding = asRecord(value, "grounding")
  const supportLevel = requireString(
    grounding.supportLevel,
    "grounding support level"
  )

  if (supportLevel !== "strong" && supportLevel !== "weak") {
    throw new Error("Invalid grounded chat support level")
  }

  return {
    supportLevel,
    cue: requireString(grounding.cue, "grounding cue"),
  }
}

function parseCitations(value: unknown): ChatCitation[] {
  if (!Array.isArray(value)) {
    throw new Error("Invalid grounded chat citations")
  }

  if (value.length > 6) {
    throw new Error("Invalid grounded chat citation count")
  }

  return value.map(parseCitation)
}

function parseSuggestedPrompts(value: unknown): string[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 4) {
    throw new Error("Invalid grounded chat suggested prompts")
  }

  return value.map((prompt) => requireString(prompt, "suggested prompt"))
}

function parseSuccessData(value: unknown): GroundedChatSuccess {
  const data = asRecord(value, "success data")
  const state = requireString(data.state, "state")

  if (state === "answered") {
    const citations = parseCitations(data.citations)

    if (citations.length === 0) {
      throw new Error("Grounded answers require at least one citation")
    }

    return {
      state,
      answer: requireString(data.answer, "answer"),
      grounding: parseGrounding(data.grounding),
      citations,
    }
  }

  if (state === "weakSupport") {
    return {
      state,
      message: requireString(data.message, "weak-support message"),
      nextStep: requireString(data.nextStep, "weak-support next step"),
      grounding: parseGrounding(data.grounding),
      citations: parseCitations(data.citations),
    }
  }

  if (state === "refused") {
    const code = requireString(data.code, "refusal code")

    if (code !== "off_topic" && code !== "unsafe") {
      throw new Error("Invalid grounded chat refusal code")
    }

    return {
      state,
      code,
      message: requireString(data.message, "refusal message"),
      nextStep: requireString(data.nextStep, "refusal next step"),
    }
  }

  if (state === "cooldown") {
    const code = requireString(data.code, "cooldown code")

    if (code !== "rate_limited" && code !== "abuse_cooldown") {
      throw new Error("Invalid grounded chat cooldown code")
    }

    return {
      state,
      code,
      message: requireString(data.message, "cooldown message"),
      nextStep: requireString(data.nextStep, "cooldown next step"),
      retryAfterSeconds: requirePositiveInteger(
        data.retryAfterSeconds,
        "cooldown retry seconds"
      ),
    }
  }

  if (state === "fallback") {
    const fallbackSource =
      data.fallbackSource === undefined
        ? undefined
        : {
            label: requireString(
              asRecord(data.fallbackSource, "fallback source").label,
              "fallback source label"
            ),
          }

    return {
      state,
      message: requireString(data.message, "fallback message"),
      nextStep: requireString(data.nextStep, "fallback next step"),
      suggestedPrompts: parseSuggestedPrompts(data.suggestedPrompts),
      ...(fallbackSource ? { fallbackSource } : {}),
    }
  }

  throw new Error("Invalid grounded chat state")
}

function parseError(value: unknown): ChatError {
  const error = asRecord(value, "error")

  return {
    code: requireString(error.code, "error code"),
    message: requireString(error.message, "error message"),
  }
}

export function createChatRequest(
  question: string,
  context?: GroundedChatRequest["context"]
): GroundedChatRequest {
  const trimmedQuestion = question.trim()

  if (trimmedQuestion.length === 0) {
    throw new Error("A course question is required")
  }

  return {
    question: trimmedQuestion,
    ...(context ? { context } : {}),
  }
}

export function parseGroundedChatEnvelope(
  value: unknown
): GroundedChatEnvelope {
  const envelope = asRecord(value, "response envelope")

  if (envelope.success === true) {
    return {
      success: true,
      data: parseSuccessData(envelope.data),
    }
  }

  if (envelope.success === false) {
    return {
      success: false,
      error: parseError(envelope.error),
    }
  }

  throw new Error("Invalid grounded chat envelope")
}

export function toUserSafeChatError(): ChatError {
  return {
    code: "grounded_chat_unavailable",
    message: userSafeErrorMessage,
  }
}
