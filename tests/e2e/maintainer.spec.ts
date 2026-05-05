import { expect, type Page, test } from "@playwright/test"

const session = {
  accessToken: "maintainer-token",
  expiresAt: 1893456000,
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
  ingestionRuns: [
    {
      eventId: "ingest-1",
      outcome: "succeeded",
      origin: "admin@example.test",
      occurredAt: "2026-05-05T00:00:00Z",
      summary: "UN Charter source ingested into the retrieval index.",
    },
  ],
  validationRuns: [
    {
      eventId: "validation-1",
      outcome: "warning",
      origin: "admin@example.test",
      occurredAt: "2026-05-05T00:01:00Z",
      summary: "Demo readiness validation completed with weak support.",
    },
  ],
  auditEvents: [
    {
      eventId: "audit-1",
      outcome: "recorded",
      origin: "admin@example.test",
      occurredAt: "2026-05-05T00:02:00Z",
      summary: "Lifecycle action recorded for stewarded source.",
    },
  ],
}

const sourceDetail = {
  ...dashboard.sources[0],
  summary:
    "Defines the UN purposes, organs, member obligations, and coordination role.",
  metadata: {
    canonicalSourceId: "gg-src-un-charter-institutions",
    sourceType: "primary",
  },
  approvalLineage: [],
  ingestionProvenance: [],
  validationHistory: [],
  auditTrail: [],
}

const chunkInspection = {
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
      contentPreview: "The UN Charter establishes the organs and obligations.",
      embeddingPresent: true,
      activeState: "ready",
      pageNumber: 1,
      heading: "Preamble",
      metadata: {},
    },
  ],
  partialData: [],
}

const citationInspection = {
  anchor: chunkInspection.anchor,
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
}

const chunkDetail = {
  ...chunkInspection.chunks[0],
  content: "The UN Charter establishes the organs and obligations.",
  linkedCitationIds: ["ref-un-charter"],
  createdAt: "2026-05-05T00:00:00Z",
  updatedAt: "2026-05-05T00:00:00Z",
}

const citationDetail = {
  ...citationInspection.citations[0],
  sourceTitle: "Charter of the United Nations",
  sourcePath: "bootstrap-approved-source-bundle",
  copyableLabel: "UN Charter",
  linkedChunks: chunkInspection.chunks,
}

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
}

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
}

async function seedSession(page: Page) {
  await page.addInitScript((storedSession) => {
    window.localStorage.setItem(
      "global-governance-maintainer-session",
      JSON.stringify(storedSession)
    )
  }, session)
}

async function mockMaintainerApi(page: Page) {
  await page.route("**/api/admin/me", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {
          userId: "user-123",
          email: "admin@example.test",
          role: "admin",
          isActive: true,
        },
        error: null,
        meta: {},
      }),
    })
  })
  await page.route("**/api/admin/sources", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: dashboard,
        error: null,
        meta: {},
      }),
    })
  })
  await page.route("**/api/admin/validation-sets", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: validationSets,
        error: null,
        meta: {},
      }),
    })
  })
  await page.route("**/api/admin/validation-runs", async (route) => {
    await route.fulfill({
      status: route.request().method() === "POST" ? 201 : 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data:
          route.request().method() === "POST"
            ? validationRun
            : { runs: [validationRun] },
        error: null,
        meta: {},
      }),
    })
  })
  await page.route("**/api/admin/validation-runs/*", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: validationRun,
        error: null,
        meta: {},
      }),
    })
  })
  await page.route(/\/api\/admin\/sources\/.+$/, async (route) => {
    const url = route.request().url()
    if (url.endsWith("/chunks")) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: chunkInspection,
          error: null,
          meta: {},
        }),
      })
      return
    }
    if (url.endsWith("/citations")) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: citationInspection,
          error: null,
          meta: {},
        }),
      })
      return
    }
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: sourceDetail,
        error: null,
        meta: {},
      }),
    })
  })
  await page.route("**/api/admin/chunks/*", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: chunkDetail,
        error: null,
        meta: {},
      }),
    })
  })
  await page.route("**/api/admin/citations/*", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: citationDetail,
        error: null,
        meta: {},
      }),
    })
  })
}

test("@smoke maintainer mutation flow keeps upload and archive inside the private boundary", async ({
  page,
}) => {
  await seedSession(page)

  const mutableDashboard = structuredClone(dashboard)
  const mutableDetail = structuredClone(sourceDetail)

  await page.route("**/api/admin/me", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {
          userId: "user-123",
          email: "admin@example.test",
          role: "admin",
          isActive: true,
        },
        error: null,
        meta: {},
      }),
    })
  })
  await page.route("**/api/admin/sources", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: mutableDashboard,
        error: null,
        meta: {},
      }),
    })
  })
  await page.route("**/api/admin/sources/*", async (route) => {
    const url = route.request().url()
    const method = route.request().method()

    if (url.endsWith("/sources/upload") && method === "POST") {
      mutableDashboard.sources.push({
        sourceId: "gg-src-new-policy-note",
        title: "New Policy Note",
        sourceType: "reference",
        lifecycleState: "draft",
        aliases: [],
        usageScope: ["ingestion"],
        provenance: "Maintainer upload",
        ingestionReadiness: "partial",
        latestValidationOutcome: null,
        latestIngestJob: null,
        partialData: [],
      })
      mutableDashboard.overview.sourceCount = 3
      mutableDashboard.overview.draftSourceCount = 1

      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            source: {
              ...mutableDetail,
              sourceId: "gg-src-new-policy-note",
              title: "New Policy Note",
              lifecycleState: "draft",
              provenance: "Maintainer upload",
              usageScope: ["ingestion"],
            },
            dashboard: mutableDashboard,
          },
          error: null,
          meta: {},
        }),
      })
      return
    }

    if (
      url.endsWith("/sources/gg-src-un-charter-institutions/archive") &&
      method === "POST"
    ) {
      mutableDashboard.sources[0] = {
        ...mutableDashboard.sources[0],
        lifecycleState: "archived",
      }
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            source: {
              ...mutableDetail,
              lifecycleState: "archived",
            },
            dashboard: mutableDashboard,
          },
          error: null,
          meta: {},
        }),
      })
      return
    }

    const detail = url.includes("gg-src-new-policy-note")
      ? {
          ...mutableDetail,
          sourceId: "gg-src-new-policy-note",
          title: "New Policy Note",
          lifecycleState: "draft",
          provenance: "Maintainer upload",
          usageScope: ["ingestion"],
        }
      : mutableDetail

    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: detail,
        error: null,
        meta: {},
      }),
    })
  })

  await page.goto("/maintainer/sources/new")
  await page.getByLabel("Source ID").fill("gg-src-new-policy-note")
  await page.getByLabel("Title").fill("New Policy Note")
  await page.getByLabel("Provenance").fill("Maintainer upload")
  await page
    .getByLabel("Summary")
    .fill("A newly uploaded policy note for the private dashboard.")
  await page.getByLabel("Source file").setInputFiles({
    name: "policy-note.md",
    mimeType: "text/markdown",
    buffer: Buffer.from("# Policy note"),
  })
  await page.getByRole("button", { name: "Upload draft" }).click()

  await expect(
    page.getByText("Source uploaded as draft and inactive.")
  ).toBeVisible()
  await expect(page.locator("main")).toContainText("New Policy Note")

  await page.getByRole("button", { name: "Archive" }).click()
  await expect(
    page.getByRole("alertdialog", { name: "Archive source" })
  ).toBeVisible()
  await page.getByRole("button", { name: "Cancel" }).click()
  await expect(
    page.getByRole("alertdialog", { name: "Archive source" })
  ).toHaveCount(0)
})

test("@smoke maintainer direct load resolves the private dashboard without public navigation", async ({
  page,
}) => {
  await seedSession(page)
  await mockMaintainerApi(page)

  await page.goto("/maintainer")
  await expect(
    page.getByRole("heading", { name: "Maintainer dashboard" })
  ).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Maintainer overview" })
  ).toBeVisible()
  await expect(
    page.getByText("admin@example.test", { exact: true })
  ).toBeVisible()
  await expect(page.getByText("Stewarded sources")).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Protected source upload" })
  ).toHaveCount(0)
  await expect(
    page.getByRole("heading", { name: "Charter of the United Nations" })
  ).toHaveCount(0)
  await expect(page.getByRole("navigation", { name: "Primary" })).toHaveCount(0)
})

test("@smoke maintainer-like public paths are not captured by the private route", async ({
  page,
}) => {
  await page.goto("/maintainer-old")

  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Maintainer Sign In" })
  ).toHaveCount(0)
})

test("@smoke maintainer sources route shows inventory and opens source detail", async ({
  page,
}) => {
  await seedSession(page)
  await mockMaintainerApi(page)

  await page.goto("/maintainer/sources")
  await expect(
    page.getByRole("heading", { name: "Source stewardship inventory" })
  ).toBeVisible()
  await expect(page.getByLabel("Source ID")).toHaveCount(0)
  await page.getByRole("button", { name: "Inspect" }).first().click()
  await expect(page).toHaveURL(
    /\/maintainer\/sources\/gg-src-un-charter-institutions$/
  )
  await expect(page.locator("#source-detail-page-heading")).toHaveText(
    "Charter of the United Nations"
  )
  await expect(page.getByRole("navigation", { name: "Primary" })).toHaveCount(0)
})

test("@smoke maintainer retrieval inspection opens chunks and citations without public exposure", async ({
  page,
}) => {
  await seedSession(page)
  await mockMaintainerApi(page)
  await page.setViewportSize({ width: 390, height: 844 })

  await page.goto("/maintainer/sources/gg-src-un-charter-institutions")
  await page.getByRole("tab", { name: "Chunks" }).click()
  await expect(page.getByText("doc-un-charter-v2")).toBeVisible()
  await expect(
    page
      .getByText("The UN Charter establishes the organs and obligations.")
      .first()
  ).toBeVisible()
  await page.getByRole("button", { name: "Inspect chunk" }).click()
  await expect(
    page.getByRole("dialog", { name: "Retrieval evidence detail" })
  ).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(
    page.getByRole("dialog", { name: "Retrieval evidence detail" })
  ).toHaveCount(0)

  await page.getByRole("tab", { name: "Citations" }).click()
  await expect(page.getByText("UN Charter").first()).toBeVisible()
  await page.getByRole("button", { name: "Inspect citation" }).click()
  await expect(
    page.getByRole("button", { name: "Copy citation label" })
  ).toBeVisible()
  await expect(page.getByRole("navigation", { name: "Primary" })).toHaveCount(0)
  const mainScrollWidth = await page
    .locator("main")
    .evaluate((element) => element.scrollWidth)
  expect(mainScrollWidth).toBeLessThanOrEqual(390)
})

test("@smoke maintainer operations route separates records from source detail", async ({
  page,
}) => {
  await seedSession(page)
  await mockMaintainerApi(page)

  await page.goto("/maintainer/operations")
  await expect(
    page.getByRole("heading", { name: "Ingestion and audit records" })
  ).toBeVisible()
  await expect(page.getByText("UN Charter source ingested")).toBeVisible()
  await expect(page.getByText("Demo readiness validation")).toBeVisible()
  await expect(page.getByText("Lifecycle action recorded")).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Protected source upload" })
  ).toHaveCount(0)
  await expect(page.getByRole("navigation", { name: "Primary" })).toHaveCount(0)
})

test("@smoke maintainer validation workbench runs and inspects readiness checks", async ({
  page,
}) => {
  await seedSession(page)
  await mockMaintainerApi(page)
  await page.setViewportSize({ width: 390, height: 844 })

  await page.goto("/maintainer/validation")
  await expect(
    page.getByRole("heading", { name: "Validation workbench" })
  ).toBeVisible()
  await expect(page.getByLabel("Validation set")).toHaveValue(
    "demo-readiness-v1"
  )
  await expect(page.getByText("weakSupport")).toBeVisible()
  await page.getByRole("button", { name: "Run validation" }).click()
  await expect(
    page.getByText("Validation run created as a new immutable history record.")
  ).toBeVisible()
  await page.getByRole("button", { name: "Inspect result" }).click()
  await expect(
    page.getByRole("dialog", { name: "Validation result detail" })
  ).toBeVisible()
  await expect(
    page.getByText("Expected grounded answer matched.")
  ).toBeVisible()
  await expect(page.getByRole("navigation", { name: "Primary" })).toHaveCount(0)
  const mainScrollWidth = await page
    .locator("main")
    .evaluate((element) => element.scrollWidth)
  expect(mainScrollWidth).toBeLessThanOrEqual(390)
})

test("@smoke maintainer route keeps auth-gate fallbacks visible", async ({
  page,
}) => {
  await page.goto("/maintainer")
  await expect(
    page.getByRole("heading", { name: "Maintainer Sign In" })
  ).toBeVisible()
  await expect(page.getByText("Global Governance")).toBeVisible()
  await expect(page.getByText("Authorized maintainers only")).toBeVisible()
  await expect(page.getByText("Forgot password?")).toBeVisible()
  await expect(page.getByRole("navigation", { name: "Primary" })).toHaveCount(0)

  const expiredPage = await page.context().newPage()
  await seedSession(expiredPage)
  await expiredPage.route("**/api/admin/me", async (route) => {
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({
        success: false,
        data: null,
        error: {
          code: "admin_auth_invalid",
          message: "Use a valid Supabase Auth bearer token.",
          status: 401,
        },
        meta: {},
      }),
    })
  })
  await expiredPage.goto("/maintainer")
  await expect(
    expiredPage.getByRole("heading", { name: "Session expired" })
  ).toBeVisible()
  await expiredPage.close()
})
