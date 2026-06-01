import { conclusionContent } from "@/data/sections/conclusion-content"
import {
  globalGovernanceOverview,
  institutionsTransition,
} from "@/data/sections/global-governance-overview"
import {
  caseFileTransition,
  governanceLimits,
} from "@/data/sections/governance-limits"
import {
  constraintsTransition,
  unCommandCenter,
} from "@/data/sections/un-command-center"
import { westPhilippineSeaDossier } from "@/data/sections/west-philippine-sea-dossier"
import { defaultChapterId, isKnownSectionId } from "@/data/navigation"
import type { NarrativeSectionContent } from "@/data/sections/narrative-types"

export const coreNarrativeSections = [
  globalGovernanceOverview,
  unCommandCenter,
  governanceLimits,
  westPhilippineSeaDossier,
  conclusionContent,
]

export const chapterTransitionsBySectionId = new Map([
  [globalGovernanceOverview.id, institutionsTransition],
  [unCommandCenter.id, constraintsTransition],
  [governanceLimits.id, caseFileTransition],
])

export type ResolvedNarrativeRecapCue = {
  takeaway: string
  nextStep?: {
    label: string
    targetId: string
  }
}

const getCanonicalRecapTargetId = (sectionId: string) => {
  const sectionIndex = coreNarrativeSections.findIndex(
    (section) => section.id === sectionId
  )

  if (sectionIndex === -1) {
    return undefined
  }

  const nextSection = coreNarrativeSections[sectionIndex + 1]

  return nextSection?.id ?? defaultChapterId
}

export function resolveNarrativeRecapCue(
  section: NarrativeSectionContent
): ResolvedNarrativeRecapCue {
  const takeaway = section.recap?.takeaway.trim() || section.synthesis
  const targetId = section.recap?.nextStepTargetId?.trim()
  const label = section.recap?.nextStepLabel?.trim()
  const canonicalTargetId = getCanonicalRecapTargetId(section.id)

  if (
    !targetId ||
    !label ||
    !canonicalTargetId ||
    targetId !== canonicalTargetId ||
    !isKnownSectionId(targetId)
  ) {
    return { takeaway }
  }

  return {
    takeaway,
    nextStep: {
      label,
      targetId,
    },
  }
}
