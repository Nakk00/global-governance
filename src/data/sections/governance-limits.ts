import type {
  ChapterTransitionContent,
  NarrativeSectionContent,
} from "@/data/sections/narrative-types"

export const governanceLimits: NarrativeSectionContent = {
  id: "governance-limits",
  navigationLabel: "Governance limits and enforcement",
  eyebrow: "Constraints",
  title: "Rules matter, but they do not enforce themselves",
  summary:
    "International law and institutions can narrow what states can credibly claim, justify, or ignore, but enforcement often depends on consent, coalitions, leverage, and political will.",
  thesis:
    "The limit is not that rules are meaningless; the limit is that rules need actors to interpret, defend, and apply them.",
  supportingDetails: [
    "States may comply because they value stability, need cooperation in other areas, want legitimacy, or fear costs from partners and publics.",
    "They may resist when a rule threatens security interests, domestic political narratives, economic gains, or territorial claims.",
  ],
  disclosures: [
    {
      title: "Why rules still shape choices",
      collapsedSummary:
        "Law and institutions can narrow the menu of acceptable behavior even when they cannot force a state by themselves.",
      details: [
        "Reputation, reciprocity, domestic pressure, alliance politics, market access, and diplomatic isolation can all make rule-breaking more expensive.",
        "Those costs are uneven, which is why global governance often looks less like command and more like repeated bargaining under public standards.",
      ],
    },
  ],
  synthesis:
    "A realistic view holds both truths together: international rules are politically limited, and those limits are exactly why institutions, evidence, and collective pressure matter.",
  recap: {
    takeaway:
      "This chapter established the central limit: rules matter, but they need actors, pressure, and political will to make them usable.",
    nextStepLabel: "Continue to West Philippine Sea dossier",
    nextStepTargetId: "west-philippine-sea-dossier",
  },
}

export const caseFileTransition: ChapterTransitionContent = {
  label: "Next: Case file",
  title: "Put the system under pressure",
  body: "A regional dispute can show the full pattern at once: law, institutions, national interest, public claims, and enforcement limits colliding in real time.",
}
