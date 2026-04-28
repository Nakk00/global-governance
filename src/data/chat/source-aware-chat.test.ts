import { describe, expect, it } from "vitest"

import {
  getSourceAwareChatStarterPrompts,
  resolveStarterPromptState,
  sourceAwareChatStarterPrompts,
} from "./source-aware-chat"

describe("source-aware chat starter prompts", () => {
  it("provides a fixed course-language starter set", () => {
    const promptState = resolveStarterPromptState(sourceAwareChatStarterPrompts)

    expect(promptState.status).toBe("available")
    if (promptState.status !== "available") {
      throw new Error("Expected starter prompts to be available")
    }

    expect(promptState.prompts).toHaveLength(4)
    expect(promptState.prompts.map((prompt) => prompt.id)).toEqual([
      "governance-vs-government",
      "un-limits",
      "wps-ruling-reality",
      "source-check",
    ])
    expect(promptState.prompts[0].prompt).toContain("global governance")
  })

  it("returns a calm fallback for missing, partial, or malformed data", () => {
    expect(resolveStarterPromptState(undefined).status).toBe("fallback")
    expect(resolveStarterPromptState([]).status).toBe("fallback")
    expect(
      resolveStarterPromptState([
        {
          id: "partial",
          label: "Partial",
          prompt: "",
        },
      ]).status
    ).toBe("fallback")
    expect(resolveStarterPromptState("not prompts").status).toBe("fallback")
  })

  it("returns chapter-safe prompts for constrained sections", () => {
    const heroPrompts = getSourceAwareChatStarterPrompts("hero-narrative-frame")
    const limitsPrompts = getSourceAwareChatStarterPrompts("governance-limits")

    expect(heroPrompts).toHaveLength(4)
    expect(heroPrompts.map((prompt) => prompt.id)).toContain(
      "un-coordination-role"
    )
    expect(heroPrompts.map((prompt) => prompt.id)).not.toContain("un-limits")

    expect(limitsPrompts).toHaveLength(4)
    expect(limitsPrompts.map((prompt) => prompt.id)).toContain(
      "security-council-limits"
    )
  })
})
