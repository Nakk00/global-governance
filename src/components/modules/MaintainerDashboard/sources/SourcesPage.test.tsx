import { useState } from "react"
import { render, screen, within, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import type {
  SourceDetail,
  SourceInventoryItem,
  StewardshipDashboard,
} from "@/lib/maintainer/source-api"

import { buildSourceDetailPath } from "../shared/routing"
import type { DetailState, MaintainerRoute } from "../shared/types"

import { SourcesPage } from "./SourcesPage"

const sources = [
  makeSource({
    sourceId: "gg-src-un-charter-institutions",
    title: "Charter of the United Nations",
    sourceType: "primary",
    lifecycleState: "active",
    aliases: ["un-charter"],
    usageScope: ["presentation", "chat", "ingestion"],
    provenance: "Foundational UN treaty; institutional design; primary source",
    ingestionReadiness: "ready",
    latestValidationOutcome: "succeeded",
    partialData: [],
    createdAt: "2026-05-05T00:00:00Z",
    updatedAt: "2026-05-06T00:00:00Z",
  }),
  makeSource({
    sourceId: "gg-src-south-china-sea-award",
    title: "South China Sea Arbitration Award",
    sourceType: "case",
    lifecycleState: "approved",
    aliases: ["wps-src-2016-tribunal-award"],
    usageScope: ["presentation", "chat", "evidence", "ingestion"],
    provenance: "2016 UNCLOS tribunal award; legal record",
    ingestionReadiness: "partial",
    latestValidationOutcome: "warning",
    partialData: [{ field: "ingestionReadiness", reason: "Needs follow-up." }],
    createdAt: "2026-05-06T00:00:00Z",
    updatedAt: "2026-05-07T00:00:00Z",
  }),
  makeSource({
    sourceId: "gg-src-climate-risk-brief",
    title: "Climate Risk Brief",
    sourceType: "reference",
    lifecycleState: "draft",
    aliases: ["climate-brief"],
    usageScope: ["ingestion"],
    provenance: "Draft policy brief on climate governance",
    ingestionReadiness: "empty",
    latestValidationOutcome: null,
    partialData: [{ field: "summary", reason: "Draft needs review." }],
    createdAt: "2026-05-07T00:00:00Z",
    updatedAt: "2026-05-08T00:00:00Z",
  }),
  makeSource({
    sourceId: "gg-src-global-governance-course-frame",
    title: "Global Governance Course Frame",
    sourceType: "course",
    lifecycleState: "disabled",
    aliases: ["gg-course-frame"],
    usageScope: ["presentation", "ingestion"],
    provenance: "Course framing document for learner journeys",
    ingestionReadiness: "ready",
    latestValidationOutcome: "failed",
    partialData: [],
    createdAt: "2026-05-08T00:00:00Z",
    updatedAt: "2026-05-09T00:00:00Z",
  }),
  ...Array.from({ length: 8 }, (_, index) =>
    makeSource({
      sourceId: `gg-src-generated-${index + 1}`,
      title: `Generated Source ${index + 1}`,
      sourceType: index % 2 === 0 ? "reference" : "primary",
      lifecycleState: index % 3 === 0 ? "archived" : "active",
      aliases: [`generated-${index + 1}`],
      usageScope: ["ingestion"],
      provenance: `Generated provenance ${index + 1}`,
      ingestionReadiness: index % 3 === 0 ? "partial" : "ready",
      latestValidationOutcome: index % 4 === 0 ? null : "queued",
      partialData:
        index % 3 === 0
          ? [{ field: "summary", reason: "Archived record needs review." }]
          : [],
      createdAt: `2026-05-${String(index + 9).padStart(2, "0")}T00:00:00Z`,
      updatedAt: `2026-05-${String(index + 10).padStart(2, "0")}T00:00:00Z`,
    })
  ),
] satisfies SourceInventoryItem[]

const dashboard = makeDashboard(sources)

const sourcesRoute = {
  section: "sources",
  path: "/maintainer/sources",
  preset: null,
} satisfies Extract<MaintainerRoute, { section: "sources" }>

function makeSource(
  overrides: Partial<SourceInventoryItem> & {
    sourceId: string
    title: string
  }
): SourceInventoryItem {
  return {
    sourceId: overrides.sourceId,
    title: overrides.title,
    sourceType: overrides.sourceType ?? "reference",
    lifecycleState: overrides.lifecycleState ?? "active",
    aliases: overrides.aliases ?? [],
    usageScope: overrides.usageScope ?? ["ingestion"],
    provenance: overrides.provenance ?? "Generated provenance",
    ingestionReadiness: overrides.ingestionReadiness ?? "ready",
    latestValidationOutcome: overrides.latestValidationOutcome ?? "succeeded",
    latestIngestJob: null,
    partialData: overrides.partialData ?? [],
    createdAt: overrides.createdAt ?? "2026-05-05T00:00:00Z",
    updatedAt: overrides.updatedAt ?? "2026-05-06T00:00:00Z",
  }
}

function makeDashboard(sources: SourceInventoryItem[]): StewardshipDashboard {
  return {
    overview: {
      sourceCount: sources.length,
      activeSourceCount: sources.filter(
        (source) => source.lifecycleState === "active"
      ).length,
      draftSourceCount: sources.filter(
        (source) => source.lifecycleState === "draft"
      ).length,
      partialSourceCount: sources.filter(
        (source) => source.ingestionReadiness !== "ready"
      ).length,
      latestIngestionStatus: "succeeded",
      latestValidationStatus: "warning",
      readinessState: "partial",
    },
    monitoring: {
      readiness: {
        label: "Readiness",
        value: "Ready",
        tone: "good",
        detail: "Active approved sources ready for learner-facing grounding.",
      },
      blockers: {
        label: "Blockers",
        value: "2",
        tone: "warning",
        detail:
          "Draft, partial, or failed validation items needing maintainer attention.",
      },
      validationHealth: {
        label: "Validation health",
        value: "Warning",
        tone: "warning",
        detail:
          "Sources have a mixture of warning and missing validation states.",
      },
      nextActions: [],
    },
    auditTrail: {
      totalEvents: 0,
      latestOutcome: null,
      latestEventAt: null,
      recentEvents: [],
    },
    chatbotTrust: {
      state: "ready",
      groundedSourceCount: 1,
      validationRunCount: 1,
      latestValidationStatus: "succeeded",
      warningCount: 0,
      failedCount: 0,
      evidence: [],
    },
    sources,
    ingestionRuns: [],
    validationRuns: [],
    auditEvents: [],
  }
}

function makeDetail(source: SourceInventoryItem): SourceDetail {
  return {
    ...source,
    summary: `${source.title} summary for the selected-source rail.`,
    metadata: {
      "Document Type": source.sourceType,
      Steward: "Unassigned",
    },
    approvalLineage: [],
    ingestionProvenance: [],
    validationHistory: [],
    auditTrail: [],
  }
}

function SourcesHarness({
  initialSelectedSourceId = sources[0].sourceId,
  previewMode = "ready",
  onNavigate,
  onRetryPreview,
}: {
  initialSelectedSourceId?: string | null
  previewMode?: "ready" | "loading" | "outage" | "empty"
  onNavigate: (path: string) => void
  onRetryPreview: () => void
}) {
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(
    initialSelectedSourceId
  )
  const selectedSource =
    selectedSourceId != null
      ? (dashboard.sources.find(
          (source) => source.sourceId === selectedSourceId
        ) ?? null)
      : null

  const previewState: DetailState =
    previewMode === "ready" && selectedSource
      ? { state: "ready", source: makeDetail(selectedSource) }
      : previewMode === "loading"
        ? { state: "loading" }
        : previewMode === "outage"
          ? { state: "outage", message: "The source preview could not load." }
          : { state: "empty", message: "The selected source has no preview." }

  return (
    <SourcesPage
      route={sourcesRoute}
      dashboard={dashboard}
      selectedSourceId={selectedSourceId}
      previewState={previewState}
      onNavigate={onNavigate}
      onSelectSource={setSelectedSourceId}
      onRetryPreview={onRetryPreview}
    />
  )
}

function getDesktopInventory(container: HTMLElement) {
  const desktop = container.querySelector('section[class*="lg:block"]')
  if (!desktop) {
    throw new Error("Desktop inventory section was not rendered.")
  }
  return desktop as HTMLElement
}

describe("SourcesPage", () => {
  it("renders the stewardship workspace and selected-source rail", () => {
    const onNavigate = vi.fn()
    const onRetryPreview = vi.fn()
    const { container } = render(
      <SourcesHarness onNavigate={onNavigate} onRetryPreview={onRetryPreview} />
    )

    const desktopInventory = getDesktopInventory(container)

    expect(
      screen.getByRole("heading", { name: "Source Stewardship" })
    ).toBeVisible()
    expect(screen.getByText("Source Stewardship Inventory")).toBeVisible()
    expect(screen.getByText("Total Sources")).toBeVisible()
    expect(screen.getByText("Active Sources")).toBeVisible()
    expect(screen.getByText("Needs Review")).toBeVisible()
    expect(screen.getByText("Missing Validation")).toBeVisible()
    expect(screen.getByText("Clear filters")).toBeVisible()
    expect(
      within(desktopInventory).getByText("Charter of the United Nations")
    ).toBeVisible()
    expect(screen.getByText("Source details")).toBeVisible()
    expect(screen.getByText("Document Type")).toBeVisible()
    expect(screen.getByText("Last Updated")).toBeVisible()
    expect(screen.getByText("Steward")).toBeVisible()
    expect(screen.getAllByText("Reviewed").length).toBeGreaterThan(0)
    expect(screen.getByRole("button", { name: "Inspect Source" })).toBeVisible()
    expect(
      screen.getByRole("button", { name: "Upload Revision" })
    ).toBeVisible()
    expect(screen.getByRole("button", { name: "Run Validation" })).toBeVisible()
    expect(screen.getByLabelText("Rows per page")).toHaveValue("20")
  })

  it("filters the inventory and resets pagination back to the first page", async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    const onRetryPreview = vi.fn()
    const { container } = render(
      <SourcesHarness onNavigate={onNavigate} onRetryPreview={onRetryPreview} />
    )

    const desktopInventory = getDesktopInventory(container)

    await user.selectOptions(screen.getByLabelText("Rows per page"), "10")
    expect(desktopInventory).toHaveTextContent("Showing 1 to 10 of 12 sources")

    await user.click(
      within(desktopInventory).getByRole("button", { name: "Next page" })
    )
    expect(
      within(desktopInventory).getByText("Generated Source 7")
    ).toBeVisible()
    expect(
      within(desktopInventory).getByText("Generated Source 8")
    ).toBeVisible()
    expect(desktopInventory).toHaveTextContent("Showing 11 to 12 of 12 sources")

    await user.selectOptions(
      screen.getByLabelText("Validation Status"),
      "Warning"
    )
    expect(
      within(desktopInventory).getByText("South China Sea Arbitration Award")
    ).toBeVisible()
    expect(
      within(desktopInventory).queryByText("Generated Source 1")
    ).not.toBeInTheDocument()
    expect(desktopInventory).toHaveTextContent("Showing 1 to 1 of 1 sources")

    await user.type(
      screen.getByPlaceholderText("Search title, slug, alias, or provenance"),
      "South China Sea"
    )
    expect(
      within(desktopInventory).getByText("South China Sea Arbitration Award")
    ).toBeVisible()
    expect(
      within(desktopInventory).queryByText("Charter of the United Nations")
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Clear filters" }))
    expect(
      within(desktopInventory).getByText("Charter of the United Nations")
    ).toBeVisible()
    expect(desktopInventory).toHaveTextContent("Showing 1 to 10 of 12 sources")
  })

  it("auto-selects the first visible source when the selected row is filtered out", async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    const onRetryPreview = vi.fn()
    const { container } = render(
      <SourcesHarness
        initialSelectedSourceId="gg-src-generated-8"
        onNavigate={onNavigate}
        onRetryPreview={onRetryPreview}
      />
    )

    const desktopInventory = getDesktopInventory(container)

    await user.type(
      screen.getByPlaceholderText("Search title, slug, alias, or provenance"),
      "Charter of the United Nations"
    )

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Inspect Source" })
      ).toBeVisible()
    )
    expect(
      within(desktopInventory)
        .getByText("Charter of the United Nations")
        .closest("tr")
    ).toHaveAttribute("aria-selected", "true")
    expect(
      screen.getByText(
        "Charter of the United Nations summary for the selected-source rail."
      )
    ).toBeVisible()
  })

  it("renders preview loading and outage states", async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    const onRetryPreview = vi.fn()

    const loadingRender = render(
      <SourcesHarness
        previewMode="loading"
        onNavigate={onNavigate}
        onRetryPreview={onRetryPreview}
      />
    )
    expect(screen.getByText("Loading source details")).toBeVisible()
    loadingRender.unmount()

    render(
      <SourcesHarness
        previewMode="outage"
        onNavigate={onNavigate}
        onRetryPreview={onRetryPreview}
      />
    )

    expect(screen.getByText("The source preview could not load.")).toBeVisible()
    await user.click(
      screen.getByRole("button", { name: "Retry dashboard load" })
    )
    expect(onRetryPreview).toHaveBeenCalledTimes(1)
  })

  it("wires the rail actions and detail navigation", async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    const onRetryPreview = vi.fn()
    const { container } = render(
      <SourcesHarness
        previewMode="ready"
        onNavigate={onNavigate}
        onRetryPreview={onRetryPreview}
      />
    )
    const desktopInventory = getDesktopInventory(container)

    await user.click(screen.getByRole("button", { name: "Upload Revision" }))
    expect(onNavigate).toHaveBeenCalledWith("/maintainer/sources/new")
    await user.click(screen.getByRole("button", { name: "Run Validation" }))
    expect(onNavigate).toHaveBeenCalledWith(
      "/maintainer/validation?preset=validation-follow-up&sourceId=gg-src-un-charter-institutions"
    )

    await user.click(
      within(desktopInventory).getByText("Charter of the United Nations")
    )
    expect(onNavigate).not.toHaveBeenCalledWith(
      buildSourceDetailPath("gg-src-un-charter-institutions", null)
    )
    await user.click(screen.getByRole("button", { name: "Inspect Source" }))
    expect(onNavigate).toHaveBeenCalledWith(
      buildSourceDetailPath("gg-src-un-charter-institutions", null)
    )
    expect(onRetryPreview).not.toHaveBeenCalled()
  })
})
