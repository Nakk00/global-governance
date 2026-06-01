import { describe, expect, it } from "vitest"

import {
  coreNarrativeSections,
  resolveNarrativeRecapCue,
} from "@/data/sections/core-narrative"

describe("resolveNarrativeRecapCue", () => {
  it("keeps valid recap cues aligned with the canonical narrative order", () => {
    const cues = coreNarrativeSections.map((section) =>
      resolveNarrativeRecapCue(section)
    )

    expect(cues.map((cue) => cue.nextStep?.targetId)).toEqual([
      "un-command-center",
      "governance-limits",
      "west-philippine-sea-dossier",
      "conclusion-references",
      "hero-narrative-frame",
    ])
  })

  it("falls back to a non-interactive takeaway when target metadata is stale", () => {
    const [section] = coreNarrativeSections

    const cue = resolveNarrativeRecapCue({
      ...section,
      recap: {
        takeaway: section.synthesis,
        nextStepLabel: "Continue somewhere stale",
        nextStepTargetId: "not-a-real-section",
      },
    })

    expect(cue.takeaway).toBe(section.synthesis)
    expect(cue.nextStep).toBeUndefined()
  })
})
