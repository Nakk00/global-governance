import { describe, expect, it } from "vitest"

import { chapterNavigation } from "../navigation"
import {
  getSourceAwareChatStarterPrompts,
  getSourceAwareChatStarterPromptAuditEntries,
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

    expect(promptState.prompts).toHaveLength(5)
    expect(promptState.prompts.map((prompt) => prompt.id)).toEqual([
      "governance-world-government-distinction",
      "un-limits-answered",
      "overview-institutions-coordination-tools",
      "governance-rules-norms",
      "world-government-absence",
    ])
    expect(promptState.prompts[0].prompt).toContain("world government")
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

  it("returns exactly five answered prompts for every primary chapter", () => {
    const primaryChapterIds = chapterNavigation.map((chapter) => chapter.id)

    expect(primaryChapterIds).toEqual([
      "hero-narrative-frame",
      "global-governance-overview",
      "un-command-center",
      "west-philippine-sea-dossier",
    ])

    for (const chapterId of primaryChapterIds) {
      const prompts = getSourceAwareChatStarterPrompts(chapterId)

      expect(prompts, chapterId).toHaveLength(5)
      expect(
        prompts.every(
          (prompt) => prompt.readiness.classification === "answered"
        ),
        chapterId
      ).toBe(true)
      expect(new Set(prompts.map((prompt) => prompt.id)).size).toBe(5)
    }
  })

  it("returns chapter-safe prompts for supporting sections without counting them as primary chapters", () => {
    const heroPrompts = getSourceAwareChatStarterPrompts("hero-narrative-frame")
    const limitsPrompts = getSourceAwareChatStarterPrompts("governance-limits")
    const defaultPrompts = getSourceAwareChatStarterPrompts()

    expect(heroPrompts).toHaveLength(5)
    expect(heroPrompts.map((prompt) => prompt.id)).toContain(
      "hero-shared-problems"
    )
    expect(heroPrompts.map((prompt) => prompt.id)).not.toContain(
      "un-limits-answered"
    )

    expect(limitsPrompts).toHaveLength(2)
    expect(limitsPrompts.map((prompt) => prompt.id)).toContain(
      "security-council-limits"
    )
    expect(defaultPrompts).toEqual(sourceAwareChatStarterPrompts)
  })

  it("keeps the global overview prompt rail entirely answer-ready", () => {
    const overviewPrompts = getSourceAwareChatStarterPrompts(
      "global-governance-overview"
    )

    expect(overviewPrompts.map((prompt) => prompt.id)).toContain(
      "un-limits-answered"
    )
    expect(overviewPrompts).toHaveLength(5)
    expect(
      overviewPrompts.every(
        (prompt) => prompt.readiness.classification === "answered"
      )
    ).toBe(true)
  })

  it("tags every visible primary prompt with expected source and audit-depth metadata", () => {
    const sectionIds = [
      "hero-narrative-frame",
      "global-governance-overview",
      "un-command-center",
      "west-philippine-sea-dossier",
    ] as const

    const auditInventory = sectionIds.flatMap((sectionId) =>
      getSourceAwareChatStarterPrompts(sectionId).map((prompt) => ({
        sectionId,
        prompt: prompt as {
          readiness?: {
            classification?: string
            sourceIds?: string[]
          }
        } & typeof prompt,
      }))
    )

    expect(auditInventory).not.toHaveLength(0)

    for (const { prompt } of auditInventory) {
      expect(prompt.readiness?.classification).toBe("answered")
      expect(prompt.readiness?.sourceIds?.length ?? 0).toBeGreaterThan(0)
      expect(prompt.auditDepthMode).toBe("student")
    }
  })

  it("exports the full visible audit inventory for the release gate", () => {
    const auditEntries = getSourceAwareChatStarterPromptAuditEntries()

    expect(auditEntries).toHaveLength(25)
    expect(auditEntries[0]).toMatchObject({
      section: "hero-narrative-frame",
      depthMode: "student",
      id: "governance-world-government-distinction",
      isPrimaryChapter: true,
    })
    expect(auditEntries.some((entry) => !entry.isPrimaryChapter)).toBe(true)
    expect(auditEntries.map((entry) => entry.id)).toContain(
      "wps-post-award-compliance"
    )
    expect(auditEntries.map((entry) => entry.id)).toContain(
      "wps-scarborough-state-behavior"
    )
    expect(
      auditEntries.every(
        (entry) =>
          entry.readiness.sourceIds.length > 0 &&
          entry.id.length > 0 &&
          entry.label.length > 0 &&
          entry.prompt.length > 0
      )
    ).toBe(true)
  })
})
