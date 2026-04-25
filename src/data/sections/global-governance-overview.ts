import type {
  ChapterTransitionContent,
  NarrativeSectionContent,
} from "@/data/sections/narrative-types"

export const journeyStartContent = {
  id: "journey-start",
  navigationLabel: "Journey start",
  eyebrow: "Orientation",
  title: "A guide to cooperation without a world government",
  summary:
    "Global governance starts with a simple tension: shared problems cross borders, but political authority still belongs mostly to states.",
  body: "This journey follows how countries use institutions, law, norms, and pressure to coordinate action even when no single global authority can command everyone.",
  note: "No account needed. The core narrative is open from the first screen so a first-time visitor can read, scroll, and return to any chapter by anchor link.",
}

export const globalGovernanceOverview: NarrativeSectionContent = {
  id: "global-governance-overview",
  navigationLabel: "Global governance overview",
  eyebrow: "Big idea",
  title: "Global governance is coordination under constraint",
  summary:
    "Global governance is not a world state. It is the network of rules, institutions, negotiations, habits, and public pressure that helps states manage problems they cannot solve alone.",
  thesis:
    "The key idea is cooperation without a single sovereign: states keep authority, but they also build systems that make joint action more likely.",
  supportingDetails: [
    "Some problems are practical, like disease surveillance, shipping standards, climate risk, or financial stability. Others are political, like disputes over territory, security, trade, and human rights.",
    "The system works through many layers at once: treaties set expectations, institutions organize forums, experts produce evidence, and governments weigh the costs of ignoring shared rules.",
  ],
  disclosures: [
    {
      title: "What counts as governance?",
      collapsedSummary:
        "Governance includes formal law, institutional routines, diplomatic habits, and reputational pressure.",
      details: [
        "Formal governance includes charters, treaties, courts, agencies, and voting procedures. Informal governance includes expectations about consultation, restraint, transparency, and reciprocity.",
        "Both layers matter because international politics rarely moves through one clean chain of command. A rule can guide behavior even when no global police force stands behind it.",
      ],
    },
  ],
  synthesis:
    "Global governance is easiest to understand as a toolkit: it cannot erase power politics, but it gives states ways to coordinate, argue, and measure conduct against shared standards.",
  recap: {
    takeaway:
      "This chapter established global governance as coordination under constraint: useful tools for shared problems, not a world government.",
    nextStepLabel: "Continue to UN Command Center",
    nextStepTargetId: "un-command-center",
  },
}

export const institutionsTransition: ChapterTransitionContent = {
  label: "Next: Institutions",
  title: "From the big idea to the main room",
  body: "Once the system needs a place to debate, monitor, and coordinate, institutions become the operating rooms of global governance.",
}
