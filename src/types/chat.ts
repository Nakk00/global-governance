export type ChatSourceType = "primary" | "course" | "case" | "reference"

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

export type GroundedChatDeferredProtection = {
  state: "deferredProtection"
  message: string
}

export type GroundedChatSuccess =
  | GroundedChatAnswer
  | GroundedChatWeakSupport
  | GroundedChatDeferredProtection

export type ChatError = {
  code: string
  message: string
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
  | {
      status: "loading"
      question: string
    }
  | {
      status: "success"
      response: GroundedChatSuccess
    }
  | {
      status: "error"
      error: ChatError
    }
