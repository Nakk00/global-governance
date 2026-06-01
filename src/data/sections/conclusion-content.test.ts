import { describe, expect, it } from "vitest"

import {
  conclusionContent,
  hasCompleteConclusionReferences,
} from "./conclusion-content"
import { getConclusionReferenceSources } from "../source-bundles/approved-source-bundle"
import type { NarrativeReferenceSource } from "./narrative-types"

const [referenceDisclosure] = conclusionContent.disclosures

describe("conclusionContent", () => {
  it("keeps the final chapter summary-first with references before recap", () => {
    expect(conclusionContent.summary).toMatch(
      /global governance is not world government/i
    )
    expect(conclusionContent.supportingDetails.join(" ")).not.toMatch(
      /landing point for later source work|placeholder/i
    )
    expect(referenceDisclosure.title).toBe("Inspect the sources")
    expect(conclusionContent.recap?.nextStepTargetId).toBe(
      "hero-narrative-frame"
    )
  })

  it("models at least three approved references with stable source metadata", () => {
    const references = referenceDisclosure.references ?? []

    expect(references).toEqual(getConclusionReferenceSources())
    expect(references.map((source) => source.sourceId)).toEqual([
      "gg-src-un-charter-institutions",
      "gg-src-south-china-sea-award",
      "gg-src-sustainable-development-report",
    ])

    for (const source of references) {
      expect(source.sourceId).toMatch(/^gg-src-[a-z0-9-]+$/)
      expect(source.title.length).toBeGreaterThan(16)
      expect(source.provenance.length).toBeGreaterThan(16)
      expect(source.summary.length).toBeGreaterThan(40)
      expect(source.whyItMatters.length).toBeGreaterThan(40)
    }
  })

  it("keeps source support inspectable without becoming a document dump", () => {
    const references = referenceDisclosure.references ?? []

    expect(referenceDisclosure.collapsedSummary).toMatch(/three approved/i)
    expect(referenceDisclosure.details.join(" ")).toMatch(/thesis/i)

    for (const source of references) {
      expect(source.summary.length).toBeLessThanOrEqual(220)
      expect(source.whyItMatters.length).toBeLessThanOrEqual(220)
    }
  })

  it("defines a calm unavailable state for missing or incomplete source data", () => {
    const incompleteReference: NarrativeReferenceSource = {
      ...referenceDisclosure.references![0],
      whyItMatters: "",
    }

    expect(referenceDisclosure.unavailableMessage).toMatch(
      /source support is temporarily unavailable/i
    )
    expect(hasCompleteConclusionReferences(referenceDisclosure)).toBe(true)
    expect(
      hasCompleteConclusionReferences({
        ...referenceDisclosure,
        references: [],
      })
    ).toBe(false)
    expect(
      hasCompleteConclusionReferences({
        ...referenceDisclosure,
        references: [incompleteReference],
      })
    ).toBe(false)
  })
})
