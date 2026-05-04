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
  ingestionRuns: [],
  validationRuns: [],
  auditEvents: [],
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
  await page.route(/\/api\/admin\/sources\/.+$/, async (route) => {
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

    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: mutableDetail,
        error: null,
        meta: {},
      }),
    })
  })

  await page.goto("/maintainer")
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
  await expect(page.getByText("admin@example.test")).toBeVisible()
  await expect(page.getByText("Stewarded sources")).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Protected source upload" })
  ).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Charter of the United Nations" })
  ).toBeVisible()
  await expect(page.getByRole("navigation", { name: "Primary" })).toHaveCount(0)
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
