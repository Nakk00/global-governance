import { screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import {
  chatBoundaryCases,
  protectionValidationCases,
} from "../../../tests/support/chat-boundary-cases"
import { renderWithNavigation } from "../../../tests/support/render-with-navigation"
import {
  cooldownChatResponse,
  refusedChatResponse,
  weakSupportChatResponse,
} from "../../../tests/support/msw/fixtures"
import { mockChatResponsesByQuestion } from "../../../tests/support/msw/handlers"
import { server } from "../../../tests/support/msw/server"

import { SourceAwareChat } from "./SourceAwareChat"

const weakSupportCase = chatBoundaryCases.find(
  (testCase) => testCase.id === "weak-support-speculative-vote"
)
const refusedCase = chatBoundaryCases.find(
  (testCase) => testCase.id === "refused-cooking-recipe"
)
const abuseCooldownCase = protectionValidationCases.find(
  (testCase) => testCase.id === "abuse-cooldown"
)

if (!weakSupportCase || !refusedCase || !abuseCooldownCase) {
  throw new Error("Expected chat boundary fallback fixtures to be available.")
}

function openChat() {
  const user = userEvent.setup()

  renderWithNavigation(<SourceAwareChat />, {
    navigation: {
      activeSectionId: "hero-narrative-frame",
    },
  })

  return {
    user,
    trigger: screen.getByRole("button", { name: "Open source-aware chat" }),
  }
}

describe("SourceAwareChat MSW integration", () => {
  it("renders fallback states from the real request path and keeps recovery actions usable", async () => {
    server.use(
      ...mockChatResponsesByQuestion({
        [weakSupportCase.prompt]: weakSupportChatResponse,
        [refusedCase.prompt]: refusedChatResponse,
        [abuseCooldownCase.prompts.at(-1)!]: cooldownChatResponse,
      })
    )

    const { user, trigger } = openChat()
    await user.click(trigger)

    const panel = screen.getByRole("region", {
      name: "Source-aware academic chat",
    })
    const input = within(panel).getByRole("textbox", {
      name: "Course question",
    })

    await user.type(input, weakSupportCase.prompt)
    await user.click(within(panel).getByRole("button", { name: "Ask" }))

    await waitFor(() =>
      expect(
        within(panel).getByText("Limited support in approved materials")
      ).toBeVisible()
    )
    expect(
      within(panel).getByText(/do not support a confident answer/i)
    ).toBeVisible()

    await user.clear(input)
    await user.type(input, refusedCase.prompt)
    await user.click(within(panel).getByRole("button", { name: "Ask" }))

    await waitFor(() =>
      expect(within(panel).getByText("Course boundary reached")).toBeVisible()
    )

    await user.click(
      within(panel).getByRole("button", {
        name: "Rephrase a course question",
      })
    )
    await waitFor(() => expect(input).toHaveFocus())

    await user.clear(input)
    await user.type(input, abuseCooldownCase.prompts.at(-1)!)
    await user.click(within(panel).getByRole("button", { name: "Ask" }))

    await waitFor(() =>
      expect(
        within(panel).getByText("Assistant temporarily limited")
      ).toBeVisible()
    )
    expect(within(panel).getByText(/Retry in about 60 seconds/i)).toBeVisible()

    await user.click(
      within(panel).getByRole("button", { name: "Try again shortly" })
    )
    await waitFor(() => expect(input).toHaveFocus())
  })
})
