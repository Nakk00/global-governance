import { act, render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  fetchAdminMe,
  fetchChunkDetail,
  fetchCitationDetail,
  fetchValidationRunDetail,
  fetchValidationRuns,
  fetchValidationSets,
  fetchSourceChunks,
  fetchSourceCitations,
  fetchSourceDetail,
  fetchStewardshipDashboard,
  ingestSource,
  launchValidationRun,
  MaintainerApiError,
  mutateSourceLifecycle,
  updateSourceMetadata,
  uploadSource,
  type SourceDetail,
  type StewardshipDashboard,
  type ValidationRunDetail,
  type ValidationRunList,
  type ValidationSetList,
} from "@/lib/maintainer/api"
import {
  clearSupabaseSession,
  getSupabaseSession,
  isSupabaseSessionExpired,
  signInWithPassword,
} from "@/lib/supabase/browser-client"

import { MaintainerDashboard } from "./MaintainerDashboard"

vi.mock("@/lib/maintainer/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/maintainer/api")>(
    "@/lib/maintainer/api"
  )

  return {
    ...actual,
    fetchAdminMe: vi.fn(),
    fetchChunkDetail: vi.fn(),
    fetchCitationDetail: vi.fn(),
    fetchValidationRunDetail: vi.fn(),
    fetchValidationRuns: vi.fn(),
    fetchValidationSets: vi.fn(),
    fetchSourceChunks: vi.fn(),
    fetchSourceCitations: vi.fn(),
    fetchSourceDetail: vi.fn(),
    fetchStewardshipDashboard: vi.fn(),
    ingestSource: vi.fn(),
    launchValidationRun: vi.fn(),
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
const mockedFetchChunkDetail = vi.mocked(fetchChunkDetail)
const mockedFetchCitationDetail = vi.mocked(fetchCitationDetail)
const mockedFetchValidationRunDetail = vi.mocked(fetchValidationRunDetail)
const mockedFetchValidationRuns = vi.mocked(fetchValidationRuns)
const mockedFetchValidationSets = vi.mocked(fetchValidationSets)
const mockedFetchSourceChunks = vi.mocked(fetchSourceChunks)
const mockedFetchSourceCitations = vi.mocked(fetchSourceCitations)
const mockedFetchSourceDetail = vi.mocked(fetchSourceDetail)
const mockedFetchStewardshipDashboard = vi.mocked(fetchStewardshipDashboard)
const mockedIngestSource = vi.mocked(ingestSource)
const mockedLaunchValidationRun = vi.mocked(launchValidationRun)
const mockedMutateSourceLifecycle = vi.mocked(mutateSourceLifecycle)
const mockedUpdateSourceMetadata = vi.mocked(updateSourceMetadata)
const mockedUploadSource = vi.mocked(uploadSource)
const mockedClearSupabaseSession = vi.mocked(clearSupabaseSession)
const mockedGetSupabaseSession = vi.mocked(getSupabaseSession)
const mockedIsSupabaseSessionExpired = vi.mocked(isSupabaseSessionExpired)
const mockedSignInWithPassword = vi.mocked(signInWithPassword)

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

const validationSets = {
  defaultSetId: "demo-readiness-v1",
  sets: [
    {
      validationSetId: "demo-readiness-v1",
      name: "Demo Readiness v1",
      description: "Baseline demo checks.",
      version: 1,
      isDefault: true,
      questionCount: 5,
      createdBy: "system-seed",
      createdAt: "2026-05-05T00:00:00Z",
      updatedAt: "2026-05-05T00:00:00Z",
    },
  ],
} satisfies ValidationSetList

const validationRun = {
  runId: "val-run-1",
  validationSetId: "demo-readiness-v1",
  validationSetName: "Demo Readiness v1",
  validationSetVersion: 1,
  status: "completed",
  totalCount: 5,
  passCount: 1,
  weakSupportCount: 1,
  refusedCount: 1,
  failedCount: 1,
  errorCount: 1,
  averageLatencyMs: 685,
  createdBy: "admin@example.test",
  createdAt: "2026-05-05T00:00:00Z",
  startedAt: "2026-05-05T00:00:01Z",
  completedAt: "2026-05-05T00:00:05Z",
  sourceSnapshotIds: ["gg-src-un-charter-institutions@active"],
  state: "ready",
  notes: "Immutable validation run completed.",
  results: [
    {
      resultId: "result-pass",
      validationQuestionId: "demo-q-grounded-un-charter",
      questionText: "What is the UN Security Council's role?",
      expectedState: "grounded",
      actualState: "grounded",
      outcome: "pass",
      answerPreview: "The Security Council has primary responsibility...",
      retrievedSourceIds: ["gg-src-un-charter-institutions"],
      citationIds: ["ref-un-charter"],
      supportScore: 0.93,
      latencyMs: 840,
      notes: "Expected grounded answer matched.",
      createdAt: "2026-05-05T00:00:05Z",
    },
  ],
  auditEvents: [],
} satisfies ValidationRunDetail

const validationRuns = {
  runs: [validationRun],
} satisfies ValidationRunList

function renderMaintainer(path = "/maintainer") {
  window.history.pushState(null, "", path)
  return render(<MaintainerDashboard initialPath={path} />)
}

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
  mockedFetchValidationSets.mockResolvedValue(validationSets)
  mockedFetchValidationRuns.mockResolvedValue(validationRuns)
  mockedFetchValidationRunDetail.mockResolvedValue(validationRun)
  mockedLaunchValidationRun.mockResolvedValue(validationRun)
  mockedFetchSourceDetail.mockResolvedValue(detailFrom())
  mockedFetchSourceChunks.mockResolvedValue({
    anchor: {
      documentId: "doc-un-charter-v2",
      version: "v2",
      sourceId: "gg-src-un-charter-institutions",
      state: "ready",
      message:
        "Inspecting chunk records from the latest successful document revision.",
      nextStep: "Re-ingest if the visible evidence is stale or incomplete.",
    },
    chunks: [
      {
        id: "chunk-un-charter-0",
        documentId: "doc-un-charter-v2",
        sourceId: "gg-src-un-charter-institutions",
        chunkIndex: 0,
        tokenCount: 42,
        contentPreview:
          "The UN Charter establishes the organs and obligations.",
        embeddingPresent: true,
        activeState: "ready",
        pageNumber: 1,
        heading: "Preamble",
        metadata: {},
      },
    ],
    partialData: [],
  })
  mockedFetchSourceCitations.mockResolvedValue({
    anchor: {
      documentId: "doc-un-charter-v2",
      version: "v2",
      sourceId: "gg-src-un-charter-institutions",
      state: "ready",
      message:
        "Inspecting citation records from the latest successful document revision.",
      nextStep: "Re-ingest if the visible evidence is stale or incomplete.",
    },
    citations: [
      {
        id: "ref-un-charter",
        documentId: "doc-un-charter-v2",
        sourceId: "gg-src-un-charter-institutions",
        citationLabel: "Charter of the United Nations",
        displayLabel: "UN Charter",
        linkedChunkIds: ["chunk-un-charter-0"],
        activeState: "ready",
        pageNumber: 1,
        sectionHeading: "Preamble",
        metadata: {},
      },
    ],
    partialData: [],
  })
  mockedFetchChunkDetail.mockResolvedValue({
    id: "chunk-un-charter-0",
    documentId: "doc-un-charter-v2",
    sourceId: "gg-src-un-charter-institutions",
    chunkIndex: 0,
    tokenCount: 42,
    contentPreview: "The UN Charter establishes the organs and obligations.",
    content: "The UN Charter establishes the organs and obligations.",
    embeddingPresent: true,
    activeState: "ready",
    pageNumber: 1,
    heading: "Preamble",
    metadata: {},
    linkedCitationIds: ["ref-un-charter"],
    createdAt: "2026-05-05T00:00:00Z",
    updatedAt: "2026-05-05T00:00:00Z",
  })
  mockedFetchCitationDetail.mockResolvedValue({
    id: "ref-un-charter",
    documentId: "doc-un-charter-v2",
    sourceId: "gg-src-un-charter-institutions",
    citationLabel: "Charter of the United Nations",
    displayLabel: "UN Charter",
    linkedChunkIds: ["chunk-un-charter-0"],
    activeState: "ready",
    pageNumber: 1,
    sectionHeading: "Preamble",
    metadata: {},
    sourceTitle: "Charter of the United Nations",
    sourcePath: "bootstrap-approved-source-bundle",
    copyableLabel: "UN Charter",
    linkedChunks: [
      {
        id: "chunk-un-charter-0",
        documentId: "doc-un-charter-v2",
        sourceId: "gg-src-un-charter-institutions",
        chunkIndex: 0,
        tokenCount: 42,
        contentPreview:
          "The UN Charter establishes the organs and obligations.",
        embeddingPresent: true,
        activeState: "ready",
        pageNumber: 1,
        heading: "Preamble",
        metadata: {},
      },
    ],
  })
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

    renderMaintainer()

    expect(
      await screen.findByRole("heading", { name: "Maintainer Sign In" })
    ).toBeVisible()
    expect(screen.getByText("Global Governance")).toBeVisible()
    expect(screen.getByText("Education for a connected world")).toBeVisible()
    expect(screen.getByText("Authorized maintainers only")).toBeVisible()
    expect(screen.getByText("Forgot password?")).toBeVisible()
  })

  it("toggles password visibility from the sign-in gate", async () => {
    const user = userEvent.setup()
    mockedGetSupabaseSession.mockReturnValue(null)

    renderMaintainer()

    const passwordInput = await screen.findByLabelText("Password")
    expect(passwordInput).toHaveAttribute("type", "password")

    await user.click(screen.getByRole("button", { name: "Show password" }))
    expect(passwordInput).toHaveAttribute("type", "text")

    await user.click(screen.getByRole("button", { name: "Hide password" }))
    expect(passwordInput).toHaveAttribute("type", "password")
  })

  it("shows loading and disables submit while signing in", async () => {
    const user = userEvent.setup()
    mockedGetSupabaseSession.mockReturnValue(null)
    mockedSignInWithPassword.mockImplementation(() => new Promise(() => {}))

    renderMaintainer()

    await user.type(await screen.findByLabelText("Email"), "admin@example.test")
    await user.type(screen.getByLabelText("Password"), "secret-password")
    await user.click(screen.getByRole("button", { name: "Sign In" }))

    expect(screen.getByRole("button", { name: "Signing in" })).toBeDisabled()
    expect(mockedSignInWithPassword).toHaveBeenCalledWith({
      email: "admin@example.test",
      password: "secret-password",
    })
  })

  it("surfaces a user-safe sign-in error", async () => {
    const user = userEvent.setup()
    mockedGetSupabaseSession.mockReturnValue(null)
    mockedSignInWithPassword.mockRejectedValue(new Error("auth failed"))

    renderMaintainer()

    await user.type(await screen.findByLabelText("Email"), "admin@example.test")
    await user.type(screen.getByLabelText("Password"), "wrong-password")
    await user.click(screen.getByRole("button", { name: "Sign In" }))

    expect(
      await screen.findByText(
        "The maintainer sign-in request could not be completed."
      )
    ).toBeVisible()
  })

  it("reruns the Django admin gate after successful sign-in", async () => {
    const user = userEvent.setup()
    mockedGetSupabaseSession.mockReturnValue(null)
    mockedSignInWithPassword.mockImplementation(async () => {
      mockedGetSupabaseSession.mockReturnValue(session)
      return session
    })

    renderMaintainer()

    await user.type(await screen.findByLabelText("Email"), "admin@example.test")
    await user.type(screen.getByLabelText("Password"), "correct-password")
    await user.click(screen.getByRole("button", { name: "Sign In" }))

    expect(
      await screen.findByRole("heading", { name: "Maintainer dashboard" })
    ).toBeVisible()
    expect(mockedFetchAdminMe).toHaveBeenCalledWith(session)
  })

  it("keeps the overview focused on readiness instead of source operations", async () => {
    renderMaintainer()

    expect(
      await screen.findByRole("heading", { name: "Maintainer overview" })
    ).toBeVisible()
    expect(screen.getByText("Stewarded sources")).toBeVisible()
    expect(screen.getByRole("heading", { name: "Sources" })).toBeVisible()
    expect(screen.getByRole("heading", { name: "Validation" })).toBeVisible()
    expect(
      screen.getByRole("heading", { name: "Audit/Operations" })
    ).toBeVisible()
    expect(
      screen.queryByRole("heading", { name: "Protected source upload" })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole("heading", { name: "Source stewardship inventory" })
    ).not.toBeInTheDocument()
  })

  it("routes from readiness workflow cards into filtered drill-down queues", async () => {
    const user = userEvent.setup()

    renderMaintainer()

    const validationCard = (
      await screen.findByRole("heading", {
        name: "Validation",
      })
    ).closest("article")
    expect(validationCard).not.toBeNull()

    await user.click(
      within(validationCard as HTMLElement).getByRole("button", {
        name: "Review follow-up queue",
      })
    )

    expect(await screen.findByText("Validation follow-up queue")).toBeVisible()
    expect(
      screen.getAllByText("Charter of the United Nations").length
    ).toBeGreaterThan(0)
    expect(
      screen.queryByText("South China Sea Arbitration Award")
    ).not.toBeInTheDocument()
  })

  it("opens inventory, upload, and operations as separate maintainer sections", async () => {
    const user = userEvent.setup()

    renderMaintainer("/maintainer/sources")

    expect(
      await screen.findByRole("heading", {
        name: "Source stewardship inventory",
      })
    ).toBeVisible()
    expect(screen.queryByLabelText("Source ID")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Upload source" }))
    expect(
      await screen.findByRole("heading", { name: "Upload a source draft" })
    ).toBeVisible()
    expect(screen.getByLabelText("Source ID")).toBeVisible()

    await user.click(screen.getByRole("button", { name: "Operations" }))
    expect(
      await screen.findByRole("heading", {
        name: "Ingestion and audit records",
      })
    ).toBeVisible()
    expect(screen.getByText("Ingestion records")).toBeVisible()
    expect(screen.getAllByText("No history is available.").length).toBe(3)
  })

  it("keeps upload available when the source inventory is empty", async () => {
    mockedFetchStewardshipDashboard.mockResolvedValue({
      ...dashboard,
      overview: {
        sourceCount: 0,
        activeSourceCount: 0,
        draftSourceCount: 0,
        partialSourceCount: 0,
        latestIngestionStatus: null,
        latestValidationStatus: null,
        readinessState: "empty",
      },
      sources: [],
      ingestionRuns: [],
      validationRuns: [],
      auditEvents: [],
    })

    renderMaintainer("/maintainer/sources/new")

    expect(
      await screen.findByRole("heading", { name: "Upload a source draft" })
    ).toBeVisible()
    expect(screen.getByLabelText("Source file")).toBeVisible()
  })

  it("keeps validation available when source inventory loading fails", async () => {
    mockedFetchStewardshipDashboard.mockRejectedValue(
      new Error("source inventory unavailable")
    )

    renderMaintainer("/maintainer/validation")

    expect(
      await screen.findByRole("heading", { name: "Validation workbench" })
    ).toBeVisible()
    expect(screen.getByLabelText("Validation set")).toHaveValue(
      "demo-readiness-v1"
    )
    expect(
      screen.queryByText("source inventory unavailable")
    ).not.toBeInTheDocument()
  })

  it("falls back safely when the source detail route is malformed", async () => {
    renderMaintainer("/maintainer/sources/%E0%A4%A")

    expect(
      await screen.findByRole("heading", { name: "Maintainer overview" })
    ).toBeVisible()
    expect(mockedFetchSourceDetail).not.toHaveBeenCalled()
  })

  it("lets maintainers open a readiness finding in source detail first", async () => {
    const user = userEvent.setup()

    renderMaintainer()

    const sourcesCard = (
      await screen.findByRole("heading", {
        name: "Sources",
      })
    ).closest("article")
    expect(sourcesCard).not.toBeNull()

    await user.click(
      within(sourcesCard as HTMLElement).getByRole("button", {
        name: "Open source detail",
      })
    )

    await waitFor(() =>
      expect(
        screen.getAllByRole("heading", {
          name: "Charter of the United Nations",
        }).length
      ).toBeGreaterThan(0)
    )
    expect(screen.getByText("Current readiness blocker")).toBeVisible()
    expect(screen.getByText("Inline validation evidence")).toBeVisible()
    expect(
      screen.getByRole("button", { name: "Open validation workbench" })
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

      renderMaintainer()

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

    renderMaintainer("/maintainer/sources/gg-src-un-charter-institutions")

    expect(
      await screen.findByRole("heading", {
        name: "Charter of the United Nations",
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

  it("keeps stale source detail responses from replacing the routed source", async () => {
    const user = userEvent.setup()
    let resolveFirstDetail: (value: SourceDetail) => void = () => {}
    mockedFetchSourceDetail
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveFirstDetail = resolve
          })
      )
      .mockResolvedValueOnce({
        ...detailFrom(dashboard.sources[1]),
        summary: "Second source detail.",
      })

    renderMaintainer("/maintainer/sources/gg-src-un-charter-institutions")

    await screen.findByRole("heading", {
      name: "Charter of the United Nations",
    })
    await user.click(screen.getByRole("button", { name: "Back to sources" }))
    await screen.findByRole("heading", { name: "Source stewardship" })
    await user.click(screen.getAllByRole("button", { name: "Inspect" })[1])

    await screen.findAllByRole("heading", {
      name: "South China Sea Arbitration Award",
    })
    expect(await screen.findByText("Second source detail.")).toBeVisible()

    resolveFirstDetail({
      ...detailFrom(dashboard.sources[0]),
      summary: "Stale source detail.",
    })

    await waitFor(() =>
      expect(
        screen.getAllByRole("heading", {
          name: "South China Sea Arbitration Award",
        }).length
      ).toBeGreaterThan(0)
    )
    expect(screen.queryByText("Stale source detail.")).not.toBeInTheDocument()
  })

  it("signs out locally from the ready dashboard state", async () => {
    const user = userEvent.setup()

    renderMaintainer()

    const signOut = await screen.findByRole("button", { name: "Sign out" })
    await user.click(signOut)

    expect(mockedClearSupabaseSession).toHaveBeenCalled()
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Maintainer Sign In" })
      ).toBeVisible()
    )
  })

  it("uploads a protected source and refreshes the persisted projection", async () => {
    const user = userEvent.setup()
    renderMaintainer("/maintainer/sources/new")

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

  it("keeps the mutation-updated dashboard when an older dashboard load resolves later", async () => {
    const user = userEvent.setup()
    let resolveDashboardLoad: (value: StewardshipDashboard) => void = () => {}
    mockedFetchStewardshipDashboard.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveDashboardLoad = resolve
        })
    )

    renderMaintainer("/maintainer/sources/new")

    await screen.findByRole("heading", { name: "Upload a source draft" })
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

    expect(
      await screen.findByText("Source uploaded as draft and inactive.")
    ).toBeVisible()

    await act(async () => {
      resolveDashboardLoad(dashboard)
    })

    await user.click(screen.getByRole("button", { name: "Back to sources" }))

    expect(
      await screen.findByRole("heading", {
        name: "Source stewardship",
      })
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

    renderMaintainer("/maintainer/sources/new")

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

    renderMaintainer("/maintainer/sources/new")

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

    renderMaintainer("/maintainer/sources/gg-src-un-charter-institutions")

    await screen.findAllByRole("heading", {
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

  it("opens chunk inspection, detail, copy, and linked citation evidence", async () => {
    const user = userEvent.setup()

    renderMaintainer("/maintainer/sources/gg-src-un-charter-institutions")

    await screen.findAllByRole("heading", {
      name: "Charter of the United Nations",
    })
    await user.click(screen.getByRole("tab", { name: "Chunks" }))

    expect(await screen.findByText("doc-un-charter-v2")).toBeVisible()
    expect(
      screen.getAllByText(
        "The UN Charter establishes the organs and obligations."
      ).length
    ).toBeGreaterThan(0)
    await user.click(screen.getAllByRole("button", { name: "Inspect" }).at(-1)!)

    expect(
      await screen.findByRole("dialog", { name: "Retrieval evidence detail" })
    ).toBeVisible()
    expect(
      screen.getByRole("button", { name: "Copy chunk text" })
    ).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Open citation" }))

    expect(mockedFetchCitationDetail).toHaveBeenCalledWith(
      "ref-un-charter",
      session
    )
  })

  it("opens citation inspection with learner-visible labels and linked chunks", async () => {
    const user = userEvent.setup()

    renderMaintainer("/maintainer/sources/gg-src-un-charter-institutions")

    await screen.findAllByRole("heading", {
      name: "Charter of the United Nations",
    })
    await user.click(screen.getByRole("tab", { name: "Citations" }))

    expect((await screen.findAllByText("UN Charter")).length).toBeGreaterThan(0)
    expect(
      screen.getAllByText("Charter of the United Nations").length
    ).toBeGreaterThan(0)
    await user.click(screen.getAllByRole("button", { name: "Inspect" }).at(-1)!)

    expect(
      await screen.findByRole("button", { name: "Copy citation label" })
    ).toBeVisible()
    expect(screen.getByText("bootstrap-approved-source-bundle")).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Open chunk 0" }))
    expect(mockedFetchChunkDetail).toHaveBeenCalledWith(
      "chunk-un-charter-0",
      session
    )
  })

  it("keeps stale chunk responses from painting after source switching", async () => {
    const user = userEvent.setup()
    mockedFetchSourceDetail.mockImplementation(async (sourceId) =>
      sourceId === "gg-src-south-china-sea-award"
        ? detailFrom(dashboard.sources[1])
        : detailFrom(dashboard.sources[0])
    )
    let resolveFirstChunks: (
      value: Awaited<ReturnType<typeof fetchSourceChunks>>
    ) => void = () => {}
    mockedFetchSourceChunks.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFirstChunks = resolve
        })
    )

    renderMaintainer("/maintainer/sources/gg-src-un-charter-institutions")

    await screen.findAllByRole("heading", {
      name: "Charter of the United Nations",
    })
    await user.click(screen.getByRole("tab", { name: "Chunks" }))
    await user.click(screen.getByRole("button", { name: "Back to sources" }))
    await screen.findByRole("heading", { name: "Source stewardship" })
    await user.click(screen.getAllByRole("button", { name: "Inspect" })[1])
    await screen.findAllByRole("heading", {
      name: "South China Sea Arbitration Award",
    })
    await user.click(screen.getByRole("tab", { name: "Chunks" }))

    resolveFirstChunks({
      anchor: {
        documentId: "stale-doc",
        version: "v0",
        sourceId: "gg-src-un-charter-institutions",
        state: "ready",
        message: "stale",
        nextStep: "stale",
      },
      chunks: [],
      partialData: [],
    })

    await waitFor(() =>
      expect(mockedFetchSourceChunks).toHaveBeenCalledTimes(2)
    )
    expect(screen.queryByText("stale-doc")).not.toBeInTheDocument()
  })

  it("keeps stale chunk detail responses from painting after source switching", async () => {
    const user = userEvent.setup()
    mockedFetchSourceDetail.mockImplementation(async (sourceId) =>
      sourceId === "gg-src-south-china-sea-award"
        ? detailFrom(dashboard.sources[1])
        : detailFrom(dashboard.sources[0])
    )
    let resolveChunkDetail: (
      value: Awaited<ReturnType<typeof fetchChunkDetail>>
    ) => void = () => {}
    mockedFetchChunkDetail.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveChunkDetail = resolve
        })
    )

    renderMaintainer("/maintainer/sources/gg-src-un-charter-institutions")

    await screen.findAllByRole("heading", {
      name: "Charter of the United Nations",
    })
    await user.click(screen.getByRole("tab", { name: "Chunks" }))
    await user.click(screen.getAllByRole("button", { name: "Inspect" }).at(-1)!)
    await user.click(screen.getByRole("button", { name: "Back to sources" }))
    await screen.findByRole("heading", { name: "Source stewardship" })
    await user.click(screen.getAllByRole("button", { name: "Inspect" })[1])

    resolveChunkDetail({
      id: "chunk-un-charter-0",
      documentId: "doc-un-charter-v2",
      sourceId: "gg-src-un-charter-institutions",
      chunkIndex: 0,
      tokenCount: 42,
      contentPreview: "The UN Charter establishes the organs and obligations.",
      content: "The UN Charter establishes the organs and obligations.",
      embeddingPresent: true,
      activeState: "ready",
      pageNumber: 1,
      heading: "Preamble",
      metadata: {},
      linkedCitationIds: ["ref-un-charter"],
      createdAt: "2026-05-05T00:00:00Z",
      updatedAt: "2026-05-05T00:00:00Z",
    })

    await screen.findAllByRole("heading", {
      name: "South China Sea Arbitration Award",
    })
    expect(
      screen.queryByRole("dialog", { name: "Retrieval evidence detail" })
    ).not.toBeInTheDocument()
  })

  it("filters chunk inspection results and explains the row limit", async () => {
    const user = userEvent.setup()
    mockedFetchSourceChunks.mockResolvedValueOnce({
      anchor: {
        documentId: "doc-un-charter-v2",
        version: "v2",
        sourceId: "gg-src-un-charter-institutions",
        state: "ready",
        message:
          "Inspecting chunk records from the latest successful document revision.",
        nextStep: "Re-ingest if the visible evidence is stale or incomplete.",
      },
      chunks: Array.from({ length: 55 }, (_, index) => ({
        id: `chunk-${index}`,
        documentId: "doc-un-charter-v2",
        sourceId: "gg-src-un-charter-institutions",
        chunkIndex: index,
        tokenCount: 40 + index,
        contentPreview:
          index === 54 ? "Tribunal award evidence" : `Chunk ${index}`,
        embeddingPresent: true,
        activeState: "ready" as const,
        pageNumber: index + 1,
        heading: index === 54 ? "Award" : "Preamble",
        metadata: {},
      })),
      partialData: [],
    })

    renderMaintainer("/maintainer/sources/gg-src-un-charter-institutions")

    await screen.findAllByRole("heading", {
      name: "Charter of the United Nations",
    })
    await user.click(screen.getByRole("tab", { name: "Chunks" }))

    expect(
      await screen.findByText(
        "Showing first 50 of 55 matching chunks. Refine the filter to narrow further."
      )
    ).toBeVisible()
    expect(
      screen.queryByText("Tribunal award evidence")
    ).not.toBeInTheDocument()

    await user.type(
      screen.getByRole("searchbox", { name: "Filter chunks" }),
      "tribunal"
    )

    expect(
      (await screen.findAllByText("Tribunal award evidence")).length
    ).toBeGreaterThan(0)
    expect(
      screen.getByText(
        "Showing 1 of 1 matching chunks. Filtered from 55 total records."
      )
    ).toBeVisible()
  })

  it("loads the validation workbench, launches immutable runs, and opens result detail", async () => {
    const user = userEvent.setup()

    renderMaintainer("/maintainer/validation")

    expect(
      await screen.findByRole("heading", { name: "Validation workbench" })
    ).toBeVisible()
    expect(screen.getByLabelText("Validation set")).toHaveValue(
      "demo-readiness-v1"
    )
    expect(screen.getAllByText("Demo Readiness v1").length).toBeGreaterThan(0)
    for (const outcome of [
      "pass",
      "weakSupport",
      "refused",
      "failed",
      "error",
    ]) {
      expect(screen.getAllByText(outcome).length).toBeGreaterThan(0)
    }

    await user.click(screen.getByRole("button", { name: "Run validation" }))
    await waitFor(() =>
      expect(mockedLaunchValidationRun).toHaveBeenCalledWith(
        "demo-readiness-v1",
        session
      )
    )
    await user.click(screen.getByRole("button", { name: "Inspect result" }))

    expect(
      await screen.findByRole("dialog", { name: "Validation result detail" })
    ).toBeVisible()
    expect(screen.getByText("Expected grounded answer matched.")).toBeVisible()
    expect(screen.getAllByText("2026-05-05T00:00:05Z").length).toBeGreaterThan(
      0
    )
  })

  it("keeps the selected set synchronized when opening a run from another validation set", async () => {
    const user = userEvent.setup()
    const alternateSet = {
      validationSetId: "policy-refusal-v1",
      name: "Policy Refusal v1",
      description: "Focused off-topic and refusal checks.",
      version: 1,
      isDefault: false,
      questionCount: 3,
      createdBy: "system-seed",
      createdAt: "2026-05-05T00:00:00Z",
      updatedAt: "2026-05-05T00:00:00Z",
    }
    const alternateRun = {
      ...validationRun,
      runId: "val-run-2",
      validationSetId: alternateSet.validationSetId,
      validationSetName: alternateSet.name,
    }

    mockedFetchValidationSets.mockResolvedValue({
      defaultSetId: "demo-readiness-v1",
      sets: [...validationSets.sets, alternateSet],
    })
    mockedFetchValidationRuns.mockResolvedValue({
      runs: [validationRun, alternateRun],
    })
    mockedFetchValidationRunDetail.mockImplementation(async (runId) =>
      runId === "val-run-2" ? alternateRun : validationRun
    )

    renderMaintainer("/maintainer/validation")

    await screen.findByRole("heading", { name: "Validation workbench" })
    await user.click(screen.getAllByRole("button", { name: "Open run" })[1])

    await waitFor(() =>
      expect(screen.getByLabelText("Validation set")).toHaveValue(
        alternateSet.validationSetId
      )
    )
    expect(
      await screen.findByRole("heading", { name: "Policy Refusal v1" })
    ).toBeVisible()
  })

  it("shows a distinct not-found state when validation run detail disappears", async () => {
    mockedFetchValidationRunDetail.mockRejectedValue(
      new MaintainerApiError(
        "admin_validation_run_not_found",
        404,
        "The requested validation run was not found."
      )
    )

    renderMaintainer("/maintainer/validation")

    await screen.findByRole("heading", { name: "Validation workbench" })
    expect(await screen.findByText("Validation run not found")).toBeVisible()
    expect(
      screen.getByText(
        "The requested validation run is no longer available. Choose another immutable history record."
      )
    ).toBeVisible()
  })
})
