import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  fetchAdminMe,
  fetchSourceDetail,
  fetchStewardshipDashboard,
  ingestSource,
  MaintainerApiError,
  mutateSourceLifecycle,
  updateSourceMetadata,
  uploadSource,
  type SourceDetail,
  type StewardshipDashboard,
} from "@/lib/maintainer/api"
import {
  clearSupabaseSession,
  getSupabaseSession,
  isSupabaseSessionExpired,
} from "@/lib/supabase/browser-client"

import { MaintainerDashboard } from "./MaintainerDashboard"

vi.mock("@/lib/maintainer/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/maintainer/api")>(
    "@/lib/maintainer/api"
  )

  return {
    ...actual,
    fetchAdminMe: vi.fn(),
    fetchSourceDetail: vi.fn(),
    fetchStewardshipDashboard: vi.fn(),
    ingestSource: vi.fn(),
    mutateSourceLifecycle: vi.fn(),
    updateSourceMetadata: vi.fn(),
    uploadSource: vi.fn(),
  }
})

vi.mock("@/lib/supabase/browser-client", () => ({
  clearSupabaseSession: vi.fn(),
  getSupabaseSession: vi.fn(),
  isSupabaseSessionExpired: vi.fn(),
  signInWithPassword: vi.fn(),
}))

const mockedFetchAdminMe = vi.mocked(fetchAdminMe)
const mockedFetchSourceDetail = vi.mocked(fetchSourceDetail)
const mockedFetchStewardshipDashboard = vi.mocked(fetchStewardshipDashboard)
const mockedIngestSource = vi.mocked(ingestSource)
const mockedMutateSourceLifecycle = vi.mocked(mutateSourceLifecycle)
const mockedUpdateSourceMetadata = vi.mocked(updateSourceMetadata)
const mockedUploadSource = vi.mocked(uploadSource)
const mockedClearSupabaseSession = vi.mocked(clearSupabaseSession)
const mockedGetSupabaseSession = vi.mocked(getSupabaseSession)
const mockedIsSupabaseSessionExpired = vi.mocked(isSupabaseSessionExpired)

const session = {
  accessToken: "maintainer-token",
  expiresAt: 1_893_456_000,
  user: { id: "user-123", email: "admin@example.test" },
}

const dashboard = {
  overview: {
    sourceCount: 2,
    activeSourceCount: 2,
    draftSourceCount: 0,
    partialSourceCount: 1,
    latestIngestionStatus: "warning",
    latestValidationStatus: "warning",
    readinessState: "partial",
  },
  sources: [
    {
      sourceId: "gg-src-un-charter-institutions",
      title: "Charter of the United Nations",
      sourceType: "primary",
      lifecycleState: "active",
      aliases: [],
      usageScope: ["presentation", "chat", "ingestion"],
      provenance:
        "Foundational UN treaty; institutional design; primary source",
      ingestionReadiness: "partial",
      latestValidationOutcome: "warning",
      latestIngestJob: null,
      partialData: [
        { field: "ingestionReadiness", reason: "No persisted document yet." },
      ],
    },
    {
      sourceId: "gg-src-south-china-sea-award",
      title: "South China Sea Arbitration Award",
      sourceType: "case",
      lifecycleState: "active",
      aliases: ["wps-src-2016-tribunal-award"],
      usageScope: ["presentation", "chat", "evidence", "ingestion"],
      provenance: "2016 UNCLOS tribunal award; legal record",
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

function detailFrom(source = dashboard.sources[0]): SourceDetail {
  return {
    ...source,
    summary:
      "Defines the UN purposes, organs, member obligations, and coordination role.",
    metadata: {},
    approvalLineage: [],
    ingestionProvenance: [],
    validationHistory: [],
    auditTrail: [],
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  mockedGetSupabaseSession.mockReturnValue(session)
  mockedIsSupabaseSessionExpired.mockReturnValue(false)
  mockedFetchAdminMe.mockResolvedValue({
    userId: "user-123",
    email: "admin@example.test",
    role: "admin",
    isActive: true,
  })
  mockedFetchStewardshipDashboard.mockResolvedValue(dashboard)
  mockedFetchSourceDetail.mockResolvedValue(detailFrom())
  mockedUploadSource.mockResolvedValue({
    source: {
      ...detailFrom(),
      sourceId: "gg-src-new-policy-note",
      title: "New Policy Note",
      lifecycleState: "draft",
      summary: "A newly uploaded policy note.",
      metadata: {},
      approvalLineage: [],
      ingestionProvenance: [],
      validationHistory: [],
      auditTrail: [],
    },
    dashboard: {
      ...dashboard,
      overview: { ...dashboard.overview, sourceCount: 3, draftSourceCount: 1 },
      sources: [
        ...dashboard.sources,
        {
          ...dashboard.sources[0],
          sourceId: "gg-src-new-policy-note",
          title: "New Policy Note",
          lifecycleState: "draft",
        },
      ],
    },
  })
  mockedUpdateSourceMetadata.mockResolvedValue({
    source: {
      ...detailFrom(),
      title: "Updated UN Charter",
      summary: "Updated summary",
      metadata: {},
      approvalLineage: [],
      ingestionProvenance: [],
      validationHistory: [],
      auditTrail: [],
    },
    dashboard,
  })
  mockedMutateSourceLifecycle.mockResolvedValue({
    source: {
      ...detailFrom(),
      lifecycleState: "disabled",
      summary: "Defines the UN purposes.",
      metadata: {},
      approvalLineage: [],
      ingestionProvenance: [],
      validationHistory: [],
      auditTrail: [],
    },
    dashboard: {
      ...dashboard,
      sources: [
        { ...dashboard.sources[0], lifecycleState: "disabled" },
        dashboard.sources[1],
      ],
    },
  })
  mockedIngestSource.mockResolvedValue({
    source: {
      ...detailFrom(),
      latestIngestJob: {
        jobId: "ingest-1",
        sourceId: dashboard.sources[0].sourceId,
        status: "queued",
        requestedAt: "2026-05-04T00:00:00Z",
        summary: "Queued.",
      },
      summary: "Defines the UN purposes.",
      metadata: {},
      approvalLineage: [],
      ingestionProvenance: [],
      validationHistory: [],
      auditTrail: [],
    },
    dashboard,
  })
})

describe("MaintainerDashboard", () => {
  it("renders the sign-in gate when no session is present", async () => {
    mockedGetSupabaseSession.mockReturnValue(null)

    render(<MaintainerDashboard />)

    expect(
      await screen.findByRole("heading", { name: "Maintainer sign in" })
    ).toBeVisible()
  })

  it.each([
    {
      name: "expired session",
      arrange: () => {
        mockedIsSupabaseSessionExpired.mockReturnValue(true)
      },
      heading: "Session expired",
    },
    {
      name: "unauthorized access",
      arrange: () => {
        mockedFetchAdminMe.mockRejectedValue(
          new MaintainerApiError(
            "admin_maintainer_unauthorized",
            403,
            "Maintainer access is required."
          )
        )
      },
      heading: "Maintainer access required",
    },
    {
      name: "inactive profile",
      arrange: () => {
        mockedFetchAdminMe.mockRejectedValue(
          new MaintainerApiError(
            "admin_maintainer_inactive",
            403,
            "The maintainer profile is inactive."
          )
        )
      },
      heading: "Maintainer profile inactive",
    },
    {
      name: "access outage",
      arrange: () => {
        mockedFetchAdminMe.mockRejectedValue(new Error("backend unavailable"))
      },
      heading: "Access check unavailable",
    },
  ])(
    "renders the $name gate state in the component layer",
    async ({ arrange, heading }) => {
      arrange()

      render(<MaintainerDashboard />)

      expect(
        await screen.findByRole("heading", { name: heading })
      ).toBeVisible()
    }
  )

  it("keeps the dashboard visible when source detail loading fails", async () => {
    mockedFetchSourceDetail.mockRejectedValue(
      new MaintainerApiError(
        "admin_verifier_unavailable",
        503,
        "The source history could not be retrieved right now."
      )
    )

    render(<MaintainerDashboard />)

    expect(
      await screen.findByRole("heading", {
        name: "Source stewardship inventory",
      })
    ).toBeVisible()
    await screen.findByRole("button", { name: "Retry dashboard load" })
    expect(
      screen.getByText("The source history could not be retrieved right now.")
    ).toBeVisible()
    expect(
      screen.getByRole("button", { name: "Retry dashboard load" })
    ).toBeVisible()
    expect(
      screen.getAllByText("Charter of the United Nations").length
    ).toBeGreaterThan(0)
  })

  it("signs out locally from the ready dashboard state", async () => {
    const user = userEvent.setup()

    render(<MaintainerDashboard />)

    const signOut = await screen.findByRole("button", { name: "Sign out" })
    await user.click(signOut)

    expect(mockedClearSupabaseSession).toHaveBeenCalled()
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Maintainer sign in" })
      ).toBeVisible()
    )
  })

  it("uploads a protected source and refreshes the persisted projection", async () => {
    const user = userEvent.setup()
    render(<MaintainerDashboard />)

    await screen.findByRole("heading", { name: "Protected source upload" })
    await user.type(
      screen.getByLabelText("Source ID"),
      "gg-src-new-policy-note"
    )
    await user.type(screen.getByLabelText("Title"), "New Policy Note")
    await user.clear(screen.getByLabelText("Provenance"))
    await user.type(screen.getByLabelText("Provenance"), "Maintainer upload")
    await user.type(
      screen.getByLabelText("Summary"),
      "A newly uploaded policy note."
    )
    await user.upload(
      screen.getByLabelText("Source file"),
      new File(["# policy"], "policy.md", { type: "text/markdown" })
    )
    await user.click(screen.getByRole("button", { name: "Upload draft" }))

    await waitFor(() => expect(mockedUploadSource).toHaveBeenCalled())
    expect(
      await screen.findByText("Source uploaded as draft and inactive.")
    ).toBeVisible()
    expect(screen.getAllByText("New Policy Note").length).toBeGreaterThan(0)
  })

  it("surfaces field recovery details for failed mutations", async () => {
    const user = userEvent.setup()
    mockedUploadSource.mockRejectedValue(
      new MaintainerApiError(
        "admin_source_validation_failed",
        400,
        "The source metadata needs attention.",
        {
          title: "Add a source title.",
        }
      )
    )

    render(<MaintainerDashboard />)

    await screen.findByRole("heading", { name: "Protected source upload" })
    await user.type(screen.getByLabelText("Source ID"), "gg-src-invalid")
    await user.type(screen.getByLabelText("Provenance"), "Maintainer upload")
    await user.type(screen.getByLabelText("Summary"), "Missing title case.")
    await user.upload(
      screen.getByLabelText("Source file"),
      new File(["# invalid"], "invalid.md", { type: "text/markdown" })
    )
    await user.click(screen.getByRole("button", { name: "Upload draft" }))

    expect(await screen.findByText("title: Add a source title.")).toBeVisible()
  })

  it("shows a local file error before attempting upload", async () => {
    const user = userEvent.setup()

    render(<MaintainerDashboard />)

    await screen.findByRole("heading", { name: "Protected source upload" })
    await user.type(screen.getByLabelText("Source ID"), "gg-src-no-file")
    await user.type(screen.getByLabelText("Title"), "No File Yet")
    await user.type(screen.getByLabelText("Provenance"), "Maintainer upload")
    await user.type(screen.getByLabelText("Summary"), "Missing file.")
    await user.click(screen.getByRole("button", { name: "Upload draft" }))

    expect(await screen.findByText("A source file is required.")).toBeVisible()
    expect(mockedUploadSource).not.toHaveBeenCalled()
  })

  it("can queue ingest and archive through protected actions", async () => {
    const user = userEvent.setup()

    render(<MaintainerDashboard />)

    await screen.findByRole("heading", {
      name: "Charter of the United Nations",
    })
    await user.click(screen.getByRole("button", { name: "Ingest" }))
    await waitFor(() =>
      expect(mockedIngestSource).toHaveBeenCalledWith(
        "gg-src-un-charter-institutions",
        session
      )
    )
    await user.click(screen.getByRole("button", { name: "Archive" }))
    await user.click(screen.getByRole("button", { name: "Confirm archive" }))
    await waitFor(() =>
      expect(mockedMutateSourceLifecycle).toHaveBeenCalledWith(
        "gg-src-un-charter-institutions",
        "archive",
        session
      )
    )
  })
})
