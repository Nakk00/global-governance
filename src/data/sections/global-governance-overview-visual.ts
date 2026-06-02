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
  },
  {
    id: "actor-relationships",
    label: "Actor Relationships",
    description:
      "Follow how states, institutions, markets, and civil society interact.",
    icon: Users,
  },
  {
    id: "rules-cooperation",
    label: "Rules & Cooperation",
    description:
      "Watch how expectations and procedures make coordination possible.",
    icon: Handshake,
  },
  {
    id: "power-inequality",
    label: "Power & Inequality",
    description:
      "Ask who benefits, who is constrained, and whose voice carries weight.",
    icon: Scale,
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
  selectedTitle: "Actors do not govern alone",
  selectedBody:
    "Global governance is a web of states, institutions, norms, and issue-specific bodies.",
  selectedDetail:
    "Outcomes emerge through coordination, negotiation, and shared problem-solving.",
  relationshipKicker: "Explore this relationship",
  whyKicker: "Why it matters",
  whyTitle: "Shared problems require shared responses",
  whyBody:
    "Climate change, security threats, trade, migration, pandemics, and financial stability all cross borders.",
  whyDetail:
    "Global governance provides the mechanisms that help states coordinate beyond national boundaries, even when interests collide.",
  whyQuote:
    "Effective cooperation today shapes a more secure, just, and sustainable future.",
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
