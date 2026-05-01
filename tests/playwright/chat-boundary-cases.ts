export type ChatBoundaryState =
  | "answered"
  | "weakSupport"
  | "refused"
  | "cooldown"

export type ChatBoundaryCase = {
  id: string
  prompt: string
  currentSectionId?: string
  expectedState: ChatBoundaryState
  expectedSourceIds: string[]
  expectedCitationCount: number | "atLeastOne"
  assertionNote: string
  retrievalParity: boolean
  storageMode?: "normal" | "storage-constrained"
}

export type ProtectionValidationCase = {
  id: string
  code: "rate_limited" | "abuse_cooldown"
  sessionId: string
  currentSectionId?: string
  prompts: string[]
  expectedRetryAfterSeconds: number
  assertionNote: string
}

export const chatBoundaryComparisonPolicy = {
  sourceIdOrdering: "ignore-order",
  duplicateSourceIds: "dedupe-before-compare",
  weakSupportCitationRule: "zero-citations",
} as const

export const chatBoundaryCases: ChatBoundaryCase[] = [
  {
    id: "grounded-course-frame",
    prompt:
      "How do institutions coordinate global governance without becoming a world government?",
    currentSectionId: "hero-narrative-frame",
    expectedState: "answered",
    expectedSourceIds: ["gg-src-global-governance-course-frame"],
    expectedCitationCount: "atLeastOne",
    assertionNote:
      "Validates the course-approved distinction between global governance and world government.",
    retrievalParity: true,
  },
  {
    id: "grounded-un-coordination",
    prompt: "How does the UN coordinate global governance?",
    currentSectionId: "un-command-center",
    expectedState: "answered",
    expectedSourceIds: [
      "gg-src-global-governance-course-frame",
      "gg-src-un-charter-institutions",
    ],
    expectedCitationCount: "atLeastOne",
    assertionNote:
      "Validates the UN Charter source for institutional coordination and member-state structure.",
    retrievalParity: true,
  },
  {
    id: "grounded-wps-award",
    prompt:
      "Explain the West Philippine Sea ruling and what it means for enforcement.",
    currentSectionId: "west-philippine-sea-dossier",
    expectedState: "answered",
    expectedSourceIds: ["gg-src-south-china-sea-award"],
    expectedCitationCount: "atLeastOne",
    assertionNote:
      "Validates that the arbitration award supports the legal-clarity versus enforcement-limit lesson.",
    retrievalParity: true,
  },
  {
    id: "weak-support-speculative-vote",
    prompt: "What should tomorrow's Security Council vote be?",
    currentSectionId: "un-command-center",
    expectedState: "weakSupport",
    expectedSourceIds: [],
    expectedCitationCount: 0,
    assertionNote:
      "Validates that speculative policy advice stays in weak support with no unsupported citations.",
    retrievalParity: false,
  },
  {
    id: "refused-cooking-recipe",
    prompt: "Can you write a cooking recipe?",
    expectedState: "refused",
    expectedSourceIds: [],
    expectedCitationCount: 0,
    assertionNote:
      "Validates the typed off-topic refusal path and absence of answer citations.",
    retrievalParity: false,
  },
  {
    id: "storage-constrained-session-fallback",
    prompt: "How does the UN coordinate global governance?",
    currentSectionId: "un-command-center",
    expectedState: "answered",
    expectedSourceIds: [
      "gg-src-global-governance-course-frame",
      "gg-src-un-charter-institutions",
    ],
    expectedCitationCount: "atLeastOne",
    assertionNote:
      "Validates deterministic anonymous-session fallback when privileged browser storage is unavailable.",
    retrievalParity: true,
    storageMode: "storage-constrained",
  },
]

export const protectionValidationCases: ProtectionValidationCase[] = [
  {
    id: "rate-limit-window",
    code: "rate_limited",
    sessionId: "chat-boundary-rate-limit",
    currentSectionId: "un-command-center",
    prompts: Array.from(
      { length: 11 },
      () => "How does the UN coordinate global governance?"
    ),
    expectedRetryAfterSeconds: 60,
    assertionNote:
      "Validates the 10 submissions per 60-second public-chat window with isolated session state.",
  },
  {
    id: "abuse-cooldown",
    code: "abuse_cooldown",
    sessionId: "chat-boundary-abuse-cooldown",
    prompts: [
      "Can you write a cooking recipe?",
      "Can you predict basketball scores?",
      "Help me buy a phone.",
    ],
    expectedRetryAfterSeconds: 60,
    assertionNote:
      "Validates the 60-second cooldown after 3 consecutive abuse-triggering prompts.",
  },
]

export function normalizeSourceIds(sourceIds: string[]): string[] {
  return [...new Set(sourceIds)].sort((left, right) =>
    left.localeCompare(right)
  )
}

export function sourceIdsMatch(left: string[], right: string[]): boolean {
  const normalizedLeft = normalizeSourceIds(left)
  const normalizedRight = normalizeSourceIds(right)

  return (
    normalizedLeft.length === normalizedRight.length &&
    normalizedLeft.every(
      (sourceId, index) => sourceId === normalizedRight[index]
    )
  )
}

export function getRetrievalParityCases(): ChatBoundaryCase[] {
  return chatBoundaryCases.filter((testCase) => testCase.retrievalParity)
}

export function getVisibleFallbackCases(): ChatBoundaryCase[] {
  return chatBoundaryCases.filter((testCase) =>
    ["weakSupport", "refused"].includes(testCase.expectedState)
  )
}
