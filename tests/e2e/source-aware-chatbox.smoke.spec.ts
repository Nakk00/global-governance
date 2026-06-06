import { expect, test } from "@playwright/test"

import {
  expectContainedWithinViewport,
  expectNoHorizontalOverflow,
  expectTouchTarget,
} from "../playwright/home-page-helpers"

test("@smoke @layout source-aware chatbox opens as a contained right-side overlay", async ({
  page,
}) => {
  const viewport = { width: 1536, height: 1024 }

  await page.setViewportSize(viewport)
  await page.goto("/#hero-narrative-frame", { waitUntil: "domcontentloaded" })

  const trigger = page.getByRole("button", {
    name: "Open source-aware chat",
  })

  await expect(trigger).toBeVisible()
  await expectTouchTarget(trigger)
  await trigger.click()

  const panel = page.getByRole("region", {
    name: "Source-aware academic chat",
  })
  const input = panel.getByRole("textbox", { name: "Course question" })

  await expect(panel).toBeVisible()
  await expect(panel.getByText("Governance Guide")).toBeVisible()
  await expect(panel.getByText("Source-aware • Online")).toBeVisible()
  await expect(panel.getByText("Grounded in course sources")).toBeVisible()
  await expect(panel.getByText("Cite-verified")).toBeVisible()
  await expect(input).toBeFocused()
  await expectContainedWithinViewport(panel, viewport.width)
  await expectNoHorizontalOverflow(page)

  const panelBox = await panel.boundingBox()

  expect(panelBox).not.toBeNull()
  expect(panelBox!.x).toBeGreaterThan(viewport.width / 2)

  await page.keyboard.press("Escape")
  await expect(panel).toBeHidden()
  await expect(trigger).toBeFocused()
})

test("@smoke source-aware chat sends depth and renders grounded trust states", async ({
  page,
}) => {
  await page.route("**/api/chat", async (route) => {
    const request = route.request().postDataJSON() as {
      question: string
      context?: {
        currentSectionId?: string
        depthMode?: string
      }
    }
    const data =
      request.question === "Ask for weak support"
        ? {
            state: "weakSupport",
            message: "Approved materials offer only partial support.",
            nextStep: "Narrow the question to the current lesson.",
            grounding: {
              supportLevel: "weak",
              cue: "Limited support in approved materials",
            },
            citations: [],
          }
        : request.question === "Write a cooking recipe"
          ? {
              state: "refused",
              code: "off_topic",
              message: "I can help with Global Governance course questions.",
              nextStep: "Ask about the UN or the current lesson.",
            }
          : {
              state: "answered",
              answer:
                "The UN coordinates collective action through institutions and agreed rules.",
              grounding: {
                supportLevel: "strong",
                cue: "Grounded with 1 approved source",
              },
              citations: [
                {
                  sourceId: "gg-src-un-charter-institutions",
                  title: "Charter of the United Nations",
                  shortTitle: "UN Charter",
                  sourceType: "primary",
                  detail: "Supports the institutional explanation.",
                },
              ],
            }

    expect(request.context?.depthMode).toBe("expert")
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data }),
    })
  })

  await page.goto("/#un-command-center", { waitUntil: "domcontentloaded" })
  await page.getByRole("button", { name: "Open source-aware chat" }).click()

  const panel = page.getByRole("region", {
    name: "Source-aware academic chat",
  })
  const input = panel.getByRole("textbox", { name: "Course question" })

  await panel.getByRole("button", { name: "Expert depth" }).click()
  await input.fill("How does the UN coordinate collective action?")
  await panel.getByRole("button", { name: "Ask" }).click()
  await expect(panel.getByText("Grounded with 1 approved source")).toBeVisible()

  const source = panel.getByRole("button", { name: /UN Charter/i })
  await source.click()
  await expect(panel.getByText("Charter of the United Nations")).toBeVisible()

  await input.fill("Ask for weak support")
  await panel.getByRole("button", { name: "Ask" }).click()
  await expect(
    panel.getByText("Limited support in approved materials")
  ).toBeVisible()

  await input.fill("Write a cooking recipe")
  await panel.getByRole("button", { name: "Ask" }).click()
  await expect(panel.getByText("Course boundary reached")).toBeVisible()
})
