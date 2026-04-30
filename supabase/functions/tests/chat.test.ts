import { describe, expect, it } from "vitest"

import {
  assembleGroundedChatResponse,
  createCooldownChatResponse,
  createRefusedChatResponse,
  retrieveApprovedSources,
} from "../_shared/chat-grounding"
import {
  createMemoryProtectionStore,
  evaluateChatProtection,
  resetProtectionStore,
} from "../_shared/chat-protection"

describe("chat grounding edge helpers", () => {
  it("packages approved-source answers with citation metadata", () => {
    const sources = retrieveApprovedSources(
      "How does the UN coordinate global governance?"
    )
    const response = assembleGroundedChatResponse({
      question: "How does the UN coordinate global governance?",
      sources,
    })

    expect(response.success).toBe(true)
    expect(response.data.state).toBe("answered")
    if (response.data.state !== "answered") {
      throw new Error("Expected answered state")
    }

    expect(response.data.answer).toContain("approved course materials")
    expect(response.data.citations.map((source) => source.sourceId)).toContain(
      "gg-src-un-charter-institutions"
    )
  })

  it("resolves the source-check prompt to inspectable approved sources", () => {
    const sources = retrieveApprovedSources(
      "Which approved sources should I inspect before making a claim about this chapter?"
    )
    const response = assembleGroundedChatResponse({
      question:
        "Which approved sources should I inspect before making a claim about this chapter?",
      sources,
    })

    expect(response.success).toBe(true)
    expect(response.data.state).toBe("answered")
    if (response.data.state !== "answered") {
      throw new Error("Expected answered state")
    }

    expect(response.data.citations).toHaveLength(3)
  })

  it("keeps source lookup aligned to the active chapter context", () => {
    const sources = retrieveApprovedSources(
      "How does the UN coordinate global governance?",
      {
        currentSectionId: "west-philippine-sea-dossier",
      }
    )
    const response = assembleGroundedChatResponse({
      question: "How does the UN coordinate global governance?",
      sources,
      context: {
        currentSectionId: "west-philippine-sea-dossier",
      },
    })

    expect(response.success).toBe(true)
    expect(response.data.state).toBe("weakSupport")
  })

  it("supports the intro sections with mapped course-frame sources", () => {
    const sources = retrieveApprovedSources(
      "How do institutions coordinate global governance without becoming a world government?",
      {
        currentSectionId: "hero-narrative-frame",
      }
    )
    const response = assembleGroundedChatResponse({
      question:
        "How do institutions coordinate global governance without becoming a world government?",
      sources,
      context: {
        currentSectionId: "hero-narrative-frame",
      },
    })

    expect(response.success).toBe(true)
    expect(response.data.state).toBe("answered")
  })

  it("returns weak support instead of speculative answer copy", () => {
    const sources = retrieveApprovedSources(
      "What should tomorrow's Security Council vote be?",
      {
        currentSectionId: "un-command-center",
      }
    )
    const response = assembleGroundedChatResponse({
      question: "What should tomorrow's Security Council vote be?",
      sources,
      context: {
        currentSectionId: "un-command-center",
      },
    })

    expect(response.success).toBe(true)
    expect(response.data.state).toBe("weakSupport")
    if (response.data.state !== "weakSupport") {
      throw new Error("Expected weak support")
    }

    expect(response.data.message).toMatch(/do not support a confident answer/i)
    expect(response.data.citations).toEqual([])
  })

  it("packages off-topic refusal without citations", () => {
    const response = createRefusedChatResponse()

    expect(response.success).toBe(true)
    expect(response.data.state).toBe("refused")
    if (response.data.state !== "refused") {
      throw new Error("Expected refused state")
    }

    expect(response.data.code).toBe("off_topic")
    expect(response.data.message).toMatch(/Global Governance course/i)
    expect("citations" in response.data).toBe(false)
  })

  it("enforces 10 submissions per 60-second public chat window", async () => {
    const store = createMemoryProtectionStore()

    for (let index = 0; index < 10; index += 1) {
      expect(
        (await evaluateChatProtection({
          sessionId: "window-session",
          question: "How does the UN coordinate global governance?",
          now: 1_000 + index,
          store,
        })).state
      ).toBe("allowed")
    }

    const limited = await evaluateChatProtection({
      sessionId: "window-session",
      question: "How does the UN coordinate global governance?",
      now: 2_000,
      store,
    })

    expect(limited.state).toBe("cooldown")
    if (limited.state !== "cooldown") {
      throw new Error("Expected cooldown")
    }
    expect(limited.code).toBe("rate_limited")
    expect(limited.retryAfterSeconds).toBeGreaterThan(0)
  })

  it("starts a 60-second cooldown after 3 consecutive off-topic prompts and resets after on-topic work", async () => {
    const store = createMemoryProtectionStore()

    expect(
      await evaluateChatProtection({
        sessionId: "abuse-session",
        question: "Can you write a cooking recipe?",
        now: 1_000,
        store,
      })
    ).toMatchObject({ state: "refused", consecutiveAbuseCount: 1 })
    expect(
      await evaluateChatProtection({
        sessionId: "abuse-session",
        question: "Can you predict basketball scores?",
        now: 2_000,
        store,
      })
    ).toMatchObject({ state: "refused", consecutiveAbuseCount: 2 })

    const cooldown = await evaluateChatProtection({
      sessionId: "abuse-session",
      question: "Help me buy a phone.",
      now: 3_000,
      store,
    })

    expect(cooldown).toMatchObject({
      state: "cooldown",
      code: "abuse_cooldown",
      retryAfterSeconds: 60,
    })

    expect(
      (
        await evaluateChatProtection({
          sessionId: "abuse-session",
          question: "How does the UN coordinate global governance?",
          now: 4_000,
          store,
        })
      ).state
    ).toBe("cooldown")

    expect(
      (
        await evaluateChatProtection({
          sessionId: "abuse-session",
          question: "How does the UN coordinate global governance?",
          now: 64_000,
          store,
        })
      ).state
    ).toBe("allowed")
  })

  it("formats typed cooldown responses for the standard chat envelope", () => {
    const response = createCooldownChatResponse({
      code: "rate_limited",
      retryAfterSeconds: 42,
    })

    expect(response.success).toBe(true)
    expect(response.data.state).toBe("cooldown")
    if (response.data.state !== "cooldown") {
      throw new Error("Expected cooldown")
    }
    expect(response.data.retryAfterSeconds).toBe(42)
  })

  it("can reset protection counters for local tests", async () => {
    const store = createMemoryProtectionStore()
    await evaluateChatProtection({
      sessionId: "reset-session",
      question: "Can you write a cooking recipe?",
      now: 1_000,
      store,
    })

    await resetProtectionStore(store)

    expect(
      (
        await evaluateChatProtection({
          sessionId: "reset-session",
          question: "How does the UN coordinate global governance?",
          now: 2_000,
          store,
        })
      ).state
    ).toBe("allowed")
  })

  it("uses current section context for short follow-up questions", async () => {
    const store = createMemoryProtectionStore()

    await expect(
      evaluateChatProtection({
        sessionId: "section-follow-up",
        question: "Why does that matter here?",
        currentSectionId: "un-command-center",
        now: 1_000,
        store,
      })
    ).resolves.toMatchObject({ state: "allowed" })
  })

  it("does not treat incidental substrings as on-topic keywords", async () => {
    const store = createMemoryProtectionStore()

    await expect(
      evaluateChatProtection({
        sessionId: "substring-check",
        question: "Can you help me understand source code patterns?",
        now: 1_000,
        store,
      })
    ).resolves.toMatchObject({ state: "refused" })
  })
})
