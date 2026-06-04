import type { NarrativeSectionContent } from "@/data/sections/narrative-types"

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

export type SystemPressureNode = {
  label: string
  body: string
  tone: "coordination" | "pressure"
}

export type SystemPressureConstraint = {
  label: string
  body: string
}

export type SystemPressurePreviewChapter = {
  id: string
  number: string
  label: string
  summary: string
}

const systemPressureAssetRoot =
  "/images/public-homepage/resource-pack/system-under-pressure"

export const systemPressureBackground = `${systemPressureAssetRoot}/backgrounds/chapter-3-system-under-pressure-background-03.png`

export const systemPressureNodes: SystemPressureNode[] = [
  {
    label: "Rules",
    body: "Agreements and norms",
    tone: "coordination",
  },
  {
    label: "Institutions",
    body: "Rooms that coordinate action",
    tone: "coordination",
  },
  {
    label: "State Choices",
    body: "Interests, alliances, and strategies",
    tone: "pressure",
  },
  {
    label: "Outcomes",
    body: "Results on the ground",
    tone: "pressure",
  },
]

export const systemPressureConstraints: SystemPressureConstraint[] = [
  {
    label: "Consent",
    body: "States must agree. Nothing is automatic.",
  },
  {
    label: "Veto",
    body: "A single state can block collective action.",
  },
  {
    label: "Political Will",
    body: "Leaders choose what matters most.",
  },
  {
    label: "Leverage",
    body: "Power, resources, and influence shape options.",
  },
  {
    label: "Uneven Enforcement",
    body: "Rules apply differently across situations.",
  },
]

export const systemPressurePreviewChapters: SystemPressurePreviewChapter[] = [
  {
    id: "hero-narrative-frame",
    number: "01",
    label: "Hero Narrative Frame",
    summary: "The question that starts the journey",
  },
  {
    id: "global-governance-overview",
    number: "02",
    label: "Global Governance Overview",
    summary: "The system, actors, and connections",
  },
  {
    id: "un-command-center",
    number: "03",
    label: "The System Under Pressure",
    summary: "Institutions organize. Politics tests the limits.",
  },
  {
    id: "west-philippine-sea-dossier",
    number: "04",
    label: "West Philippine Sea Case File",
    summary: "A real dispute. A full test.",
  },
]

export const unCommandCenter: NarrativeSectionContent = {
  id: "un-command-center",
  navigationLabel: "The System Under Pressure",
  eyebrow: "Institutions under pressure",
  title: "The System Under Pressure",
  summary:
    "Institutions organize cooperation by giving states rooms for debate, law, evidence, and coordination. Politics still tests how far those rules travel through consent, vetoes, leverage, and political will.",
  thesis:
    "The UN matters because it makes international politics more organized, visible, and repeatable, but its authority is filtered through state choices and the bargains governments are willing to accept.",
  supportingDetails: [
    "The General Assembly gives every member state a forum. The Security Council focuses on peace and security. The Secretariat turns mandates into administrative work, the Court clarifies legal questions, and specialized agencies handle technical cooperation.",
    "These bodies make cooperation more visible and repeatable, but they do not erase state interests, domestic narratives, security concerns, or major-power leverage.",
    "Rules can narrow what states can credibly claim or ignore. Enforcement still depends on actors willing to interpret, defend, fund, and apply those rules.",
  ],
  disclosures: [
    {
      title: "How institutions organize pressure",
      collapsedSummary:
        "UN organs split agenda-setting, security decisions, administration, legal interpretation, and technical cooperation.",
      details: [
        "A debate may start in the General Assembly, move through committees or agencies, and become visible through reports, votes, resolutions, or field operations.",
        "The Security Council can be decisive on some peace and security questions, but its veto structure also shows how institutional design reflects political power.",
        "Reputation, reciprocity, domestic pressure, alliance politics, market access, and diplomatic isolation can all make rule-breaking more expensive, but those costs are uneven.",
      ],
    },
  ],
  synthesis:
    "Institutions make cooperation possible. Politics decides how far it goes.",
  recap: {
    takeaway:
      "This chapter showed the UN as a shared address for world politics and the pressure test around it: institutions organize cooperation, but politics decides how far rules travel.",
    nextStepLabel: "Continue to West Philippine Sea Case File",
    nextStepTargetId: "west-philippine-sea-dossier",
  },
}

export const unOrgans: UNOrganContent[] = [
  {
    id: "general-assembly",
    label: "General Assembly",
    summary: "Universal forum for states' voices",
    role: "Turns global concerns into public debate, resolutions, budgets, and shared political signals.",
    power:
      "Can set agendas, approve budgets, elect members to UN bodies, and show where broad international support exists.",
    limit:
      "Its resolutions usually do not bind states by force, so influence depends on legitimacy, repetition, diplomatic pressure, and political follow-through.",
    whyItMatters:
      "It gives small and large states the same microphone, making global opinion visible even when agreement is incomplete.",
  },
  {
    id: "security-council",
    label: "Security Council",
    summary: "Focus on peace and security",
    role: "Assesses threats, authorizes peace operations, imposes sanctions, and can approve collective security measures.",
    power:
      "Can issue binding decisions for member states and move faster than the wider UN when the council agrees.",
    limit:
      "The veto held by the five permanent members can block action, especially when major-power interests collide with collective pressure.",
    whyItMatters:
      "It shows the UN at its most operational and most political: capable of authorizing action, but shaped by power.",
  },
  {
    id: "international-law",
    label: "International Law",
    summary: "Rules, norms, and legal process",
    role: "Turns disputes into legal claims, obligations, evidence, standards, and arguments states can contest in public.",
    power:
      "Can clarify what conduct is lawful, narrow credible excuses, and give institutions a shared basis for debate.",
    limit:
      "Law still depends on interpretation, jurisdiction, state consent, and political willingness to comply or enforce.",
    whyItMatters:
      "It makes power answerable to reasons, records, and standards even when enforcement remains contested.",
  },
  {
    id: "international-court",
    label: "International Court",
    summary: "Legal clarification and dispute settlement",
    role: "Interprets international law, settles legal disputes submitted by states, and issues advisory opinions.",
    power:
      "Can clarify legal obligations and create authoritative records that shape diplomacy, advocacy, and future behavior.",
    limit:
      "Its reach depends on state consent and follow-through; legal judgment can clarify rules without automatically producing enforcement.",
    whyItMatters:
      "It helps move conflicts from pure power politics into legal argument, evidence, and public reasoning.",
  },
  {
    id: "specialized-agencies",
    label: "UN Agencies & Programs",
    summary: "Technical cooperation and implementation",
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
    "This chapter treats the United Nations as an institutional system under pressure: a place where states debate, coordinate, authorize, document, and contest collective action.",
  summaryLabel: "System pressure summary",
  entryLabel: "Pressure map",
  entryPrompt:
    "Use the room selector, pressure diagram, and constraints panel to connect institutions with the political limits that shape outcomes.",
  controls: [
    {
      title: "How the system rooms work together",
      detail:
        "Start by reading the UN as a system of rooms: some rooms surface problems, some authorize action, and others turn mandates into repeatable work.",
    },
    {
      title: "Why enforcement remains uneven",
      detail:
        "The UN matters because it makes coordination visible before agreement is easy, but compliance still depends on consent, leverage, political will, and the costs governments are willing to bear.",
    },
  ],
}
