import { describe, expect, it } from "vitest"

import {
  wpsCaseFileDefaultInteractionState,
  wpsCaseFileEvidenceCategories,
  wpsCaseFileInteractionModes,
  wpsCaseFileMapHotspots,
  wpsCaseFileRulingRealityRows,
  wpsEvidenceRegistry,
  wpsRulingRealityComparison,
  wpsTimelineEvents,
  wpsCaseFileTimelineEvents,
} from "./west-philippine-sea-dossier"
import { getDossierEvidenceSources } from "../source-bundles/approved-source-bundle"

describe("wpsTimelineEvents", () => {
  it("keeps the required case milestones in chronological source order", () => {
    expect(wpsTimelineEvents.map((event) => event.label)).toEqual([
      "Scarborough Shoal incident",
      "Arbitration filing",
      "Tribunal ruling",
      "Enforcement limits",
    ])

    expect(wpsTimelineEvents.map((event) => event.year)).toEqual([
      "2012",
      "2013",
      "2016",
      "Post-2016",
    ])
  })

  it("keeps every timeline event compact and evidence-led", () => {
    for (const event of wpsTimelineEvents) {
      expect(event.id).toMatch(/^[a-z0-9-]+$/)
      expect(event.summary.length).toBeLessThanOrEqual(140)
      expect(event.context).toEqual(expect.any(String))
      expect(event.legalContext).toEqual(expect.any(String))
      expect(event.significance).toEqual(expect.any(String))
      expect(event.context.length).toBeGreaterThan(40)
      expect(event.legalContext.length).toBeGreaterThan(40)
      expect(event.significance.length).toBeGreaterThan(40)
    }
  })

  it("includes the post-ruling gap between legal clarity and enforcement", () => {
    const enforcement = wpsTimelineEvents.find(
      (event) => event.id === "enforcement-limits"
    )

    expect(enforcement).toBeDefined()
    expect(enforcement?.legalContext).toMatch(/compliance|collective pressure/i)
    expect(enforcement?.significance).toMatch(/law|enforcement|power/i)
  })
})

describe("wpsCaseFileInteractionModel", () => {
  it("keeps interaction defaults aligned with existing runtime records", () => {
    const eventIds = wpsCaseFileTimelineEvents.map((event) => event.id)
    const evidenceIds = wpsCaseFileEvidenceCategories.map(
      (category) => category.id
    )
    const hotspotIds = wpsCaseFileMapHotspots.map((hotspot) => hotspot.id)
    const comparisonRowIds = wpsCaseFileRulingRealityRows.map((row) => row.id)

    expect(wpsCaseFileInteractionModes).toHaveLength(2)
    expect(wpsCaseFileDefaultInteractionState.modeId).toBe("evidence-file")

    for (const mode of wpsCaseFileInteractionModes) {
      expect(mode.id).toMatch(/^(evidence-file|law-power)$/)
      expect(mode.title.length).toBeGreaterThan(8)
      expect(mode.detail.length).toBeGreaterThan(40)
      expect(eventIds).toContain(mode.defaultEventId)
      expect(evidenceIds).toContain(mode.defaultEvidenceId)
      expect(hotspotIds).toContain(mode.defaultHotspotId)
      expect(comparisonRowIds).toContain(mode.defaultComparisonRowId)
    }
  })

  it("links every map hotspot to valid timeline, evidence, and comparison records", () => {
    const eventIds = wpsCaseFileTimelineEvents.map((event) => event.id)
    const evidenceIds = wpsCaseFileEvidenceCategories.map(
      (category) => category.id
    )
    const comparisonRowIds = wpsCaseFileRulingRealityRows.map((row) => row.id)

    expect(wpsCaseFileMapHotspots.map((hotspot) => hotspot.id)).toEqual([
      "scarborough-shoal",
      "spratly-islands",
      "palawan",
      "west-philippine-sea",
    ])

    for (const hotspot of wpsCaseFileMapHotspots) {
      expect(hotspot.summary.length).toBeGreaterThan(40)
      expect(hotspot.whyItMatters.length).toBeGreaterThan(60)
      expect(hotspot.relatedEventIds.length).toBeGreaterThan(0)
      expect(hotspot.relatedEvidenceIds.length).toBeGreaterThan(0)
      expect(hotspot.relatedComparisonRowIds.length).toBeGreaterThan(0)

      for (const eventId of hotspot.relatedEventIds) {
        expect(eventIds).toContain(eventId)
      }
      for (const evidenceId of hotspot.relatedEvidenceIds) {
        expect(evidenceIds).toContain(evidenceId)
      }
      for (const comparisonRowId of hotspot.relatedComparisonRowIds) {
        expect(comparisonRowIds).toContain(comparisonRowId)
      }
    }
  })

  it("keeps evidence and ruling rows source-linked without exposing display ids", () => {
    for (const category of wpsCaseFileEvidenceCategories) {
      expect(category.primaryFinding.length).toBeGreaterThan(40)
      expect(category.linkedStateLabel).toMatch(/Linked to/i)
      expect(category.sourceCountLabel).toMatch(/approved source record/i)
      expect(
        category.sourceIds.every((sourceId) => sourceId.startsWith("gg-src-"))
      ).toBe(true)
    }

    for (const row of wpsCaseFileRulingRealityRows) {
      expect(row.explanation).toMatch(/legal|law|rights|UNCLOS|governance/i)
      expect(row.citationLabel.length).toBeGreaterThan(10)
      expect(row.sourceIds.length).toBeGreaterThan(0)
      expect(row.relatedEventIds.length).toBeGreaterThan(0)
      expect(row.relatedEvidenceIds.length).toBeGreaterThan(0)
    }
  })
})

describe("wpsRulingRealityComparison", () => {
  it("defines a stable default state with paired ruling and reality copy", () => {
    const defaultState = wpsRulingRealityComparison.states.find(
      (state) => state.id === wpsRulingRealityComparison.defaultStateId
    )

    expect(wpsRulingRealityComparison.thesisMode).toBe("fixed-dossier-thesis")
    expect(defaultState).toBeDefined()
    expect(wpsRulingRealityComparison.ruling.summary).toMatch(
      /2016 arbitral award|UNCLOS/i
    )
    expect(wpsRulingRealityComparison.reality.summary).toMatch(
      /enforcement|compliance|state choices/i
    )
  })

  it("keeps every comparison state reviewable and governance-specific", () => {
    expect(wpsRulingRealityComparison.states.length).toBeGreaterThanOrEqual(3)

    for (const state of wpsRulingRealityComparison.states) {
      expect(state.id).toMatch(/^[a-z0-9-]+$/)
      expect(state.label.length).toBeGreaterThan(4)
      expect(state.summary.length).toBeGreaterThan(20)
      expect(state.explanation).toMatch(
        /legal|law|institution|governance|enforcement|political/i
      )
    }
  })

  it("connects the legal outcome to the enforcement gap and political reality", () => {
    const comparisonText = [
      wpsRulingRealityComparison.ruling.summary,
      wpsRulingRealityComparison.ruling.detail,
      wpsRulingRealityComparison.reality.summary,
      wpsRulingRealityComparison.reality.detail,
      ...wpsRulingRealityComparison.states.flatMap((state) => [
        state.summary,
        state.explanation,
      ]),
    ].join(" ")

    expect(comparisonText).toMatch(/legal clarity|legal ruling|legal outcome/i)
    expect(comparisonText).toMatch(/enforcement gap|enforcement|compliance/i)
    expect(comparisonText).toMatch(/political reality|power|political will/i)
    expect(comparisonText).toMatch(/governance lesson/i)
  })
})

describe("wpsEvidenceRegistry", () => {
  it("maps evidence entries to every timeline event and comparison state", () => {
    expect(Object.keys(wpsEvidenceRegistry.timeline).sort()).toEqual(
      wpsTimelineEvents.map((event) => event.id).sort()
    )
    expect(Object.keys(wpsEvidenceRegistry.comparison).sort()).toEqual(
      wpsRulingRealityComparison.states.map((state) => state.id).sort()
    )
  })

  it("keeps source ids, labels, metadata, summaries, and why-it-matters notes stable", () => {
    const evidenceItems = [
      ...Object.values(wpsEvidenceRegistry.timeline).flat(),
      ...Object.values(wpsEvidenceRegistry.comparison).flat(),
    ]
    const bundleEvidenceIds = getDossierEvidenceSources().map(
      (source) => source.sourceId
    )

    expect(evidenceItems.map((item) => item.sourceId).sort()).toEqual(
      [...bundleEvidenceIds].sort()
    )

    for (const item of evidenceItems) {
      expect(item.sourceId).toMatch(/^gg-src-[a-z0-9-]+$/)
      expect(item.sourceLabel.length).toBeGreaterThan(12)
      expect(item.summary.length).toBeGreaterThan(40)
      expect(item.metadata.length).toBeGreaterThan(20)
      expect(item.whyItMatters.length).toBeGreaterThan(40)
    }
  })

  it("includes a typed empty-state path without removing the selected context key", () => {
    expect(wpsEvidenceRegistry.comparison["governance-lesson"]).toEqual([])
  })

  it("keeps evidence copy supportive without duplicating timeline or comparison prose", () => {
    for (const event of wpsTimelineEvents) {
      const evidenceItems = wpsEvidenceRegistry.timeline[event.id]

      for (const item of evidenceItems) {
        expect(item.summary).not.toBe(event.summary)
        expect(item.summary).not.toBe(event.context)
        expect(item.summary).not.toBe(event.legalContext)
        expect(item.summary).not.toBe(event.significance)
        expect(item.whyItMatters).not.toBe(event.significance)
      }
    }

    for (const state of wpsRulingRealityComparison.states) {
      const evidenceItems = wpsEvidenceRegistry.comparison[state.id]

      for (const item of evidenceItems) {
        expect(item.summary).not.toBe(state.summary)
        expect(item.summary).not.toBe(state.explanation)
        expect(item.whyItMatters).not.toBe(state.explanation)
      }
    }
  })
})
