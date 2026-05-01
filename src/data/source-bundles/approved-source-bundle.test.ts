import { describe, expect, it } from "vitest"

import {
  activeApprovedSourceBundle,
  getApprovedSource,
  getChatCitationSources,
  getConclusionReferenceSources,
  getDossierEvidenceSources,
  resolveApprovedSourceId,
} from "./approved-source-bundle"

describe("activeApprovedSourceBundle", () => {
  it("defines one versioned active approved-source snapshot", () => {
    expect(activeApprovedSourceBundle.bundleId).toBe(
      "global-governance-approved-sources"
    )
    expect(activeApprovedSourceBundle.bundleVersion).toMatch(
      /^\d{4}\.\d{2}\.\d{2}$/
    )
    expect(activeApprovedSourceBundle.status).toBe("active")
    expect(activeApprovedSourceBundle.sources).toHaveLength(9)
  })

  it("keeps source ids deterministic, unique, and ordered for git review", () => {
    const sourceIds = activeApprovedSourceBundle.sources.map(
      (source) => source.sourceId
    )

    expect(sourceIds).toEqual([...sourceIds].sort())
    expect(new Set(sourceIds).size).toBe(sourceIds.length)
    expect(activeApprovedSourceBundle.ordering).toBe("sourceId-ascending")
  })

  it("documents repo-managed lifecycle, alias, and version bump rules", () => {
    const { reviewContract } = activeApprovedSourceBundle

    expect(reviewContract.repoManaged).toBe(true)
    expect(reviewContract.publicMaintainerDashboard).toBe(false)
    expect(reviewContract.idImmutability).toMatch(/contract identifiers/i)
    expect(reviewContract.aliasBehavior).toMatch(/canonical active source/i)
    expect(reviewContract.deprecationHandling).toMatch(/replacementSourceId/i)
    expect(reviewContract.versionBumpRules).toHaveLength(3)
    expect(reviewContract.diffReviewPath).toMatch(/git/i)
  })

  it("resolves legacy ids through explicit aliases and rejects unknown ids", () => {
    expect(resolveApprovedSourceId("gg-src-wps-arbitral-ruling")).toBe(
      "gg-src-south-china-sea-award"
    )
    expect(resolveApprovedSourceId("wps-src-2016-tribunal-award")).toBe(
      "gg-src-south-china-sea-award"
    )
    expect(getApprovedSource("wps-src-2012-scarborough").sourceId).toBe(
      "gg-src-scarborough-standoff-record"
    )
    expect(() => resolveApprovedSourceId("unsupported-source")).toThrow(
      /unknown approved source id/i
    )
  })

  it("covers presentation, chat, evidence, and later ingestion boundaries", () => {
    const scopes = new Set(
      activeApprovedSourceBundle.sources.flatMap((source) => source.usageScope)
    )

    expect(scopes).toEqual(
      new Set(["presentation", "chat", "evidence", "ingestion"])
    )
    expect(
      activeApprovedSourceBundle.sources.every(
        (source) => source.ingestion.status === "ready-for-later-preparation"
      )
    ).toBe(true)
    expect(activeApprovedSourceBundle.reviewContract.ingestionBoundary).toMatch(
      /Story 5\.2/i
    )
  })

  it("exposes typed adapters for every current consumer surface", () => {
    expect(
      getConclusionReferenceSources().map((source) => source.sourceId)
    ).toEqual([
      "gg-src-un-charter-institutions",
      "gg-src-south-china-sea-award",
      "gg-src-sustainable-development-report",
    ])
    expect(getChatCitationSources().map((source) => source.sourceId)).toEqual([
      "gg-src-global-governance-course-frame",
      "gg-src-south-china-sea-award",
      "gg-src-un-charter-institutions",
    ])
    expect(getDossierEvidenceSources()).toHaveLength(6)
  })
})
