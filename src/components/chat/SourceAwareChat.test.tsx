import { screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import type { GroundedChatSuccess } from "@/types/chat"

import { SourceAwareChat } from "./SourceAwareChat"

import { renderWithNavigation } from "../../../tests/support/render-with-navigation"

const answeredResponse: GroundedChatSuccess = {
  state: "answered",
  answer:
    "Global governance coordinates rules and institutions without becoming a world government.",
  grounding: {
    supportLevel: "strong",
    cue: "Grounded with 1 approved source",
  },
  citations: [
    {
      sourceId: "gg-src-global-governance-course-frame",
      title: "Global Governance Course Frame",
      shortTitle: "Course frame",
      sourceType: "course",
      detail:
        "The course frame distinguishes global governance from world government.",
    },
  ],
}

function openChat(
  chatClient: (
    question: string,
    context?: { currentSectionId?: string }
  ) => Promise<GroundedChatSuccess> = vi
    .fn()
    .mockResolvedValue(answeredResponse)
) {
  const user = userEvent.setup()

  renderWithNavigation(<SourceAwareChat chatClient={chatClient} />, {
    navigation: {
      activeSectionId: "west-philippine-sea-dossier",
    },
  })

  const trigger = screen.getByRole("button", {
    name: "Open source-aware chat",
  })

  return {
    user,
    trigger,
    open: async () => {
      await user.click(trigger)

      const panel = screen.getByRole("region", {
        name: "Source-aware academic chat",
      })
      const input = within(panel).getByRole("textbox", {
        name: "Course question",
      })

      await waitFor(() => expect(input).toHaveFocus())

      return { panel, input }
    },
  }
}

describe("SourceAwareChat", () => {
  it("opens, closes on escape, and restores trigger focus", async () => {
    const { open, trigger, user } = openChat()
    const { input } = await open()

    await user.keyboard("{Escape}")

    await waitFor(() =>
      expect(
        screen.queryByRole("region", {
          name: "Source-aware academic chat",
        })
      ).not.toBeInTheDocument()
    )
    await waitFor(() => expect(trigger).toHaveFocus())
    expect(input).not.toBeInTheDocument()
  })

  it("shows the floating dock on the system under pressure chapter", async () => {
    const user = userEvent.setup()
    const chatClient = vi.fn().mockResolvedValue(answeredResponse)

    renderWithNavigation(<SourceAwareChat chatClient={chatClient} />, {
      navigation: {
        activeSectionId: "un-command-center",
      },
    })

    const trigger = screen.getByRole("button", {
      name: "Open source-aware chat",
    })
    expect(trigger).toBeVisible()

    await user.click(trigger)

    const panel = screen.getByRole("region", {
      name: "Source-aware academic chat",
    })

    await user.click(
      within(panel).getByRole("button", { name: "Security Council limits" })
    )
    await user.click(within(panel).getByRole("button", { name: "Ask" }))

    await waitFor(() =>
      expect(chatClient).toHaveBeenCalledWith(
        "How does the Security Council show both coordination and enforcement limits?",
        {
          currentSectionId: "un-command-center",
        }
      )
    )
  })

  it("loads starter prompts into the composer, keeps shift-enter multiline, and forwards section context", async () => {
    const chatClient = vi.fn().mockResolvedValue(answeredResponse)
    const { open, user } = openChat(chatClient)
    const { panel, input } = await open()

    await user.click(
      within(panel).getByRole("button", { name: "Ruling and reality" })
    )
    expect(input).toHaveValue(
      "Connect the West Philippine Sea ruling to the gap between legal clarity and political enforcement."
    )

    await user.type(input, "{Shift>}{Enter}{/Shift}with one example")
    expect(input).toHaveValue(
      "Connect the West Philippine Sea ruling to the gap between legal clarity and political enforcement.\nwith one example"
    )

    await user.click(within(panel).getByRole("button", { name: "Ask" }))

    await waitFor(() =>
      expect(chatClient).toHaveBeenCalledWith(
        "Connect the West Philippine Sea ruling to the gap between legal clarity and political enforcement.\nwith one example",
        {
          currentSectionId: "west-philippine-sea-dossier",
        }
      )
    )
  })

  it("renders answered responses with expandable source support", async () => {
    const chatClient = vi.fn().mockResolvedValue(answeredResponse)
    const { open, user } = openChat(chatClient)
    const { panel, input } = await open()

    await user.type(input, "How does this course frame global governance?")
    await user.click(within(panel).getByRole("button", { name: "Ask" }))

    await waitFor(() =>
      expect(within(panel).getByText(answeredResponse.answer)).toBeVisible()
    )

    const sourceChip = within(panel).getByRole("button", {
      name: /Course frame/i,
    })
    await user.click(sourceChip)

    expect(sourceChip).toHaveAttribute("aria-expanded", "true")
    await waitFor(() =>
      expect(
        within(panel).getByText(/gg-src-global-governance-course-frame/i)
      ).toBeVisible()
    )
    expect(
      within(panel).getByText(/distinguishes global governance/i)
    ).toBeVisible()
  })

  it("renders weak-support guidance without answer citations", async () => {
    const chatClient = vi.fn().mockResolvedValue({
      state: "weakSupport",
      message:
        "The approved materials do not support a confident answer to that question.",
      nextStep:
        "Reframe the question around the course sources, the UN, or the West Philippine Sea dossier.",
      grounding: {
        supportLevel: "weak",
        cue: "Limited support in approved materials",
      },
      citations: [],
    } satisfies GroundedChatSuccess)
    const { open, user } = openChat(chatClient)
    const { panel, input } = await open()

    await user.type(input, "What should tomorrow's Security Council vote be?")
    await user.click(within(panel).getByRole("button", { name: "Ask" }))

    await waitFor(() =>
      expect(
        within(panel).getByText("Limited support in approved materials")
      ).toBeVisible()
    )
    expect(
      within(panel).getByText(/do not support a confident answer/i)
    ).toBeVisible()
    expect(within(panel).queryByText("Source support")).not.toBeInTheDocument()
  })

  it("renders refusal recovery and refocuses the composer", async () => {
    const chatClient = vi.fn().mockResolvedValue({
      state: "refused",
      code: "off_topic",
      message:
        "I can only help with this Global Governance course and its approved materials.",
      nextStep:
        "Try a question about the UN, global governance, or the West Philippine Sea case.",
    } satisfies GroundedChatSuccess)
    const { open, user } = openChat(chatClient)
    const { panel, input } = await open()

    await user.type(input, "Can you write a cooking recipe?")
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
  })

  it("renders cooldown recovery and refocuses the composer", async () => {
    const chatClient = vi.fn().mockResolvedValue({
      state: "cooldown",
      code: "abuse_cooldown",
      message:
        "The assistant is temporarily limited after repeated off-topic prompts.",
      nextStep: "Wait briefly before trying a course-focused question.",
      retryAfterSeconds: 60,
    } satisfies GroundedChatSuccess)
    const { open, user } = openChat(chatClient)
    const { panel, input } = await open()

    await user.type(input, "Help me buy a phone.")
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
