import { afterEach, describe, expect, it, vi } from "vitest"

import { requestGroundedAnswer } from "./api-client"

describe("requestGroundedAnswer", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("uses the Django public chat endpoint and forwards chapter and depth context", async () => {
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
      depthMode: "expert",
    })

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/chat",
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
            depthMode: "expert",
          },
        }),
      })
    )
  })

  it("returns typed fallback envelopes without converting them to transport errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            state: "fallback",
            message:
              "The assistant could not complete a grounded answer right now.",
            nextStep: "Continue with the lesson or try a course question.",
            suggestedPrompts: ["What is global governance?"],
            fallbackSource: {
              label: "Current lesson summary",
            },
          },
        }),
      })
    )

    await expect(requestGroundedAnswer("Explain the UN")).resolves.toMatchObject(
      {
        state: "fallback",
        suggestedPrompts: ["What is global governance?"],
      }
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

  it("maps non-cooldown HTTP failures to the safe client error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          success: true,
          data: {
            state: "refused",
            code: "off_topic",
            message: "Course boundary reached.",
            nextStep: "Ask a course question.",
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

  it("maps explicit server error envelopes to the safe client error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: false,
          error: {
            code: "invalid_request",
            message: "A question is required.",
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

    const firstSessionId =
      fetchMock.mock.calls[0]?.[1]?.headers?.["X-Anonymous-Session-Id"]
    const secondSessionId =
      fetchMock.mock.calls[1]?.[1]?.headers?.["X-Anonymous-Session-Id"]

    expect(firstSessionId).toBeTruthy()
    expect(secondSessionId).toBe(firstSessionId)
  })

  it("reuses an existing browser session id", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          state: "fallback",
          message: "Grounded answer unavailable.",
          nextStep: "Continue with the lesson.",
          suggestedPrompts: ["What is global governance?"],
        },
      }),
    })
    globalThis.localStorage.setItem(
      "global-governance-chat-session",
      "existing-session"
    )
    vi.stubGlobal("fetch", fetchMock)

    await requestGroundedAnswer("Explain the UN")

    expect(fetchMock.mock.calls[0]?.[1]?.headers).toMatchObject({
      "X-Anonymous-Session-Id": "existing-session",
    })
  })

  it("keeps repeated browser-session requests single-turn and sends only the newest learner question", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            state: "answered",
            answer: "First grounded answer",
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
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            state: "answered",
            answer: "Second grounded answer",
            grounding: {
              supportLevel: "strong",
              cue: "Grounded with 1 approved source",
            },
            citations: [
              {
                sourceId: "gg-src-south-china-sea-award",
                title: "South China Sea Arbitration Award",
                shortTitle: "SCS award",
                sourceType: "case",
                detail: "WPS case support",
              },
            ],
          },
        }),
      })
    globalThis.localStorage.setItem(
      "global-governance-chat-session",
      "continuing-session"
    )
    vi.stubGlobal("fetch", fetchMock)

    await requestGroundedAnswer("Explain the UN", {
      currentSectionId: "un-command-center",
      depthMode: "student",
    })
    await requestGroundedAnswer("Explain the ruling gap", {
      currentSectionId: "west-philippine-sea-dossier",
      depthMode: "expert",
    })

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls[0]?.[1]?.body).toBe(
      JSON.stringify({
        question: "Explain the UN",
        context: {
          currentSectionId: "un-command-center",
          depthMode: "student",
        },
      })
    )
    expect(fetchMock.mock.calls[1]?.[1]?.body).toBe(
      JSON.stringify({
        question: "Explain the ruling gap",
        context: {
          currentSectionId: "west-philippine-sea-dossier",
          depthMode: "expert",
        },
      })
    )
    expect(fetchMock.mock.calls[1]?.[1]?.body).not.toContain("Explain the UN")
  })

  it("falls back to memory when browser storage throws", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          state: "fallback",
          message: "Grounded answer unavailable.",
          nextStep: "Continue with the lesson.",
          suggestedPrompts: ["What is global governance?"],
        },
      }),
    })
    vi.stubGlobal("fetch", fetchMock)
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("blocked")
      },
      setItem: vi.fn(),
    })

    await requestGroundedAnswer("Explain the UN")

    expect(fetchMock.mock.calls[0]?.[1]?.headers).toMatchObject({
      "X-Anonymous-Session-Id": expect.any(String),
    })
  })
})
