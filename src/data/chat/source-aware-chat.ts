import type { ChatDepthMode } from "../../types/chat.ts"
import { chapterNavigation } from "../navigation.ts"

export type SourceAwareChatStarterPrompt = {
  id: string
  label: string
  prompt: string
  readiness: {
    classification: "answered" | "limitedSupport" | "boundaryRefusal"
    sourceIds: readonly string[]
    notes?: string
  }
  auditDepthMode?: ChatDepthMode
}

export type SourceAwareChatSectionId =
  | "hero-narrative-frame"
  | "global-governance-overview"
  | "un-command-center"
  | "governance-limits"
  | "west-philippine-sea-dossier"
  | "conclusion-references"

export type SourceAwareChatStarterPromptAuditEntry = {
  section: SourceAwareChatSectionId
  depthMode: ChatDepthMode
  id: string
  label: string
  prompt: string
  isPrimaryChapter: boolean
  readiness: SourceAwareChatStarterPrompt["readiness"]
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

const starterPromptTemplates = {
  institutionsWithoutWorldGovernment: {
    id: "institutions-without-world-government",
    label: "Institutions",
    prompt:
      "How do institutions coordinate global governance without becoming a world government?",
  },
  unCoordinationRole: {
    id: "un-coordination-role",
    label: "UN role",
    prompt:
      "How does the UN help coordinate states inside the global governance system?",
  },
  coordinationTools: {
    id: "coordination-tools",
    label: "Coordination tools",
    prompt:
      "Which institutions help coordinate global governance across states?",
  },
  governanceWorldGovernmentDistinction: {
    id: "governance-world-government-distinction",
    label: "Governance vs. government",
    prompt:
      "How does the course frame distinguish global governance from world government?",
  },
  heroSharedProblems: {
    id: "hero-shared-problems",
    label: "Shared problems",
    prompt:
      "Why do shared global problems require coordination in the course opening frame?",
  },
  heroStatesCentral: {
    id: "hero-states-central",
    label: "States remain central",
    prompt:
      "How does the course opening frame show states remain central but not alone?",
  },
  heroSourceCheck: {
    id: "hero-source-check",
    label: "Opening source",
    prompt:
      "Which approved course source grounds the opening frame about global governance?",
  },
  securityCouncilLimits: {
    id: "security-council-limits",
    label: "Security Council limits",
    prompt:
      "How does the Security Council show both coordination and enforcement limits?",
  },
  institutionsAndLimits: {
    id: "institutions-and-limits",
    label: "Institutions and limits",
    prompt:
      "Why can institutions matter even when enforcement depends on politics and consent?",
  },
  governanceLimitSourceCheck: {
    id: "governance-limit-source-check",
    label: "Source check",
    prompt:
      "Which approved source best shows why enforcement limits do not erase the value of institutions?",
  },
  securityCouncilBrief: {
    id: "security-council-brief",
    label: "UN Charter",
    prompt: "What does the UN Charter say about the Security Council?",
  },
  overviewInstitutionsCoordinationTools: {
    id: "overview-institutions-coordination-tools",
    label: "Coordination tools",
    prompt:
      "How do institutions and coordination tools help states govern shared problems?",
  },
  governanceRulesNorms: {
    id: "governance-rules-norms",
    label: "Rules and norms",
    prompt:
      "How do rules, norms, and expectations shape global governance in the course frame?",
  },
  worldGovernmentAbsence: {
    id: "world-government-absence",
    label: "No world government",
    prompt:
      "Why does the course say global governance operates without a single world government?",
  },
  unPurposesCoordination: {
    id: "un-purposes-coordination",
    label: "UN purposes",
    prompt: "What UN purposes explain its role in coordinating states?",
  },
  unLimitsAnswered: {
    id: "un-limits-answered",
    label: "UN limits",
    prompt:
      "Where does the UN help coordinate states, and where do its enforcement limits show up?",
  },
  generalAssemblyDiplomacy: {
    id: "general-assembly-diplomacy",
    label: "General Assembly",
    prompt: "How does the General Assembly support diplomacy and coordination?",
  },
  memberStateConsent: {
    id: "member-state-consent",
    label: "Member consent",
    prompt: "How do member-state consent and politics shape UN enforcement?",
  },
  unSourceCheck: {
    id: "un-source-check",
    label: "UN source",
    prompt:
      "Which UN Charter source should I inspect before making a claim about the UN chapter?",
  },
  wpsRulingReality: {
    id: "wps-ruling-reality",
    label: "Ruling and reality",
    prompt:
      "Connect the West Philippine Sea ruling to the gap between legal clarity and political enforcement.",
  },
  wpsMaritimeRights: {
    id: "wps-maritime-rights",
    label: "Maritime rights",
    prompt: "What did the ruling clarify about maritime rights?",
  },
  wpsRulingAndInstitutions: {
    id: "wps-ruling-and-institutions",
    label: "Ruling and institutions",
    prompt:
      "How does the West Philippine Sea ruling test the limits of institutions and enforcement?",
  },
  wpsPostAwardCompliance: {
    id: "wps-post-award-compliance",
    label: "Post-award gap",
    prompt:
      "How did post-award compliance show the gap between legal clarity and enforcement?",
  },
  wpsScarboroughStateBehavior: {
    id: "wps-scarborough-state-behavior",
    label: "Scarborough behavior",
    prompt:
      "How does the Scarborough record show state behavior around the dispute?",
  },
  wpsSourceCheck: {
    id: "wps-source-check",
    label: "Source check",
    prompt:
      "Which approved dossier sources best show the gap between the ruling and what happened after it?",
  },
} as const

const courseFrameSourceIds = ["gg-src-global-governance-course-frame"] as const
const unCharterSourceIds = ["gg-src-un-charter-institutions"] as const
const courseAndUnSourceIds = [
  "gg-src-global-governance-course-frame",
  "gg-src-un-charter-institutions",
] as const
const wpsLegalRealitySourceIds = [
  "gg-src-south-china-sea-award",
  "gg-src-wps-enforcement-gap-comparison",
  "gg-src-wps-political-reality-record",
] as const
const wpsMaritimeRightsSourceIds = [
  "gg-src-south-china-sea-award",
  "gg-src-philippines-arbitration-filing",
] as const
const wpsComplianceSourceIds = [
  "gg-src-post-award-compliance-record",
  "gg-src-wps-enforcement-gap-comparison",
] as const
const wpsScarboroughSourceIds = [
  "gg-src-scarborough-standoff-record",
  "gg-src-wps-political-reality-record",
] as const
const allWpsDossierSourceIds = [
  "gg-src-south-china-sea-award",
  "gg-src-philippines-arbitration-filing",
  "gg-src-post-award-compliance-record",
  "gg-src-scarborough-standoff-record",
  "gg-src-wps-enforcement-gap-comparison",
  "gg-src-wps-political-reality-record",
] as const

function withReadiness(
  prompt: (typeof starterPromptTemplates)[keyof typeof starterPromptTemplates],
  readiness: SourceAwareChatStarterPrompt["readiness"],
  auditDepthMode: ChatDepthMode = "student"
): SourceAwareChatStarterPrompt {
  return {
    ...prompt,
    readiness,
    auditDepthMode,
  }
}

function answeredPrompt(
  prompt: (typeof starterPromptTemplates)[keyof typeof starterPromptTemplates],
  sourceIds: readonly string[]
) {
  return withReadiness(prompt, {
    classification: "answered",
    sourceIds: [...sourceIds],
  })
}

function limitedPrompt(
  prompt: (typeof starterPromptTemplates)[keyof typeof starterPromptTemplates],
  sourceIds: readonly string[]
) {
  return withReadiness(prompt, {
    classification: "limitedSupport",
    sourceIds: [...sourceIds],
  })
}

const heroNarrativeFramePrompts = [
  answeredPrompt(
    starterPromptTemplates.governanceWorldGovernmentDistinction,
    courseFrameSourceIds
  ),
  answeredPrompt(
    starterPromptTemplates.institutionsWithoutWorldGovernment,
    courseFrameSourceIds
  ),
  answeredPrompt(
    starterPromptTemplates.heroSharedProblems,
    courseFrameSourceIds
  ),
  answeredPrompt(
    starterPromptTemplates.heroStatesCentral,
    courseFrameSourceIds
  ),
  answeredPrompt(starterPromptTemplates.heroSourceCheck, courseFrameSourceIds),
] satisfies SourceAwareChatStarterPrompt[]

const globalGovernanceOverviewPrompts = [
  answeredPrompt(
    starterPromptTemplates.governanceWorldGovernmentDistinction,
    courseFrameSourceIds
  ),
  answeredPrompt(starterPromptTemplates.unLimitsAnswered, courseAndUnSourceIds),
  answeredPrompt(
    starterPromptTemplates.overviewInstitutionsCoordinationTools,
    courseAndUnSourceIds
  ),
  answeredPrompt(
    starterPromptTemplates.governanceRulesNorms,
    courseFrameSourceIds
  ),
  answeredPrompt(
    starterPromptTemplates.worldGovernmentAbsence,
    courseFrameSourceIds
  ),
] satisfies SourceAwareChatStarterPrompt[]

const unCommandCenterPrompts = [
  answeredPrompt(
    starterPromptTemplates.unPurposesCoordination,
    unCharterSourceIds
  ),
  answeredPrompt(
    starterPromptTemplates.securityCouncilLimits,
    unCharterSourceIds
  ),
  answeredPrompt(
    starterPromptTemplates.generalAssemblyDiplomacy,
    unCharterSourceIds
  ),
  answeredPrompt(
    starterPromptTemplates.memberStateConsent,
    courseAndUnSourceIds
  ),
  answeredPrompt(starterPromptTemplates.unSourceCheck, unCharterSourceIds),
] satisfies SourceAwareChatStarterPrompt[]

const westPhilippineSeaDossierPrompts = [
  answeredPrompt(
    starterPromptTemplates.wpsRulingReality,
    wpsLegalRealitySourceIds
  ),
  answeredPrompt(
    starterPromptTemplates.wpsMaritimeRights,
    wpsMaritimeRightsSourceIds
  ),
  answeredPrompt(
    starterPromptTemplates.wpsPostAwardCompliance,
    wpsComplianceSourceIds
  ),
  answeredPrompt(
    starterPromptTemplates.wpsScarboroughStateBehavior,
    wpsScarboroughSourceIds
  ),
  answeredPrompt(starterPromptTemplates.wpsSourceCheck, allWpsDossierSourceIds),
] satisfies SourceAwareChatStarterPrompt[]

export const sourceAwareChatStarterPrompts = globalGovernanceOverviewPrompts

const starterPromptsBySection: Record<
  SourceAwareChatSectionId,
  SourceAwareChatStarterPrompt[]
> = {
  "hero-narrative-frame": heroNarrativeFramePrompts,
  "global-governance-overview": globalGovernanceOverviewPrompts,
  "un-command-center": unCommandCenterPrompts,
  "governance-limits": [
    limitedPrompt(
      starterPromptTemplates.governanceWorldGovernmentDistinction,
      courseFrameSourceIds
    ),
    limitedPrompt(
      starterPromptTemplates.securityCouncilLimits,
      unCharterSourceIds
    ),
  ],
  "west-philippine-sea-dossier": westPhilippineSeaDossierPrompts,
  "conclusion-references": [
    limitedPrompt(
      starterPromptTemplates.governanceWorldGovernmentDistinction,
      courseFrameSourceIds
    ),
    answeredPrompt(
      starterPromptTemplates.unLimitsAnswered,
      courseAndUnSourceIds
    ),
    limitedPrompt(
      starterPromptTemplates.wpsRulingReality,
      wpsLegalRealitySourceIds
    ),
  ],
}

const primarySourceAwareChatSectionIds = new Set(
  chapterNavigation.map((chapter) => chapter.id)
)

const fallbackMessage =
  "Starter prompts are temporarily unavailable. You can still type a course question about global governance, the UN, or the West Philippine Sea case."

function isStarterPrompt(
  value: unknown
): value is SourceAwareChatStarterPrompt {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const prompt = value as Record<string, unknown>

  const readiness = prompt.readiness as Record<string, unknown> | undefined

  return (
    typeof prompt.id === "string" &&
    prompt.id.trim().length > 0 &&
    typeof prompt.label === "string" &&
    prompt.label.trim().length > 0 &&
    typeof prompt.prompt === "string" &&
    prompt.prompt.trim().length > 0 &&
    typeof readiness === "object" &&
    readiness !== null &&
    ["answered", "limitedSupport", "boundaryRefusal"].includes(
      String(readiness.classification)
    ) &&
    Array.isArray(readiness.sourceIds) &&
    readiness.sourceIds.every(
      (sourceId) => typeof sourceId === "string" && sourceId.trim().length > 0
    )
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

export function getSourceAwareChatStarterPromptAuditEntries(): SourceAwareChatStarterPromptAuditEntry[] {
  return (
    Object.entries(starterPromptsBySection) as Array<
      [SourceAwareChatSectionId, SourceAwareChatStarterPrompt[]]
    >
  ).flatMap(([section, prompts]) =>
    prompts.map((prompt) => ({
      section,
      depthMode: prompt.auditDepthMode ?? "student",
      id: prompt.id,
      label: prompt.label,
      prompt: prompt.prompt,
      isPrimaryChapter: primarySourceAwareChatSectionIds.has(section),
      readiness: prompt.readiness,
    }))
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
    readiness: {
      classification: prompt.readiness.classification,
      sourceIds: prompt.readiness.sourceIds.map((sourceId) => sourceId.trim()),
      ...(prompt.readiness.notes
        ? { notes: prompt.readiness.notes.trim() }
        : {}),
    },
    ...(prompt.auditDepthMode ? { auditDepthMode: prompt.auditDepthMode } : {}),
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
