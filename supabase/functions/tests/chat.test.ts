import { describe, expect, it } from "vitest"

import {
  assembleGroundedChatResponse,
  retrieveApprovedSources,
} from "../_shared/chat-grounding"

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
})
