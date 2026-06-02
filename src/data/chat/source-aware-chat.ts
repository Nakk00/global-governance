export type SourceAwareChatStarterPrompt = {
  id: string
  label: string
  prompt: string
}

type SourceAwareChatSectionId =
  | "hero-narrative-frame"
  | "global-governance-overview"
  | "un-command-center"
  | "governance-limits"
  | "west-philippine-sea-dossier"
  | "conclusion-references"

export type SourceAwareChatStarterPromptState =
  | {
      status: "available"
      prompts: SourceAwareChatStarterPrompt[]
    }
  | {
      status: "fallback"
      message: string
    }

export const sourceAwareChatStarterPrompts = [
  {
    id: "governance-vs-government",
    label: "Governance vs. government",
    prompt:
      "Explain the difference between global governance and world government using the course examples.",
  },
  {
    id: "un-limits",
    label: "UN limits",
    prompt:
      "Where does the UN help coordinate states, and where do its enforcement limits show up?",
  },
  {
    id: "wps-ruling-reality",
    label: "Ruling and reality",
    prompt:
      "Connect the West Philippine Sea ruling to the gap between legal clarity and political enforcement.",
  },
  {
    id: "source-check",
    label: "Source check",
    prompt:
      "Which approved sources should I inspect before making a claim about this chapter?",
  },
] satisfies SourceAwareChatStarterPrompt[]

const starterPromptsBySection: Partial<
  Record<SourceAwareChatSectionId, SourceAwareChatStarterPrompt[]>
> = {
  "hero-narrative-frame": [
    sourceAwareChatStarterPrompts[0],
    {
      id: "institutions-without-world-government",
      label: "Institutions",
      prompt:
        "How do institutions coordinate global governance without becoming a world government?",
    },
    {
      id: "un-coordination-role",
      label: "UN role",
      prompt:
        "How does the UN help coordinate states inside the global governance system?",
    },
    sourceAwareChatStarterPrompts[3],
  ],
  "global-governance-overview": [
    sourceAwareChatStarterPrompts[0],
    {
      id: "institutions-without-world-government",
      label: "Institutions",
      prompt:
        "How do institutions coordinate global governance without becoming a world government?",
    },
    {
      id: "coordination-tools",
      label: "Coordination tools",
      prompt:
        "Which institutions help coordinate global governance across states?",
    },
    sourceAwareChatStarterPrompts[3],
  ],
  "un-command-center": [
    {
      id: "un-coordination-role",
      label: "UN role",
      prompt:
        "How does the UN help coordinate states inside the global governance system?",
    },
    {
      id: "security-council-limits",
      label: "Security Council limits",
      prompt:
        "How does the Security Council show both coordination and enforcement limits?",
    },
    {
      id: "institutions-and-limits",
      label: "Institutions and limits",
      prompt:
        "Why can institutions matter even when enforcement depends on politics and consent?",
    },
    sourceAwareChatStarterPrompts[3],
  ],
  "governance-limits": [
    {
      id: "security-council-limits",
      label: "Security Council limits",
      prompt:
        "How does the Security Council show the limits of coordination and enforcement?",
    },
    {
      id: "institutions-and-limits",
      label: "Institutions and limits",
      prompt:
        "Why can institutions matter in global governance even when enforcement depends on politics and consent?",
    },
    {
      id: "un-coordination-role",
      label: "UN role",
      prompt:
        "How does the UN coordinate states even when enforcement is limited?",
    },
    sourceAwareChatStarterPrompts[3],
  ],
  "west-philippine-sea-dossier": [
    sourceAwareChatStarterPrompts[2],
    {
      id: "wps-ruling-and-institutions",
      label: "Ruling and institutions",
      prompt:
        "How does the West Philippine Sea ruling test the limits of institutions and enforcement?",
    },
    {
      id: "wps-legal-clarity",
      label: "Legal clarity",
      prompt:
        "What does the West Philippine Sea ruling clarify, and what still depends on politics?",
    },
    sourceAwareChatStarterPrompts[3],
  ],
  "conclusion-references": sourceAwareChatStarterPrompts,
}

const fallbackMessage =
  "Starter prompts are temporarily unavailable. You can still type a course question about global governance, the UN, or the West Philippine Sea case."

function isStarterPrompt(
  value: unknown
): value is SourceAwareChatStarterPrompt {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const prompt = value as Record<string, unknown>

  return (
    typeof prompt.id === "string" &&
    prompt.id.trim().length > 0 &&
    typeof prompt.label === "string" &&
    prompt.label.trim().length > 0 &&
    typeof prompt.prompt === "string" &&
    prompt.prompt.trim().length > 0
  )
}

export function getSourceAwareChatStarterPrompts(
  currentSectionId?: string
): SourceAwareChatStarterPrompt[] {
  if (!currentSectionId) {
    return sourceAwareChatStarterPrompts
  }

  return (
    starterPromptsBySection[currentSectionId as SourceAwareChatSectionId] ??
    sourceAwareChatStarterPrompts
  )
}

export function resolveStarterPromptState(
  value: unknown
): SourceAwareChatStarterPromptState {
  if (!Array.isArray(value) || value.length === 0) {
    return {
      status: "fallback",
      message: fallbackMessage,
    }
  }

  const prompts = value.filter(isStarterPrompt).map((prompt) => ({
    id: prompt.id.trim(),
    label: prompt.label.trim(),
    prompt: prompt.prompt.trim(),
  }))

  if (prompts.length !== value.length || prompts.length === 0) {
    return {
      status: "fallback",
      message: fallbackMessage,
    }
  }

  return {
    status: "available",
    prompts,
  }
}
