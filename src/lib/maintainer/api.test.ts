import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  fetchStewardshipDashboard,
  type StewardshipDashboard,
} from "./source-api"
import { fetchStewardshipDashboard as fetchStewardshipDashboardCompat } from "./api"
import { MaintainerApiError } from "./envelope"
import {
  clearSupabaseSession,
  type SupabaseSession,
} from "@/lib/supabase/browser-client"

vi.mock("@/lib/supabase/browser-client", () => ({
  clearSupabaseSession: vi.fn(),
}))

const session = {
  accessToken: "maintainer-token",
} as SupabaseSession

const dashboard = {
  overview: {
    sourceCount: 1,
    activeSourceCount: 1,
    draftSourceCount: 0,
    partialSourceCount: 0,
    latestIngestionStatus: "succeeded",
    latestValidationStatus: "succeeded",
    readinessState: "ready",
  },
  monitoring: {
    readiness: {
      label: "Readiness",
      value: "1/1 active",
      tone: "good",
      detail: "Active approved sources ready for learner-facing grounding.",
    },
    blockers: {
      label: "Blockers",
      value: "0",
      tone: "good",
      detail:
        "Draft, partial, or failed validation items needing maintainer attention.",
    },
    validationHealth: {
      label: "Validation health",
      value: "Succeeded",
      tone: "good",
      detail: "0 warning and 0 failed source validation signals.",
    },
    nextActions: [],
  },
  auditTrail: {
    totalEvents: 1,
    latestOutcome: "succeeded",
    latestEventAt: "2026-05-10T00:00:00Z",
    recentEvents: [
      {
        eventId: "audit-1",
        sourceId: "gg-src-un-charter-institutions",
        eventType: "ingest",
        origin: "admin@example.test",
        occurredAt: "2026-05-10T00:00:00Z",
        outcome: "succeeded",
        summary: "Protected ingest completed.",
      },
    ],
  },
  chatbotTrust: {
    state: "ready",
    groundedSourceCount: 1,
    validationRunCount: 1,
    latestValidationStatus: "succeeded",
    warningCount: 0,
    failedCount: 0,
    evidence: [
      {
        label: "Grounded sources",
        value: "1",
        tone: "good",
        detail:
          "Active chat-scoped sources with successful ingestion evidence.",
      },
    ],
  },
  sources: [
    {
      sourceId: "gg-src-un-charter-institutions",
      title: "Charter of the United Nations",
      sourceType: "primary",
      lifecycleState: "active",
      createdAt: "2026-05-10T00:00:00Z",
      updatedAt: "2026-05-11T00:00:00Z",
      aliases: ["un-charter"],
      usageScope: ["chat", "ingestion"],
      provenance: "Foundational UN treaty",
      ingestionReadiness: "ready",
      latestValidationOutcome: "succeeded",
      latestIngestJob: null,
      partialData: [],
    },
  ],
  ingestionRuns: [],
  validationRuns: [],
  auditEvents: [],
} satisfies StewardshipDashboard

describe("maintainer API", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("loads the richer stewardship dashboard contract", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          success: true,
          data: dashboard,
          error: null,
          meta: {},
        }),
        { status: 200 }
      )
    )

    await expect(fetchStewardshipDashboard(session)).resolves.toMatchObject({
      monitoring: { blockers: { label: "Blockers" } },
      auditTrail: { totalEvents: 1 },
      chatbotTrust: { groundedSourceCount: 1 },
      sources: [
        {
          createdAt: "2026-05-10T00:00:00Z",
          updatedAt: "2026-05-11T00:00:00Z",
        },
      ],
    })
  })

  it("clears the local session when the maintainer boundary rejects auth", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          success: false,
          data: null,
          error: {
            code: "admin_maintainer_unauthorized",
            message: "The authenticated user is not authorized.",
            status: 403,
          },
          meta: {},
        }),
        { status: 403 }
      )
    )

    await expect(fetchStewardshipDashboard(session)).rejects.toBeInstanceOf(
      MaintainerApiError
    )
    expect(clearSupabaseSession).toHaveBeenCalled()
  })

  it("keeps the compatibility barrel wired to the source API module", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          success: true,
          data: dashboard,
          error: null,
          meta: {},
        }),
        { status: 200 }
      )
    )

    await expect(
      fetchStewardshipDashboardCompat(session)
    ).resolves.toMatchObject({
      monitoring: { blockers: { label: "Blockers" } },
      auditTrail: { totalEvents: 1 },
      chatbotTrust: { groundedSourceCount: 1 },
    })
  })
})
