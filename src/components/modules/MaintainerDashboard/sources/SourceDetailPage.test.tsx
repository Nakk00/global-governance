import userEvent from "@testing-library/user-event"
import { render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/lib/maintainer/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/maintainer/api")>(
    "@/lib/maintainer/api"
  )

  return {
    ...actual,
    fetchSourceChunks: vi.fn(),
    fetchSourceCitations: vi.fn(),
    fetchChunkDetail: vi.fn(),
    fetchCitationDetail: vi.fn(),
  }
})

import {
  fetchChunkDetail,
  fetchCitationDetail,
  fetchSourceChunks,
  fetchSourceCitations,
} from "@/lib/maintainer/api"
import type {
  ChunkRow,
  CitationDetail,
  SourceDetail,
} from "@/lib/maintainer/source-api"

import { SourceDetailPage } from "./SourceDetailPage"

const source = {
  sourceId: "gg-src-un-charter-institutions",
  title: "Charter of the United Nations",
  sourceType: "primary",
  lifecycleState: "active",
  createdAt: "2026-05-11T09:42:00Z",
  updatedAt: "2026-05-11T10:15:00Z",
  aliases: [],
  usageScope: ["presentation", "chat", "ingestion"],
  provenance: "Foundational UN treaty; institutional design; primary source",
  ingestionReadiness: "partial",
  latestValidationOutcome: "warning",
  latestIngestJob: null,
  partialData: [
    {
      field: "ingestionReadiness",
      reason: "A protected ingest run is still required for activation.",
    },
  ],
  summary:
    "Defines the UN's purposes, organs, member obligations, and Security Council structure.",
  metadata: {
    Steward: "Admin User",
  },
  approvalLineage: [
    {
      eventId: "approval-1",
      sourceId: "gg-src-un-charter-institutions",
      eventType: "approved",
      origin: "system-seed",
      occurredAt: "2026-05-11T09:50:00Z",
      outcome: "succeeded",
      summary: "Source approved for stewardship review.",
    },
  ],
  ingestionProvenance: [
    {
      eventId: "ingest-1",
      sourceId: "gg-src-un-charter-institutions",
      eventType: "ingest",
      origin: "admin@example.test",
      occurredAt: "2026-05-11T10:00:00Z",
      outcome: "succeeded",
      summary: "Protected ingest completed successfully.",
    },
  ],
  validationHistory: [
    {
      eventId: "validation-1",
      sourceId: "gg-src-un-charter-institutions",
      eventType: "validation",
      origin: "validator",
      occurredAt: "2026-05-11T10:05:00Z",
      outcome: "warning",
      summary: "Validation follow-up is recommended before demo use.",
    },
  ],
  auditTrail: [
    {
      eventId: "audit-1",
      sourceId: "gg-src-un-charter-institutions",
      eventType: "audit",
      origin: "admin@example.test",
      occurredAt: "2026-05-11T10:10:00Z",
      outcome: "succeeded",
      summary: "Maintainer review completed.",
    },
  ],
} satisfies SourceDetail

const inspectionAnchor = {
  documentId: "doc-un-charter",
  version: "v1",
  sourceId: source.sourceId,
  state: "ready",
  message: "Retrieval evidence is ready for maintainer inspection.",
  nextStep: "Inspect chunks and citations before activation.",
} as const

const chunk = {
  id: "chunk-un-charter-1",
  documentId: "doc-un-charter",
  sourceId: source.sourceId,
  chunkIndex: 1,
  tokenCount: 144,
  contentPreview:
    "We the peoples of the United Nations determined to save succeeding generations...",
  embeddingPresent: true,
  activeState: "ready",
  pageNumber: 1,
  heading: "Preamble",
  metadata: {},
} satisfies ChunkRow

const citation = {
  id: "citation-un-charter-1",
  documentId: "doc-un-charter",
  sourceId: source.sourceId,
  citationLabel: "UN Charter, Preamble",
  displayLabel: "Charter Preamble",
  linkedChunkIds: [chunk.id],
  activeState: "ready",
  pageNumber: 1,
  sectionHeading: "Preamble",
  metadata: {},
  sourceTitle: source.title,
  sourcePath: "/sources/un-charter",
  copyableLabel: "Charter of the United Nations, Preamble",
  linkedChunks: [chunk],
} satisfies CitationDetail

beforeEach(() => {
  vi.mocked(fetchSourceChunks).mockResolvedValue({
    anchor: inspectionAnchor,
    chunks: [chunk],
    partialData: [],
  })
  vi.mocked(fetchSourceCitations).mockResolvedValue({
    anchor: inspectionAnchor,
    citations: [citation],
    partialData: [],
  })
  vi.mocked(fetchChunkDetail).mockResolvedValue({
    ...chunk,
    content:
      "We the peoples of the United Nations determined to save succeeding generations from the scourge of war.",
    linkedCitationIds: [citation.id],
    createdAt: "2026-05-11T10:00:00Z",
    updatedAt: "2026-05-11T10:10:00Z",
  })
  vi.mocked(fetchCitationDetail).mockResolvedValue(citation)
})

function renderSourceDetail() {
  const route = {
    section: "sourceDetail" as const,
    path: "/maintainer/sources/gg-src-un-charter-institutions",
    preset: null,
    sourceId: source.sourceId,
  }

  return render(
    <SourceDetailPage
      route={route}
      sourceId={source.sourceId}
      selectedSource={source}
      detailState={{ state: "ready", source }}
      session={{
        accessToken: "maintainer-token",
        expiresAt: 1_893_456_000,
        user: { id: "user-123", email: "admin@example.test" },
      }}
      mutationState={{ state: "idle" }}
      onNavigate={vi.fn()}
      onUpdateSource={vi.fn()}
      onLifecycleAction={vi.fn()}
      onIngestSource={vi.fn()}
      onRetrySourceDetail={vi.fn()}
    />
  )
}

describe("SourceDetailPage", () => {
  it("renders the redesigned source detail layout and switches to history from the status rail", async () => {
    const user = userEvent.setup()

    renderSourceDetail()

    expect(
      await screen.findAllByRole("heading", {
        name: "Charter of the United Nations",
      })
    ).toHaveLength(2)
    expect(screen.getByText("Source status")).toBeVisible()
    expect(screen.getByText("Recent source activity")).toBeVisible()
    expect(screen.getByText("Key metadata")).toBeVisible()
    expect(screen.getByText("Partial-data markers")).toBeVisible()
    expect(screen.getByText("Readiness-first investigation")).toBeVisible()
    expect(screen.getByText("Inline validation evidence")).toBeVisible()
    expect(
      screen.getByRole("button", { name: "Open validation workbench" })
    ).toBeVisible()
    expect(
      screen.getByRole("button", { name: "Back to sources" })
    ).toBeVisible()
    expect(screen.getByRole("tab", { name: "Overview" })).toBeVisible()
    expect(screen.getByRole("tab", { name: "Chunks" })).toBeVisible()
    expect(screen.getByRole("tab", { name: "Citations" })).toBeVisible()
    expect(screen.getByRole("tab", { name: "History" })).toBeVisible()

    await user.click(screen.getByRole("button", { name: "View full history" }))

    expect(screen.getByText("Approval lineage")).toBeVisible()
    expect(screen.getByText("Ingestion provenance")).toBeVisible()
    expect(screen.getByText("Validation run history")).toBeVisible()
    expect(screen.getByText("Maintainer audit trail")).toBeVisible()
  })

  it("renders chunk inspection evidence and opens chunk detail", async () => {
    const user = userEvent.setup()

    renderSourceDetail()

    await user.click(screen.getByRole("tab", { name: "Chunks" }))

    await waitFor(() =>
      expect(fetchSourceChunks).toHaveBeenCalledWith(
        source.sourceId,
        expect.objectContaining({ accessToken: "maintainer-token" })
      )
    )
    expect(screen.getByText("Version anchor")).toBeVisible()
    expect(screen.getByText("Filter chunks")).toBeVisible()
    expect(screen.getByText("Chunk 1")).toBeVisible()
    expect(screen.getByText("144")).toBeVisible()

    await user.click(screen.getByRole("button", { name: "Inspect chunk" }))

    expect(await screen.findByText("Copy chunk text")).toBeVisible()
    expect(screen.getByText("Evidence detail")).toBeVisible()
  })

  it("renders citation inspection evidence and opens citation detail", async () => {
    const user = userEvent.setup()

    renderSourceDetail()

    await user.click(screen.getByRole("tab", { name: "Citations" }))

    await waitFor(() =>
      expect(fetchSourceCitations).toHaveBeenCalledWith(
        source.sourceId,
        expect.objectContaining({ accessToken: "maintainer-token" })
      )
    )
    expect(screen.getByText("Filter citations")).toBeVisible()
    expect(screen.getByText("Citation support")).toBeVisible()
    expect(screen.getByText("Charter Preamble")).toBeVisible()

    await user.click(screen.getByRole("button", { name: "Inspect citation" }))

    expect(await screen.findByText("Copy citation label")).toBeVisible()
    expect(screen.getByText("Evidence detail")).toBeVisible()
  })
})
