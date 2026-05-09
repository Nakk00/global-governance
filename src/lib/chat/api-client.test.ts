import { afterEach, describe, expect, it, vi } from "vitest"

import { http, HttpResponse } from "msw"

import {
  answeredChatResponse,
  cooldownChatResponse,
} from "../../../tests/support/msw/fixtures"
import {
  localChatEndpoint,
  successEnvelope,
} from "../../../tests/support/msw/handlers"
import { server } from "../../../tests/support/msw/server"

import { requestGroundedAnswer } from "./api-client"

describe("requestGroundedAnswer", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    globalThis.localStorage?.clear?.()
  })

  it("uses the local Supabase fallback endpoint and forwards chapter context", async () => {
    let requestUrl = ""
    let requestInit: RequestInit | undefined

    server.use(
      http.post(localChatEndpoint, async ({ request }) => {
        requestUrl = request.url
        requestInit = {
          method: request.method,
          headers: Object.fromEntries(request.headers.entries()),
          body: await request.text(),
        }

        return HttpResponse.json(successEnvelope(answeredChatResponse))
      })
    )

    await requestGroundedAnswer("Explain the UN", {
      currentSectionId: "un-command-center",
    })

    expect(requestUrl).toBe(localChatEndpoint)
    expect(requestInit).toEqual(
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "content-type": "application/json",
          "x-anonymous-session-id": expect.any(String),
        }),
        body: JSON.stringify({
          question: "Explain the UN",
          context: {
            currentSectionId: "un-command-center",
          },
        }),
      })
    )
  })

  it("returns typed cooldown envelopes even when the server uses 429", async () => {
    server.use(
      http.post(localChatEndpoint, () =>
        HttpResponse.json(successEnvelope(cooldownChatResponse), {
          status: 429,
        })
      )
    )

    await expect(requestGroundedAnswer("Explain the UN")).resolves.toEqual({
      ...cooldownChatResponse,
    })
  })

  it("maps malformed protection payloads to the user-safe unavailable error", async () => {
    server.use(
      http.post(localChatEndpoint, () =>
        HttpResponse.json(
          successEnvelope({
            ...cooldownChatResponse,
            code: "rate_limited",
            message:
              "The assistant is temporarily limited after repeated submissions.",
            nextStep: "Try again shortly.",
            retryAfterSeconds: 0,
          })
        )
      )
    )

    await expect(requestGroundedAnswer("Explain the UN")).rejects.toMatchObject(
      {
        code: "grounded_chat_unavailable",
      }
    )
  })

  it("reuses an in-memory anonymous session id when localStorage is unavailable", async () => {
    const seenSessionIds: string[] = []

    server.use(
      http.post(localChatEndpoint, ({ request }) => {
        seenSessionIds.push(request.headers.get("x-anonymous-session-id") ?? "")

        return HttpResponse.json(successEnvelope(answeredChatResponse))
      })
    )
    vi.stubGlobal("localStorage", undefined)

    await requestGroundedAnswer("Explain the UN")
    await requestGroundedAnswer("Explain the UN again")

    const firstSessionId = seenSessionIds[0]
    const secondSessionId = seenSessionIds[1]

    expect(firstSessionId).toBeTruthy()
    expect(secondSessionId).toBe(firstSessionId)
  })
})
