import { describe, expect, it } from "vitest"

import {
  createChatRequest,
  parseGroundedChatEnvelope,
  toUserSafeChatError,
} from "./grounded-answer"

describe("grounded chat contract", () => {
  it("normalizes answer envelopes with stable citation details", () => {
    const parsed = parseGroundedChatEnvelope({
      success: true,
      data: {
        state: "answered",
        answer:
          "Global governance coordinates states through institutions without becoming world government.",
        grounding: {
          supportLevel: "strong",
          cue: "Grounded in approved course materials",
        },
        citations: [
          {
            sourceId: " gg-src-un-charter-institutions ",
            title: " Charter of the United Nations ",
            shortTitle: "UN Charter",
            sourceType: "primary",
            detail: "Articles 1 and 2 describe UN purposes and principles.",
            url: "https://www.un.org/en/about-us/un-charter/full-text",
          },
        ],
      },
    })

    expect(parsed.success).toBe(true)
    if (!parsed.success) {
      throw new Error("Expected successful envelope")
    }
    expect(parsed.data.state).toBe("answered")
    if (parsed.data.state !== "answered") {
      throw new Error("Expected an answered state")
    }

    expect(parsed.data.citations[0]).toMatchObject({
      sourceId: "gg-src-un-charter-institutions",
      title: "Charter of the United Nations",
      shortTitle: "UN Charter",
      sourceType: "primary",
    })
  })

  it("normalizes citation aliases to canonical approved-source ids", () => {
    const parsed = parseGroundedChatEnvelope({
      success: true,
      data: {
        state: "answered",
        answer:
          "The award clarified legal rights while enforcement still depended on state behavior.",
        grounding: {
          supportLevel: "strong",
          cue: "Grounded in approved course materials",
        },
        citations: [
          {
            sourceId: "gg-src-wps-arbitral-ruling",
            title: "South China Sea Arbitration Award",
            shortTitle: "SCS award",
            sourceType: "case",
            detail:
              "The case material connects legal clarity to political enforcement limits.",
          },
        ],
      },
    })

    expect(parsed.success).toBe(true)
    if (!parsed.success || parsed.data.state !== "answered") {
      throw new Error("Expected answered state")
    }
    expect(parsed.data.citations[0].sourceId).toBe(
      "gg-src-south-china-sea-award"
    )
  })

  it("keeps insufficient support as a typed successful weak-support state", () => {
    const parsed = parseGroundedChatEnvelope({
      success: true,
      data: {
        state: "weakSupport",
        message:
          "I can connect this to the course, but the approved materials do not support a confident answer.",
        nextStep:
          "Try asking about the UN, global governance, or the West Philippine Sea case.",
        grounding: {
          supportLevel: "weak",
          cue: "Limited support in approved materials",
        },
        citations: [],
      },
    })

    expect(parsed.success).toBe(true)
    if (!parsed.success) {
      throw new Error("Expected successful envelope")
    }
    expect(parsed.data.state).toBe("weakSupport")
    if (parsed.data.state !== "weakSupport") {
      throw new Error("Expected weak support")
    }

    expect(parsed.data.nextStep).toContain("UN")
    expect(parsed.data.citations).toEqual([])
  })

  it("keeps off-topic refusal as a typed successful state without citations", () => {
    const parsed = parseGroundedChatEnvelope({
      success: true,
      data: {
        state: "refused",
        code: "off_topic",
        message:
          "I can only help with this Global Governance course and its approved materials.",
        nextStep:
          "Rephrase the question around the UN, global governance, or the West Philippine Sea case.",
      },
    })

    expect(parsed.success).toBe(true)
    if (!parsed.success) {
      throw new Error("Expected successful envelope")
    }
    expect(parsed.data.state).toBe("refused")
    if (parsed.data.state !== "refused") {
      throw new Error("Expected refusal")
    }

    expect(parsed.data.code).toBe("off_topic")
    expect(parsed.data.nextStep).toMatch(/rephrase/i)
    expect("citations" in parsed.data).toBe(false)
  })

  it("accepts unsafe refusal as a typed successful state", () => {
    const parsed = parseGroundedChatEnvelope({
      success: true,
      data: {
        state: "refused",
        code: "unsafe",
        message: "I cannot help with that request.",
        nextStep: "Try a course-focused question.",
      },
    })

    expect(parsed.success).toBe(true)
    if (!parsed.success || parsed.data.state !== "refused") {
      throw new Error("Expected refusal")
    }
    expect(parsed.data.code).toBe("unsafe")
  })

  it("keeps cooldown as a typed successful state with retry guidance", () => {
    const parsed = parseGroundedChatEnvelope({
      success: true,
      data: {
        state: "cooldown",
        code: "abuse_cooldown",
        message:
          "The assistant is temporarily limited after repeated boundary triggers.",
        nextStep: "Wait briefly, then ask a course-focused question.",
        retryAfterSeconds: 60,
      },
    })

    expect(parsed.success).toBe(true)
    if (!parsed.success) {
      throw new Error("Expected successful envelope")
    }
    expect(parsed.data.state).toBe("cooldown")
    if (parsed.data.state !== "cooldown") {
      throw new Error("Expected cooldown")
    }

    expect(parsed.data.retryAfterSeconds).toBe(60)
    expect(parsed.data.nextStep).toMatch(/course-focused/i)
  })

  it("keeps lesson fallback as a strict typed successful state", () => {
    const parsed = parseGroundedChatEnvelope({
      success: true,
      data: {
        state: "fallback",
        message: "The assistant could not complete a grounded answer right now.",
        nextStep: "Continue with the lesson or try a course question.",
        suggestedPrompts: [
          "What is global governance?",
          "Why is the UN important?",
        ],
        fallbackSource: {
          label: "Current lesson summary",
        },
      },
    })

    expect(parsed.success).toBe(true)
    if (!parsed.success || parsed.data.state !== "fallback") {
      throw new Error("Expected fallback")
    }

    expect(parsed.data.suggestedPrompts).toHaveLength(2)
    expect(parsed.data.fallbackSource?.label).toBe("Current lesson summary")
  })

  it("accepts fallback without an optional source label", () => {
    const parsed = parseGroundedChatEnvelope({
      success: true,
      data: {
        state: "fallback",
        message: "Grounded answer unavailable.",
        nextStep: "Continue with the lesson.",
        suggestedPrompts: ["What is global governance?"],
      },
    })

    expect(parsed.success).toBe(true)
    if (!parsed.success || parsed.data.state !== "fallback") {
      throw new Error("Expected fallback")
    }
    expect(parsed.data.fallbackSource).toBeUndefined()
  })

  it("rejects malformed response shapes before React state commits them", () => {
    expect(() =>
      parseGroundedChatEnvelope({
        success: true,
        data: {
          state: "answered",
          answer: "Unsupported answer without citations",
          grounding: {
            supportLevel: "strong",
            cue: "Grounded",
          },
          citations: [],
        },
      })
    ).toThrow(/citation/i)
  })

  it("rejects malformed protection payloads before React state commits them", () => {
    expect(() =>
      parseGroundedChatEnvelope({
        success: true,
        data: {
          state: "cooldown",
          code: "rate_limited",
          message:
            "The assistant is temporarily limited after repeated submissions.",
          nextStep: "Try again shortly.",
          retryAfterSeconds: 0,
        },
      })
    ).toThrow(/retry/i)
  })

  it("formats requests without privileged retrieval details", () => {
    expect(
      createChatRequest(" Explain global governance ", {
        currentSectionId: "governance-limits",
        depthMode: "expert",
      })
    ).toEqual({
      question: "Explain global governance",
      context: {
        currentSectionId: "governance-limits",
        depthMode: "expert",
      },
    })
  })

  it("rejects empty questions before creating requests", () => {
    expect(() => createChatRequest("   ")).toThrow(/required/i)
  })

  it.each([
    "not a url",
    "ftp://example.test/source",
    "https://user:password@example.test/source",
    "http://localhost/source",
    "http://10.0.0.4/source",
    "http://172.16.0.4/source",
    "http://192.168.0.4/source",
    "http://127.0.0.1:54321/storage/v1/object/private/source.pdf",
  ])("rejects unsafe citation URL %s", (url) => {
    expect(() =>
      parseGroundedChatEnvelope({
        success: true,
        data: {
          state: "answered",
          answer: "Grounded answer.",
          grounding: {
            supportLevel: "strong",
            cue: "Grounded answer",
          },
          citations: [
            {
              sourceId: "gg-src-un-charter-institutions",
              title: "Charter of the United Nations",
              shortTitle: "UN Charter",
              sourceType: "primary",
              detail: "Institutional frame",
              url,
            },
          ],
        },
      })
    ).toThrow(/url/i)
  })

  it("parses explicit error envelopes and rejects missing success flags", () => {
    expect(
      parseGroundedChatEnvelope({
        success: false,
        error: {
          code: "invalid_request",
          message: "A question is required.",
        },
      })
    ).toEqual({
      success: false,
      error: {
        code: "invalid_request",
        message: "A question is required.",
      },
    })

    expect(() =>
      parseGroundedChatEnvelope({
        data: {},
      })
    ).toThrow(/envelope/i)
  })

  it("maps transport and validation failures to user-safe copy", () => {
    expect(toUserSafeChatError().message).toBe(
      "The assistant could not return a grounded answer right now. Please try again with a course question."
    )
  })
})
