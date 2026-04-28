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
      },
      body: JSON.stringify(request),
    })
    const envelope = parseGroundedChatEnvelope(await response.json())

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
