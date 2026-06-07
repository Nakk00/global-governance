import { describe, expect, it } from "vitest"

import {
  classifyPromptAuditEnvelopeFailure,
  classifyPromptAuditOutcome,
  hasStrictPromptAuditMiss,
} from "./prompt-audit"

const primaryAuditEntry = {
  section: "global-governance-overview",
  depthMode: "student",
  id: "un-limits-answered",
  label: "UN limits",
  prompt:
    "Where does the UN help coordinate states, and where do its enforcement limits show up?",
  isPrimaryChapter: true,
  readiness: {
    classification: "answered",
    sourceIds: [
      "gg-src-un-charter-institutions",
      "gg-src-global-governance-course-frame",
    ],
  },
} as const

const supportingAuditEntry = {
  ...primaryAuditEntry,
  section: "governance-limits",
  id: "security-council-limits",
  label: "Security Council limits",
  isPrimaryChapter: false,
} as const

describe("strict prompt audit classification", () => {
  it("passes a primary prompt only when it returns a strong answered outcome with a matching citation", () => {
    const row = classifyPromptAuditOutcome(
      primaryAuditEntry,
      {
        state: "answered",
        grounding: {
          supportLevel: "strong",
        },
        citations: [
          {
            sourceId: "gg-src-un-charter-institutions",
          },
        ],
      },
      "live"
    )

    expect(row.classification).toBe("answered")
    expect(row.followUpAction).toBe("keep")
    expect(row.id).toBe("un-limits-answered")
    expect(row.label).toBe("UN limits")
    expect(row.responseState).toBe("answered")
    expect(row.supportLevel).toBe("strong")
    expect(row.returnedCitationSourceIds).toEqual([
      "gg-src-un-charter-institutions",
    ])
    expect(row.visibleCard).toBe("Grounded answer")
    expect(hasStrictPromptAuditMiss([row])).toBe(false)
  })

  it("fails weak support for primary prompts even when older diagnostic metadata would have kept it", () => {
    const row = classifyPromptAuditOutcome(
      primaryAuditEntry,
      {
        state: "weakSupport",
        nextStep: "Try narrowing the question to the current lesson topic.",
      },
      "live"
    )

    expect(row.classification).toBe("limitedSupport")
    expect(row.followUpAction).toBe("reword")
    expect(row.responseState).toBe("weakSupport")
    expect(row.supportLevel).toBe("weak")
    expect(row.visibleCard).toBe("Limited support in approved materials")
    expect(hasStrictPromptAuditMiss([row])).toBe(true)
  })

  it("fails answered outcomes that lack strong support or a matching approved citation", () => {
    const weakGroundingRow = classifyPromptAuditOutcome(
      primaryAuditEntry,
      {
        state: "answered",
        grounding: {
          supportLevel: "weak",
        },
        citations: [
          {
            sourceId: "gg-src-un-charter-institutions",
          },
        ],
      },
      "live"
    )
    const mismatchedCitationRow = classifyPromptAuditOutcome(
      primaryAuditEntry,
      {
        state: "answered",
        grounding: {
          supportLevel: "strong",
        },
        citations: [
          {
            sourceId: "gg-src-south-china-sea-award",
          },
        ],
      },
      "live"
    )

    expect(weakGroundingRow.classification).toBe("weakCitation")
    expect(mismatchedCitationRow.classification).toBe("weakCitation")
    expect(weakGroundingRow.supportLevel).toBe("weak")
    expect(mismatchedCitationRow.returnedCitationSourceIds).toEqual([
      "gg-src-south-china-sea-award",
    ])
    expect(
      hasStrictPromptAuditMiss([weakGroundingRow, mismatchedCitationRow])
    ).toBe(true)
  })

  it("fails supporting-section diagnostics in the strict visible-prompt release gate", () => {
    const supportingWeakRow = classifyPromptAuditOutcome(
      supportingAuditEntry,
      {
        state: "weakSupport",
      },
      "live"
    )
    const supportingCooldownRow = classifyPromptAuditOutcome(
      supportingAuditEntry,
      {
        state: "cooldown",
        retryAfterSeconds: "soon",
      },
      "live"
    )

    expect(supportingWeakRow.followUpAction).toBe("keep")
    expect(supportingWeakRow.notes).toMatch(/limited support/i)
    expect(supportingCooldownRow.followUpAction).toBe("keep")
    expect(supportingCooldownRow.notes).toMatch(/without a valid retry/i)
    expect(
      hasStrictPromptAuditMiss([supportingWeakRow, supportingCooldownRow])
    ).toBe(true)
  })

  it("classifies refusals, fallback responses, and envelope failures as primary misses", () => {
    const refusedRow = classifyPromptAuditOutcome(
      primaryAuditEntry,
      {
        state: "refused",
      },
      "live"
    )
    const fallbackRow = classifyPromptAuditOutcome(
      primaryAuditEntry,
      {
        state: "fallback",
      },
      "live"
    )
    const failureRow = classifyPromptAuditEnvelopeFailure(
      primaryAuditEntry,
      "live",
      "invalid_request"
    )

    expect(refusedRow.classification).toBe("boundaryRefusal")
    expect(refusedRow.visibleCard).toBe("Course boundary reached")
    expect(refusedRow.notes).toMatch(/boundary guard/i)
    expect(fallbackRow.classification).toBe("fallback")
    expect(fallbackRow.followUpAction).toBe("reword")
    expect(fallbackRow.responseState).toBe("fallback")
    expect(fallbackRow.visibleCard).toBe("Grounded answer unavailable")
    expect(failureRow.classification).toBe("transportFailure")
    expect(failureRow.responseState).toBe("envelopeFailure")
    expect(
      hasStrictPromptAuditMiss([refusedRow, fallbackRow, failureRow])
    ).toBe(true)
  })

  it("distinguishes missing source mappings and unsupported response states", () => {
    const missingSourceEntry = {
      ...primaryAuditEntry,
      readiness: {
        classification: "answered",
        sourceIds: [],
      },
    } as const
    const missingSourceRow = classifyPromptAuditOutcome(
      missingSourceEntry,
      {
        state: "fallback",
        message: "",
      },
      "live"
    )
    const unsupportedStateRow = classifyPromptAuditOutcome(
      primaryAuditEntry,
      {
        state: "",
      },
      "live"
    )

    expect(missingSourceRow.classification).toBe("fallback")
    expect(missingSourceRow.followUpAction).toBe("addApprovedSource")
    expect(missingSourceRow.notes).toMatch(/fallback instead/i)
    expect(unsupportedStateRow.classification).toBe("transportFailure")
    expect(unsupportedStateRow.notes).toMatch(/unknown/i)
  })
})
