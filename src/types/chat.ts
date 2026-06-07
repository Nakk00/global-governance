export type ChatSourceType = "primary" | "course" | "case" | "reference"
export type ChatDepthMode = "student" | "expert"

export type ChatCitation = {
  sourceId: string
  title: string
  shortTitle: string
  sourceType: ChatSourceType
  detail: string
  url?: string
}

export type ChatGrounding = {
  supportLevel: "strong" | "weak"
  cue: string
}

export type GroundedChatRequest = {
  question: string
  context?: {
    currentSectionId?: string
    depthMode?: ChatDepthMode
  }
}

export type GroundedChatAnswer = {
  state: "answered"
  answer: string
  grounding: ChatGrounding
  citations: ChatCitation[]
}

export type GroundedChatWeakSupport = {
  state: "weakSupport"
  message: string
  nextStep: string
  grounding: ChatGrounding
  citations: ChatCitation[]
}

export type GroundedChatRefusal = {
  state: "refused"
  code: "off_topic" | "unsafe"
  message: string
  nextStep: string
}

export type GroundedChatCooldown = {
  state: "cooldown"
  code: "rate_limited" | "abuse_cooldown"
  message: string
  nextStep: string
  retryAfterSeconds: number
}

export type GroundedChatFallback = {
  state: "fallback"
  message: string
  nextStep: string
  suggestedPrompts: string[]
  fallbackSource?: {
    label: string
  }
}

export type GroundedChatSuccess =
  | GroundedChatAnswer
  | GroundedChatWeakSupport
  | GroundedChatRefusal
  | GroundedChatCooldown
  | GroundedChatFallback

export type ChatError = {
  code: string
  message: string
}

export type ChatTranscriptTurnState =
  | {
      status: "loading"
    }
  | {
      status: "success"
      response: GroundedChatSuccess
    }
  | {
      status: "error"
      error: ChatError
    }

export type ChatTranscriptTurn = {
  id: string
  question: string
  response: ChatTranscriptTurnState
}

export type GroundedChatEnvelope =
  | {
      success: true
      data: GroundedChatSuccess
      error?: never
    }
  | {
      success: false
      data?: never
      error: ChatError
    }

export type ChatAsyncState =
  | {
      status: "idle"
    }
  | ChatTranscriptTurnState
