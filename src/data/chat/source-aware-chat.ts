export type SourceAwareChatStarterPrompt = {
  id: string
  label: string
  prompt: string
}

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
