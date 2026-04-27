import { describe, expect, it } from "vitest"

import {
  wpsRulingRealityComparison,
  wpsTimelineEvents,
} from "./west-philippine-sea-dossier"

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
