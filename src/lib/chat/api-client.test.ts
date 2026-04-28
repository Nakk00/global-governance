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
})
