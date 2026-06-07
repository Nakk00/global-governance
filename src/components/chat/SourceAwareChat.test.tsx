import { cleanup, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { chapterNavigation } from "@/data/navigation"
import type { GroundedChatRequest, GroundedChatSuccess } from "@/types/chat"

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
    context?: GroundedChatRequest["context"]
  ) => Promise<GroundedChatSuccess> = vi
    .fn()
    .mockResolvedValue(answeredResponse),
  activeSectionId = "west-philippine-sea-dossier"
) {
  const user = userEvent.setup()

  renderWithNavigation(<SourceAwareChat chatClient={chatClient} />, {
    navigation: {
      activeSectionId,
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
    const { open, user } = openChat()
    const { input } = await open()

    await user.keyboard("{Escape}")

    await waitFor(() =>
      expect(
        screen.queryByRole("region", {
          name: "Source-aware academic chat",
        })
      ).not.toBeInTheDocument()
    )
    await waitFor(() =>
      expect(
        screen.getByRole("button", {
          name: "Open source-aware chat",
        })
      ).toHaveFocus()
    )
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

    await waitFor(() =>
      expect(chatClient).toHaveBeenCalledWith(
        "How does the Security Council show both coordination and enforcement limits?",
        {
          currentSectionId: "un-command-center",
          depthMode: "student",
        }
      )
    )
  })

  it("renders the redesigned assistant header, transcript seed, and trust footer", async () => {
    const { open } = openChat()
    const { panel, input } = await open()

    expect(within(panel).getByText("Governance Guide")).toBeVisible()
    expect(within(panel).getByText("Source-aware • Online")).toBeVisible()
    expect(
      within(panel).getByText(
        "Ask course questions, compare concepts, or verify sources from the chapter."
      )
    ).toBeVisible()
    expect(
      within(panel).getByText(/I can help explain institutions/i)
    ).toBeVisible()
    expect(within(panel).getByText("Suggested prompts")).toBeVisible()
    expect(within(panel).getByText("Grounded in course sources")).toBeVisible()
    expect(within(panel).getByText("Cite-verified")).toBeVisible()
    expect(input).toHaveAttribute("placeholder", "Ask about this chapter...")
  })

  it("renders exactly five prompt chips for each primary chapter and submits them with the active section context", async () => {
    for (const chapter of chapterNavigation) {
      const chatClient = vi.fn().mockResolvedValue(answeredResponse)
      const { open, user } = openChat(chatClient, chapter.id)
      const { panel } = await open()
      const promptGroup = within(panel).getByRole("group", {
        name: "Suggested prompts",
      })
      const promptButtons = within(promptGroup).getAllByRole("button")

      expect(promptButtons, chapter.id).toHaveLength(5)

      for (const [index, promptButton] of promptButtons.entries()) {
        await user.click(promptButton)

        await waitFor(() => expect(chatClient).toHaveBeenCalledTimes(index + 1))
        expect(chatClient.mock.calls[index]?.[0]).toEqual(expect.any(String))
        expect(chatClient.mock.calls[index]?.[0]?.length ?? 0).toBeGreaterThan(
          0
        )
        expect(chatClient.mock.calls[index]?.[1]).toEqual({
          currentSectionId: chapter.id,
          depthMode: "student",
        })
      }

      cleanup()
    }
  })

  it("expands the compact dock on hover and keyboard focus", async () => {
    const user = userEvent.setup()

    renderWithNavigation(<SourceAwareChat />, {
      navigation: {
        activeSectionId: "global-governance-overview",
      },
    })

    const trigger = screen.getByRole("button", {
      name: "Open source-aware chat",
    })

    expect(trigger).toHaveAttribute("data-expanded", "false")

    await user.hover(trigger)
    expect(trigger).toHaveAttribute("data-expanded", "true")

    await user.unhover(trigger)
    expect(trigger).toHaveAttribute("data-expanded", "false")

    await user.tab()
    expect(trigger).toHaveFocus()
    expect(trigger).toHaveAttribute("data-expanded", "true")
  })

  it("submits starter prompts on click, keeps shift-enter multiline, and forwards section context", async () => {
    const chatClient = vi.fn().mockResolvedValue(answeredResponse)
    const { open, user } = openChat(chatClient)
    const { panel, input } = await open()

    await user.click(
      within(panel).getByRole("button", { name: "Ruling and reality" })
    )

    await waitFor(() =>
      expect(chatClient).toHaveBeenCalledWith(
        "Connect the West Philippine Sea ruling to the gap between legal clarity and political enforcement.",
        {
          currentSectionId: "west-philippine-sea-dossier",
          depthMode: "student",
        }
      )
    )
    await waitFor(() => expect(input).toHaveValue(""))

    await user.type(
      input,
      "Connect the ruling to enforcement{Shift>}{Enter}{/Shift}with one example"
    )
    expect(input).toHaveValue(
      "Connect the ruling to enforcement\nwith one example"
    )

    await user.click(within(panel).getByRole("button", { name: "Ask" }))

    await waitFor(() =>
      expect(chatClient).toHaveBeenCalledWith(
        "Connect the ruling to enforcement\nwith one example",
        {
          currentSectionId: "west-philippine-sea-dossier",
          depthMode: "student",
        }
      )
    )
  })

  it("ignores an empty submission and submits a question with Enter", async () => {
    const chatClient = vi.fn().mockResolvedValue(answeredResponse)
    const { open, user } = openChat(chatClient)
    const { panel, input } = await open()

    await user.click(within(panel).getByRole("button", { name: "Ask" }))
    expect(chatClient).not.toHaveBeenCalled()

    await user.type(input, "How do institutions coordinate action?")
    await user.keyboard("{Enter}")

    await waitFor(() =>
      expect(chatClient).toHaveBeenCalledWith(
        "How do institutions coordinate action?",
        {
          currentSectionId: "west-philippine-sea-dossier",
          depthMode: "student",
        }
      )
    )
  })

  it("renders typed client failures without losing safe copy", async () => {
    const chatClient = vi.fn().mockRejectedValue({
      code: "grounded_chat_unavailable",
      message: "A safe typed message.",
    })
    const { open, user } = openChat(chatClient)
    const { panel, input } = await open()

    await user.type(input, "Explain the lesson.")
    await user.keyboard("{Enter}")

    await waitFor(() =>
      expect(within(panel).getByRole("alert")).toHaveTextContent(
        "A safe typed message."
      )
    )
  })

  it("renders generic safe copy for unknown client failures", async () => {
    const chatClient = vi.fn().mockRejectedValue("network unavailable")
    const { open, user } = openChat(chatClient)
    const { panel, input } = await open()

    await user.type(input, "Explain the lesson.")
    await user.keyboard("{Enter}")

    await waitFor(() =>
      expect(within(panel).getByRole("alert")).toHaveTextContent(
        /could not return a grounded answer/i
      )
    )
  })

  it("renders answered responses with expandable source support", async () => {
    const chatClient = vi.fn().mockResolvedValue(answeredResponse)
    const { open, user } = openChat(chatClient)
    const { panel, input } = await open()

    await user.type(input, "How does this course frame global governance?")
    await user.click(within(panel).getByRole("button", { name: "Ask" }))

    const submittedQuestion = within(panel).getByRole("article", {
      name: "Submitted question",
    })
    expect(
      within(submittedQuestion).getByText(
        "How does this course frame global governance?"
      )
    ).toBeVisible()

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

  it("lets the learner select expert depth and sends it with section context", async () => {
    const chatClient = vi.fn().mockResolvedValue(answeredResponse)
    const { open, user } = openChat(chatClient)
    const { panel, input } = await open()

    const expertControl = within(panel).getByRole("button", {
      name: "Expert depth",
    })
    await user.click(expertControl)
    await user.type(input, "Compare UN legitimacy and enforcement.")
    await user.click(within(panel).getByRole("button", { name: "Ask" }))

    expect(expertControl).toHaveAttribute("aria-pressed", "true")
    await waitFor(() =>
      expect(chatClient).toHaveBeenCalledWith(
        "Compare UN legitimacy and enforcement.",
        {
          currentSectionId: "west-philippine-sea-dossier",
          depthMode: "expert",
        }
      )
    )
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

  it("renders refusal recovery and submits a section-safe course prompt", async () => {
    const refusedResponse = {
      state: "refused",
      code: "off_topic",
      message:
        "I can only help with this Global Governance course and its approved materials.",
      nextStep:
        "Try a question about the UN, global governance, or the West Philippine Sea case.",
    } satisfies GroundedChatSuccess
    const chatClient = vi
      .fn()
      .mockResolvedValueOnce(refusedResponse)
      .mockResolvedValueOnce(answeredResponse)
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

    await waitFor(() =>
      expect(chatClient).toHaveBeenCalledWith(
        "Connect the West Philippine Sea ruling to the gap between legal clarity and political enforcement.",
        {
          currentSectionId: "west-philippine-sea-dossier",
          depthMode: "student",
        }
      )
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

  it("renders fallback guidance and submits a suggested prompt on click", async () => {
    const fallbackResponse = {
      state: "fallback",
      message: "The assistant could not complete a grounded answer right now.",
      nextStep: "Continue with the lesson or try a course question.",
      suggestedPrompts: ["What is global governance?"],
      fallbackSource: {
        label: "Current lesson summary",
      },
    } satisfies GroundedChatSuccess
    const chatClient = vi
      .fn()
      .mockResolvedValueOnce(fallbackResponse)
      .mockResolvedValueOnce(answeredResponse)
    const { open, user } = openChat(chatClient)
    const { panel, input } = await open()

    await user.type(input, "Explain the lesson.")
    await user.click(within(panel).getByRole("button", { name: "Ask" }))

    await waitFor(() =>
      expect(
        within(panel).getByText("Grounded answer unavailable")
      ).toBeVisible()
    )
    expect(within(panel).getByText("Current lesson summary")).toBeVisible()

    await user.click(
      within(panel).getByRole("button", {
        name: "What is global governance?",
      })
    )

    await waitFor(() =>
      expect(chatClient).toHaveBeenCalledWith("What is global governance?", {
        currentSectionId: "west-philippine-sea-dossier",
        depthMode: "student",
      })
    )
    expect(input).toHaveValue("")
    await waitFor(() => expect(input).toHaveFocus())
  })

  it("hides the launcher while open, keeps the panel contained, caps multiline composer height, and restores composer focus after submit", async () => {
    const chatClient = vi.fn().mockResolvedValue(answeredResponse)
    const { open, user } = openChat(chatClient)
    const { panel, input } = await open()

    expect(
      screen.queryByRole("button", { name: "Open source-aware chat" })
    ).not.toBeInTheDocument()
    expect(panel.className).toContain("top-3")
    expect(panel.className).toContain("bottom-3")
    expect(panel.className).toContain("sm:top-6")
    expect(panel.className).toContain("sm:bottom-6")
    expect(panel.className).toContain("sm:max-w-[calc(100vw-3rem)]")

    Object.defineProperty(input, "scrollHeight", {
      configurable: true,
      get: () => 240,
    })

    await user.type(
      input,
      "Line one{Shift>}{Enter}{/Shift}Line two{Shift>}{Enter}{/Shift}Line three{Shift>}{Enter}{/Shift}Line four"
    )

    await waitFor(() => {
      expect(input.style.height).toBe("144px")
      expect(input.style.overflowY).toBe("auto")
    })

    await user.click(within(panel).getByRole("button", { name: "Ask" }))

    await waitFor(() =>
      expect(chatClient).toHaveBeenCalledWith(
        "Line one\nLine two\nLine three\nLine four",
        {
          currentSectionId: "west-philippine-sea-dossier",
          depthMode: "student",
        }
      )
    )
    await waitFor(() => expect(input).toHaveFocus())
  })

  it("uses viewport top and bottom bounds instead of relying on a bottom offset", async () => {
    const { open } = openChat()
    const { panel } = await open()

    expect(panel.className).toContain("top-3")
    expect(panel.className).toContain("bottom-3")
    expect(panel.className).toContain("sm:top-6")
    expect(panel.className).toContain("sm:bottom-6")
    expect(panel.className).not.toContain("sm:bottom-20")
  })

  it("preserves an append-only transcript across answered, weak-support, refused, cooldown, fallback, and transport-error turns", async () => {
    const chatClient = vi
      .fn()
      .mockResolvedValueOnce(answeredResponse)
      .mockResolvedValueOnce({
        state: "weakSupport",
        message: "Approved materials offer only partial support.",
        nextStep: "Narrow the question to the current lesson.",
        grounding: {
          supportLevel: "weak",
          cue: "Limited support in approved materials",
        },
        citations: [],
      } satisfies GroundedChatSuccess)
      .mockResolvedValueOnce({
        state: "refused",
        code: "off_topic",
        message: "I can only help with Global Governance course questions.",
        nextStep: "Ask about the UN or the current lesson.",
      } satisfies GroundedChatSuccess)
      .mockResolvedValueOnce({
        state: "cooldown",
        code: "abuse_cooldown",
        message:
          "The assistant is temporarily limited after repeated off-topic prompts.",
        nextStep: "Wait briefly before trying a course-focused question.",
        retryAfterSeconds: 45,
      } satisfies GroundedChatSuccess)
      .mockResolvedValueOnce({
        state: "fallback",
        message:
          "The assistant could not complete a grounded answer right now.",
        nextStep: "Continue with the lesson or try a course question.",
        suggestedPrompts: ["What is global governance?"],
        fallbackSource: {
          label: "Current lesson summary",
        },
      } satisfies GroundedChatSuccess)
      .mockRejectedValueOnce({
        code: "grounded_chat_unavailable",
        message: "A safe transport recovery message.",
      })
    const { open, user } = openChat(chatClient)
    const { panel, input } = await open()

    async function ask(question: string) {
      await user.clear(input)
      await user.type(input, question)
      await user.click(within(panel).getByRole("button", { name: "Ask" }))
    }

    await ask("Question 1 answered")
    await waitFor(() =>
      expect(within(panel).getByText(answeredResponse.answer)).toBeVisible()
    )

    await ask("Question 2 weak support")
    await waitFor(() =>
      expect(
        within(panel).getByText(
          "Approved materials offer only partial support."
        )
      ).toBeVisible()
    )

    await ask("Question 3 refused")
    await waitFor(() =>
      expect(within(panel).getByText("Course boundary reached")).toBeVisible()
    )

    await ask("Question 4 cooldown")
    await waitFor(() =>
      expect(
        within(panel).getByText("Assistant temporarily limited")
      ).toBeVisible()
    )

    await ask("Question 5 fallback")
    await waitFor(() =>
      expect(
        within(panel).getByText("Grounded answer unavailable")
      ).toBeVisible()
    )

    await ask("Question 6 transport error")
    await waitFor(() =>
      expect(within(panel).getByRole("alert")).toHaveTextContent(
        "A safe transport recovery message."
      )
    )

    const submittedQuestions = within(panel).getAllByRole("article", {
      name: "Submitted question",
    })
    expect(submittedQuestions).toHaveLength(6)
    expect(within(panel).getByText("Question 1 answered")).toBeVisible()
    expect(within(panel).getByText("Question 2 weak support")).toBeVisible()
    expect(within(panel).getByText("Question 3 refused")).toBeVisible()
    expect(within(panel).getByText("Question 4 cooldown")).toBeVisible()
    expect(within(panel).getByText("Question 5 fallback")).toBeVisible()
    expect(within(panel).getByText("Question 6 transport error")).toBeVisible()
    expect(within(panel).getByText(answeredResponse.answer)).toBeVisible()
    expect(
      within(panel).getByText("Approved materials offer only partial support.")
    ).toBeVisible()
    expect(within(panel).getByText("Course boundary reached")).toBeVisible()
    expect(
      within(panel).getByText("Assistant temporarily limited")
    ).toBeVisible()
    expect(within(panel).getByText("Grounded answer unavailable")).toBeVisible()
  }, 10_000)
})
