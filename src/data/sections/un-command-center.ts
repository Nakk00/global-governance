import type {
  ChapterTransitionContent,
  NarrativeSectionContent,
} from "@/data/sections/narrative-types"

export const unCommandCenter: NarrativeSectionContent = {
  id: "un-command-center",
  navigationLabel: "UN Command Center",
  eyebrow: "Institutions",
  title: "The UN gives global politics a shared address",
  summary:
    "The United Nations does not govern the world, but it gives states a standing place to debate crises, set norms, coordinate agencies, and turn disputes into procedures instead of pure escalation.",
  thesis:
    "The UN matters because it makes international politics more organized, visible, and repeatable, even when states disagree sharply.",
  supportingDetails: [
    "The General Assembly gives every member state a forum. The Security Council focuses on peace and security. The Secretariat turns mandates into administrative work, while specialized agencies handle technical cooperation.",
    "These bodies do different jobs, so the UN is best read as a system of rooms rather than a single actor with one will.",
  ],
  disclosures: [
    {
      title: "How the rooms divide the work",
      collapsedSummary:
        "UN organs split agenda-setting, security decisions, administration, legal interpretation, and specialized cooperation.",
      details: [
        "A debate may start in the General Assembly, move through committees or agencies, and become visible through reports, votes, resolutions, or field operations.",
        "The Security Council can be decisive on some peace and security questions, but its veto structure also shows how institutional design reflects political power.",
      ],
    },
  ],
  synthesis:
    "The UN is powerful as a convening and norm-setting system, but its authority is filtered through member states and the political bargains they accept.",
  recap: {
    takeaway:
      "This chapter showed the UN as a shared address for world politics: a system of rooms that organizes debate, norms, and coordination.",
    nextStepLabel: "Continue to Governance limits and enforcement",
    nextStepTargetId: "governance-limits",
  },
}

export const constraintsTransition: ChapterTransitionContent = {
  label: "Next: Constraints",
  title: "Institutions do not remove politics",
  body: "The next layer asks why rules and institutions can still matter when enforcement is uneven and powerful states can resist pressure.",
}
