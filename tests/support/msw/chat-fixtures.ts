export type PublicChatFixtureState =
  | "answered"
  | "weakSupport"
  | "refused"
  | "cooldown"
  | "fallback"
  | "transportError"

export type PublicChatFixtureEnvelope =
  | {
      success: true
      data:
        | PublicChatAnsweredResponse
        | PublicChatWeakSupportResponse
        | PublicChatRefusedResponse
        | PublicChatCooldownResponse
        | PublicChatFallbackResponse
    }
  | {
      success: false
      error: {
        code: string
        message: string
      }
    }

export type PublicChatAnsweredResponse = {
  state: "answered"
  answer: string
  grounding: {
    supportLevel: "strong"
    cue: string
  }
  citations: PublicChatCitation[]
}

export type PublicChatWeakSupportResponse = {
  state: "weakSupport"
  message: string
  nextStep: string
  grounding: {
    supportLevel: "weak"
    cue: string
  }
  citations: PublicChatCitation[]
}

export type PublicChatRefusedResponse = {
  state: "refused"
  code: "off_topic"
  message: string
  nextStep: string
}

export type PublicChatCooldownResponse = {
  state: "cooldown"
  code: "rate_limited" | "abuse_cooldown"
  message: string
  nextStep: string
  retryAfterSeconds: number
}

export type PublicChatFallbackResponse = {
  state: "fallback"
  message: string
  nextStep: string
  suggestedPrompts: string[]
  fallbackSource?: {
    label: string
  }
}

export type PublicChatCitation = {
  sourceId: string
  title: string
  shortTitle: string
  sourceType: "primary" | "course" | "case" | "reference"
  detail: string
  url?: string
}

export const publicChatEndpoint = "/api/chat"

export const publicChatCitation: PublicChatCitation = {
  sourceId: "gg-src-global-governance-course-frame",
  title: "Global Governance Course Frame",
  shortTitle: "Course frame",
  sourceType: "course",
  detail:
    "The course frame distinguishes global governance from a world government.",
}

export const answeredChatEnvelope = {
  success: true,
  data: {
    state: "answered",
    answer:
      "Global governance coordinates rules and institutions without becoming a world government.",
    grounding: {
      supportLevel: "strong",
      cue: "Grounded answer",
    },
    citations: [publicChatCitation],
  },
} satisfies PublicChatFixtureEnvelope

export const weakSupportChatEnvelope = {
  success: true,
  data: {
    state: "weakSupport",
    message: "Approved materials offer only partial support for this question.",
    nextStep: "Try narrowing the question to the current lesson topic.",
    grounding: {
      supportLevel: "weak",
      cue: "Limited support",
    },
    citations: [],
  },
} satisfies PublicChatFixtureEnvelope

export const refusedChatEnvelope = {
  success: true,
  data: {
    state: "refused",
    code: "off_topic",
    message:
      "I can help with questions about approved Global Governance materials.",
    nextStep: "Try asking about the UN, institutions, or the current section.",
  },
} satisfies PublicChatFixtureEnvelope

export const cooldownChatEnvelope = {
  success: true,
  data: {
    state: "cooldown",
    code: "rate_limited",
    message: "The assistant is temporarily limited.",
    nextStep: "Try again shortly.",
    retryAfterSeconds: 42,
  },
} satisfies PublicChatFixtureEnvelope

export const fallbackChatEnvelope = {
  success: true,
  data: {
    state: "fallback",
    message: "The assistant could not complete a grounded answer right now.",
    nextStep: "Continue with the lesson or try one of these course questions.",
    suggestedPrompts: [
      "What is global governance?",
      "Why is the UN important?",
    ],
    fallbackSource: {
      label: "Current lesson summary",
    },
  },
} satisfies PublicChatFixtureEnvelope

export const transportErrorChatEnvelope = {
  success: false,
  error: {
    code: "invalid_request",
    message: "Use a valid JSON body for grounded chat requests.",
  },
} satisfies PublicChatFixtureEnvelope

export const publicChatFixtureEnvelopes = {
  answered: answeredChatEnvelope,
  weakSupport: weakSupportChatEnvelope,
  refused: refusedChatEnvelope,
  cooldown: cooldownChatEnvelope,
  fallback: fallbackChatEnvelope,
  transportError: transportErrorChatEnvelope,
} satisfies Record<PublicChatFixtureState, PublicChatFixtureEnvelope>
