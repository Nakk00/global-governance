import type { GroundedChatRequest, GroundedChatSuccess } from "@/types/chat"

import {
  createChatRequest,
  parseGroundedChatEnvelope,
  toUserSafeChatError,
} from "./grounded-answer"

const configuredChatEndpoint = import.meta.env.VITE_CHAT_FUNCTION_URL?.trim()
const chatEndpoint =
  configuredChatEndpoint && configuredChatEndpoint.length > 0
    ? configuredChatEndpoint
    : import.meta.env.DEV
      ? "http://127.0.0.1:54321/functions/v1/chat"
      : "/functions/v1/chat"
const anonymousSessionStorageKey = "global-governance-chat-session"
let inMemoryAnonymousSessionId: string | undefined

function createAnonymousSessionId() {
  if (globalThis.crypto && "randomUUID" in globalThis.crypto) {
    return globalThis.crypto.randomUUID()
  }

  return `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function getAnonymousSessionId() {
  try {
    if (typeof globalThis.localStorage === "undefined") {
      inMemoryAnonymousSessionId ??= createAnonymousSessionId()

      return inMemoryAnonymousSessionId
    }

    const existing = globalThis.localStorage
      .getItem(anonymousSessionStorageKey)
      ?.trim()

    if (existing) {
      return existing
    }

    const nextSessionId = createAnonymousSessionId()
    globalThis.localStorage.setItem(anonymousSessionStorageKey, nextSessionId)

    return nextSessionId
  } catch {
    inMemoryAnonymousSessionId ??= createAnonymousSessionId()

    return inMemoryAnonymousSessionId
  }
}

export async function requestGroundedAnswer(
  question: string,
  context?: GroundedChatRequest["context"]
): Promise<GroundedChatSuccess> {
  const request = createChatRequest(question, context)

  try {
    const response = await fetch(chatEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Anonymous-Session-Id": getAnonymousSessionId(),
      },
      body: JSON.stringify(request),
    })
    const envelope = parseGroundedChatEnvelope(await response.json())

    if (envelope.success && envelope.data.state === "cooldown") {
      return envelope.data
    }

    if (!response.ok || !envelope.success) {
      throw new Error(
        envelope.success ? "Grounded chat request failed" : envelope.error.code
      )
    }

    return envelope.data
  } catch {
    throw toUserSafeChatError()
  }
}
