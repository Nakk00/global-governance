import { afterEach, describe, expect, it, vi } from "vitest"

import { requestGroundedAnswer } from "./api-client"

describe("requestGroundedAnswer", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("uses the local Supabase fallback endpoint and forwards chapter context", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          state: "answered",
          answer: "Grounded answer",
          grounding: {
            supportLevel: "strong",
            cue: "Grounded with 1 approved source",
          },
          citations: [
            {
              sourceId: "gg-src-un-charter-institutions",
              title: "Charter of the United Nations",
              shortTitle: "UN Charter",
              sourceType: "primary",
              detail: "Institutional frame",
            },
          ],
        },
      }),
    })

    vi.stubGlobal("fetch", fetchMock)

    await requestGroundedAnswer("Explain the UN", {
      currentSectionId: "un-command-center",
    })

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:54321/functions/v1/chat",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Anonymous-Session-Id": expect.any(String),
        },
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
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({
          success: true,
          data: {
            state: "cooldown",
            code: "rate_limited",
            message:
              "The assistant is temporarily limited after repeated submissions.",
            nextStep: "Wait briefly, then ask a course-focused question.",
            retryAfterSeconds: 60,
          },
        }),
      })
    )

    await expect(requestGroundedAnswer("Explain the UN")).resolves.toEqual({
      state: "cooldown",
      code: "rate_limited",
      message:
        "The assistant is temporarily limited after repeated submissions.",
      nextStep: "Wait briefly, then ask a course-focused question.",
      retryAfterSeconds: 60,
    })
  })

  it("maps malformed protection payloads to the user-safe unavailable error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            state: "cooldown",
            code: "rate_limited",
            message:
              "The assistant is temporarily limited after repeated submissions.",
            nextStep: "Try again shortly.",
            retryAfterSeconds: 0,
          },
        }),
      })
    )

    await expect(requestGroundedAnswer("Explain the UN")).rejects.toMatchObject(
      {
        code: "grounded_chat_unavailable",
      }
    )
  })

  it("reuses an in-memory anonymous session id when localStorage is unavailable", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          state: "answered",
          answer: "Grounded answer",
          grounding: {
            supportLevel: "strong",
            cue: "Grounded with 1 approved source",
          },
          citations: [
            {
              sourceId: "gg-src-un-charter-institutions",
              title: "Charter of the United Nations",
              shortTitle: "UN Charter",
              sourceType: "primary",
              detail: "Institutional frame",
            },
          ],
        },
      }),
    })

    vi.stubGlobal("fetch", fetchMock)
    vi.stubGlobal("localStorage", undefined)

    await requestGroundedAnswer("Explain the UN")
    await requestGroundedAnswer("Explain the UN again")

    const firstSessionId = fetchMock.mock.calls[0]?.[1]?.headers?.[
      "X-Anonymous-Session-Id"
    ]
    const secondSessionId = fetchMock.mock.calls[1]?.[1]?.headers?.[
      "X-Anonymous-Session-Id"
    ]

    expect(firstSessionId).toBeTruthy()
    expect(secondSessionId).toBe(firstSessionId)
  })
})
