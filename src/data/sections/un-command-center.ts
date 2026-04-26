import type {
  ChapterTransitionContent,
  NarrativeSectionContent,
} from "@/data/sections/narrative-types"

export type UNCommandCenterShellContent = {
  introduction: string
  summaryLabel: string
  entryLabel: string
  entryPrompt: string
  controls: {
    title: string
    detail: string
  }[]
}

export type UNOrganContent = {
  id: string
  label: string
  summary: string
  role: string
  power: string
  limit: string
  whyItMatters: string
}

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

export const unOrgans: UNOrganContent[] = [
  {
    id: "general-assembly",
    label: "General Assembly",
    summary: "The forum where every UN member state has a seat and a vote.",
    role: "Turns global concerns into public debate, resolutions, budgets, and shared political signals.",
    power:
      "Can set agendas, approve budgets, elect members to UN bodies, and show where broad international support exists.",
    limit:
      "Its resolutions usually do not bind states by force, so influence depends on legitimacy, repetition, and diplomatic pressure.",
    whyItMatters:
      "It gives small and large states the same microphone, making global opinion visible even when agreement is incomplete.",
  },
  {
    id: "security-council",
    label: "Security Council",
    summary: "The body with primary responsibility for peace and security.",
    role: "Assesses threats, authorizes peace operations, imposes sanctions, and can approve collective security measures.",
    power:
      "Can issue binding decisions for member states and move faster than the wider UN when the council agrees.",
    limit:
      "The veto held by the five permanent members can block action, especially when major-power interests collide.",
    whyItMatters:
      "It shows the UN at its most operational and most political: capable of authorizing action, but shaped by power.",
  },
  {
    id: "secretariat",
    label: "Secretariat",
    summary: "The administrative engine led by the Secretary-General.",
    role: "Turns mandates into reports, coordination, field support, diplomacy, and the day-to-day work of the organization.",
    power:
      "Can gather information, keep negotiations moving, warn about risks, and make the UN system legible to states and publics.",
    limit:
      "It does not command states on its own and must work within mandates, budgets, and political consent.",
    whyItMatters:
      "It keeps the institution from being only a meeting hall by giving decisions a professional memory and operating capacity.",
  },
  {
    id: "international-court",
    label: "International Court of Justice",
    summary: "The UN's principal judicial organ for disputes between states.",
    role: "Interprets international law, settles legal disputes submitted by states, and issues advisory opinions.",
    power:
      "Can clarify legal obligations and create authoritative records that shape diplomacy, advocacy, and future behavior.",
    limit:
      "Its reach depends on state consent and follow-through; legal judgment does not automatically produce enforcement.",
    whyItMatters:
      "It helps move conflicts from pure power politics into legal argument, evidence, and public reasoning.",
  },
  {
    id: "specialized-agencies",
    label: "Specialized agencies",
    summary:
      "The technical bodies that coordinate work in fields such as health, labor, food, education, and development.",
    role: "Provide expertise, standards, field programs, and coordination for problems that cross borders.",
    power:
      "Can pool knowledge, set technical norms, support national capacity, and keep cooperation running below headline politics.",
    limit:
      "They depend on mandates, funding, member-state cooperation, and trust in expert institutions.",
    whyItMatters:
      "They make global governance practical by turning broad goals into standards, data, advice, and services.",
  },
]

export const unCommandCenterShell: UNCommandCenterShellContent = {
  introduction:
    "This Command Center frames the United Nations as an institutional system within global governance: a place to explore how states debate, coordinate, authorize, document, and contest collective action.",
  summaryLabel: "Command Center summary",
  entryLabel: "Entry controls",
  entryPrompt:
    "Use these shell-level cues to begin exploring the system before the organ-by-organ tools arrive.",
  controls: [
    {
      title: "Explore the Command Center",
      detail:
        "Start by reading the UN as a system of rooms: some rooms surface problems, some authorize action, and others turn mandates into repeatable work.",
    },
    {
      title: "Why the UN matters",
      detail:
        "The UN matters because it makes coordination visible before agreement is easy, giving governments a shared place to argue, record positions, and keep negotiations from becoming only private pressure.",
    },
  ],
}

export const constraintsTransition: ChapterTransitionContent = {
  label: "Next: Constraints",
  title: "Institutions do not remove politics",
  body: "The next layer asks why rules and institutions can still matter when enforcement is uneven and powerful states can resist pressure.",
}
