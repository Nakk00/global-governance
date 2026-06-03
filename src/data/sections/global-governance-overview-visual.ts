import {
  ArrowRight,
  Cpu,
  FileText,
  Flag,
  Globe2,
  Handshake,
  Landmark,
  Leaf,
  Network,
  Scale,
  Users,
} from "lucide-react"
import type { ComponentType } from "react"

export type OverviewVisualIcon = ComponentType<{
  "aria-hidden"?: boolean
  className?: string
}>

export type OverviewRelationship = {
  id: string
  label: string
  body: string
  icon: OverviewVisualIcon
}

export type OverviewSystemNode = {
  label: string
  icon: OverviewVisualIcon
  position:
    | "top"
    | "rightTop"
    | "rightBottom"
    | "bottom"
    | "leftBottom"
    | "leftTop"
}

export type OverviewLensControl = {
  id: string
  label: string
  description: string
  icon: OverviewVisualIcon
  asset?: string
  selectedTitle: string
  selectedBody: string
  selectedDetail: string
  whyTitle: string
  whyBody: string
  whyDetail: string
  whyQuote: string
  focusRelationshipIds: string[]
  focusNodeLabels: string[]
  focusLegendTones?: OverviewLegendItem["tone"][]
  diagramSummary: string
}

export type OverviewLegendItem = {
  label: string
  tone: "blue" | "gold" | "cyan" | "dotted"
}

export const overviewRelationships: OverviewRelationship[] = [
  {
    id: "states-power",
    label: "States & Power",
    body: "Sovereign actors remain central, but shared problems limit acting alone.",
    icon: Users,
  },
  {
    id: "institutions-coordination",
    label: "Institutions & Coordination",
    body: "Organizations create meeting rooms, procedures, records, and pressure.",
    icon: Landmark,
  },
  {
    id: "rules-expectations",
    label: "Rules & Expectations",
    body: "Norms shape what governments can justify, contest, and enforce together.",
    icon: FileText,
  },
]

export const overviewSystemNodes: OverviewSystemNode[] = [
  { label: "Institutions", icon: Landmark, position: "top" },
  { label: "Norms", icon: Scale, position: "rightTop" },
  { label: "Civil Society", icon: Users, position: "rightBottom" },
  { label: "Markets & Technology", icon: Cpu, position: "bottom" },
  { label: "Issue Areas", icon: Leaf, position: "leftBottom" },
  { label: "States", icon: Flag, position: "leftTop" },
]

export const overviewLensControls: OverviewLensControl[] = [
  {
    id: "system-framing",
    label: "System Framing",
    description: "Map the whole system before zooming into single actors.",
    icon: Network,
    asset:
      "/images/public-homepage/resource-pack/overview/overview-system-framing-mark-white-bg-01.png",
    selectedTitle: "Actors do not govern alone",
    selectedBody:
      "Global governance is a web of states, institutions, norms, and issue-specific bodies.",
    selectedDetail:
      "Outcomes emerge through coordination, negotiation, and shared problem-solving.",
    whyTitle: "Shared problems require shared responses",
    whyBody:
      "Climate change, security threats, trade, migration, pandemics, and financial stability all cross borders.",
    whyDetail:
      "Global governance provides mechanisms that help states coordinate beyond national boundaries, even when interests collide.",
    whyQuote:
      "Effective cooperation today shapes a more secure, just, and sustainable future.",
    focusRelationshipIds: [
      "states-power",
      "institutions-coordination",
      "rules-expectations",
    ],
    focusNodeLabels: [
      "Institutions",
      "Norms",
      "Civil Society",
      "Markets & Technology",
      "Issue Areas",
      "States",
    ],
    focusLegendTones: ["blue", "gold", "cyan", "dotted"],
    diagramSummary:
      "The system framing lens shows states, institutions, norms, civil society, markets and technology, and issue areas as one connected field of cooperation without a world government.",
  },
  {
    id: "actor-relationships",
    label: "Actor Relationships",
    description:
      "Follow how states, institutions, markets, and civil society interact.",
    icon: Users,
    selectedTitle: "Actors bargain through shared spaces",
    selectedBody:
      "States bring authority, institutions organize the forum, and social or market actors add pressure, evidence, and capacity.",
    selectedDetail:
      "The result is a negotiated field where cooperation depends on who can convene, persuade, fund, monitor, or resist.",
    whyTitle: "Relationships decide what becomes possible",
    whyBody:
      "Global problems move through coalitions. A treaty, campaign, standard, or sanction only matters when actors keep responding to one another.",
    whyDetail:
      "This lens makes the map social: governance is less a command chain than a set of relationships that can align or fracture.",
    whyQuote:
      "The map changes when you ask who is connected, who is excluded, and who can move others.",
    focusRelationshipIds: ["states-power", "institutions-coordination"],
    focusNodeLabels: [
      "States",
      "Institutions",
      "Civil Society",
      "Markets & Technology",
    ],
    focusLegendTones: ["blue", "gold"],
    diagramSummary:
      "The actor relationships lens highlights states, institutions, civil society, and markets and technology, with special attention to power and coordination pathways.",
  },
  {
    id: "rules-cooperation",
    label: "Rules & Cooperation",
    description:
      "Watch how expectations and procedures make coordination possible.",
    icon: Handshake,
    selectedTitle: "Rules make cooperation repeatable",
    selectedBody:
      "Norms, procedures, records, and institutional routines turn one-time deals into expectations that actors can cite and test.",
    selectedDetail:
      "They do not erase disagreement, but they give governments and publics a common language for judging conduct.",
    whyTitle: "Shared expectations lower the cost of acting together",
    whyBody:
      "Cooperation is easier when actors know where to meet, what counts as evidence, and how commitments will be remembered.",
    whyDetail:
      "This lens shows why global governance can shape behavior even without a single global enforcer.",
    whyQuote:
      "Rules matter because they make claims visible, comparable, and harder to ignore.",
    focusRelationshipIds: ["institutions-coordination", "rules-expectations"],
    focusNodeLabels: ["Norms", "Institutions", "Issue Areas"],
    focusLegendTones: ["blue", "cyan", "dotted"],
    diagramSummary:
      "The rules and cooperation lens highlights norms, institutions, and issue areas, showing how procedures, information flow, and adaptation support repeated cooperation.",
  },
  {
    id: "power-inequality",
    label: "Power & Inequality",
    description:
      "Ask who benefits, who is constrained, and whose voice carries weight.",
    icon: Scale,
    selectedTitle: "Power shapes every shared rule",
    selectedBody:
      "States and powerful markets often have more leverage, but civil society and issue coalitions can still expose costs and shift agendas.",
    selectedDetail:
      "The same governance system can coordinate action and reproduce unequal influence at the same time.",
    whyTitle: "Cooperation is never neutral",
    whyBody:
      "Rules, forums, and enforcement choices can protect weaker actors, but they can also reflect unequal money, security power, or diplomatic weight.",
    whyDetail:
      "This lens keeps the lesson honest: global governance works through politics, not above it.",
    whyQuote:
      "To understand outcomes, track both the rule on paper and the power behind its use.",
    focusRelationshipIds: ["states-power", "rules-expectations"],
    focusNodeLabels: [
      "States",
      "Markets & Technology",
      "Civil Society",
      "Issue Areas",
    ],
    focusLegendTones: ["gold", "cyan"],
    diagramSummary:
      "The power and inequality lens highlights states, markets and technology, civil society, and issue areas, showing how influence and voice affect cooperation and enforcement.",
  },
]

export const overviewLegendItems: OverviewLegendItem[] = [
  { label: "Coordination & Partnership", tone: "blue" },
  { label: "Influence & Power", tone: "gold" },
  { label: "Information & Norm Flow", tone: "cyan" },
  { label: "Response & Adaptation", tone: "dotted" },
]

export const overviewVisualCopy = {
  eyebrow: "Chapter 2",
  title: "Global Governance Overview",
  support:
    "A closer look at the system that shapes our world. Multiple actors. Overlapping institutions. Shared challenges. No single world government, only structured cooperation.",
  selectedKicker: "Selected relationship",
  relationshipKicker: "Explore this relationship",
  whyKicker: "Why it matters",
  lensesKicker: "View the system through different lenses",
  nextKicker: "Next Chapter",
  nextTitle: "The System Under Pressure",
  nextBody:
    "See how institutions organize cooperation while politics tests their limits.",
  centerLabel: "Global Governance",
  centerIcon: Globe2,
  nextIcon: ArrowRight,
  nextAsset:
    "/images/public-homepage/resource-pack/overview/overview-un-command-mark-white-bg-01.png",
  quoteAsset:
    "/images/public-homepage/resource-pack/hero/governance-compass-mark-01.png",
}
