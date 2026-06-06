import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { ComponentProps } from "react"
import { vi } from "vitest"

import { SourceAwareChat } from "@/components/chat/SourceAwareChat"
import type { GroundedChatSuccess } from "@/types/chat"

import { renderWithNavigation } from "./render-with-navigation"

type SourceAwareChatProps = ComponentProps<typeof SourceAwareChat>
type SourceAwareChatClient = NonNullable<SourceAwareChatProps["chatClient"]>

export type SourceAwareChatDepthMode = "student" | "expert"

export type RenderSourceAwareChatOptions = {
  activeSectionId?: string
  depthMode?: SourceAwareChatDepthMode
  reducedMotion?: boolean
  response?: GroundedChatSuccess
  chatClient?: SourceAwareChatClient
  starterPrompts?: SourceAwareChatProps["starterPrompts"]
}

export const defaultGroundedChatResponse: GroundedChatSuccess = {
  state: "answered",
  answer:
    "Global governance coordinates rules and institutions without becoming a world government.",
  grounding: {
    supportLevel: "strong",
    cue: "Grounded answer",
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

export function mockReducedMotionPreference(matches = true) {
  const matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === "(prefers-reduced-motion: reduce)" ? matches : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: matchMedia,
  })

  return matchMedia
}

export function createSourceAwareChatClient(
  response: GroundedChatSuccess = defaultGroundedChatResponse
) {
  return vi.fn<SourceAwareChatClient>().mockResolvedValue(response)
}

export function renderSourceAwareChat({
  activeSectionId = "global-governance-overview",
  depthMode = "student",
  reducedMotion = false,
  response = defaultGroundedChatResponse,
  chatClient = createSourceAwareChatClient(response),
  starterPrompts,
}: RenderSourceAwareChatOptions = {}) {
  mockReducedMotionPreference(reducedMotion)
  const user = userEvent.setup()
  const result = renderWithNavigation(
    <SourceAwareChat chatClient={chatClient} starterPrompts={starterPrompts} />,
    {
      navigation: {
        activeSectionId,
      },
    }
  )

  return {
    ...result,
    activeSectionId,
    depthMode,
    user,
    chatClient,
    trigger: () =>
      screen.getByRole("button", {
        name: "Open source-aware chat",
      }),
    open: async () => {
      await user.click(
        screen.getByRole("button", {
          name: "Open source-aware chat",
        })
      )

      const panel = screen.getByRole("region", {
        name: "Source-aware academic chat",
      })
      const input = within(panel).getByRole("textbox", {
        name: "Course question",
      })

      return { panel, input }
    },
    ask: async (question: string) => {
      const panel = screen.getByRole("region", {
        name: "Source-aware academic chat",
      })
      const input = within(panel).getByRole("textbox", {
        name: "Course question",
      })

      await user.clear(input)
      await user.type(input, question)
      await user.click(within(panel).getByRole("button", { name: "Ask" }))
    },
    pressEscape: async () => {
      await user.keyboard("{Escape}")
    },
  }
}
