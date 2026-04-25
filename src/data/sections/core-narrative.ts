import { conclusionContent } from "@/data/sections/conclusion-content"
import {
  globalGovernanceOverview,
  institutionsTransition,
  journeyStartContent,
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

export { journeyStartContent }

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
