import { describe, expect, it } from "vitest"

import { wpsTimelineEvents } from "./west-philippine-sea-dossier"

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
