import {
  ArrowRight,
  BookOpen,
  Building2,
  Cpu,
  FileText,
  Flag,
  Globe2,
  Handshake,
  Landmark,
  Leaf,
  Network,
  Scale,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react"
import type { ComponentType } from "react"

export type OverviewMockupIcon = ComponentType<{
  "aria-hidden"?: boolean
  className?: string
}>

export type OverviewMockupChapter = {
  id: string
  number: string
  label: string
  shortLabel: string
}

export type OverviewMockupUtility = {
  label: string
  icon: OverviewMockupIcon
}

export type OverviewRelationship = {
  label: string
  icon: OverviewMockupIcon
}

export type OverviewSystemNode = {
  label: string
  icon: OverviewMockupIcon
  position:
    | "top"
    | "rightTop"
    | "rightBottom"
    | "bottom"
    | "leftBottom"
    | "leftTop"
}

export type OverviewLensControl = {
  label: string
  icon: OverviewMockupIcon
  active?: boolean
  asset?: string
}

export type OverviewLegendItem = {
  label: string
  tone: "blue" | "gold" | "cyan" | "dotted"
}

export const overviewMockupChapters: OverviewMockupChapter[] = [
  {
    id: "hero-narrative-frame",
    number: "1",
    label: "Hero Narrative Frame",
    shortLabel: "Hero Narrative Frame",
  },
  {
    id: "global-governance-overview",
    number: "2",
    label: "Global Governance Overview",
    shortLabel: "Global Governance Overview",
  },
  {
    id: "un-command-center",
    number: "3",
    label: "UN Command Center",
    shortLabel: "UN Command Center",
  },
  {
    id: "governance-limits",
    number: "4",
    label: "Governance Limits & Enforcement",
    shortLabel: "Governance Limits & Enforcement",
  },
  {
    id: "west-philippine-sea-dossier",
    number: "5",
    label: "West Philippine Sea Dossier",
    shortLabel: "West Philippine Sea Dossier",
  },
  {
    id: "conclusion-references",
    number: "6",
    label: "Conclusion & References",
    shortLabel: "Conclusion & References",
  },
]

export const overviewMockupUtilities: OverviewMockupUtility[] = [
  { label: "Search", icon: Search },
  { label: "Glossary", icon: BookOpen },
  { label: "Guide", icon: ShieldCheck },
]

export const overviewRelationships: OverviewRelationship[] = [
  { label: "States & Power", icon: Users },
  { label: "Institutions & Coordination", icon: Landmark },
  { label: "Rules & Expectations", icon: FileText },
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
    label: "System Framing",
    icon: Network,
    active: true,
    asset:
      "/images/public-homepage/resource-pack/overview/overview-system-framing-mark-white-bg-01.png",
  },
  { label: "Actor Relationships", icon: Users },
  { label: "Rules & Cooperation", icon: Handshake },
  { label: "Power & Inequality", icon: Scale },
]

export const overviewLegendItems: OverviewLegendItem[] = [
  { label: "Coordination & Partnership", tone: "blue" },
  { label: "Influence & Power", tone: "gold" },
  { label: "Information & Norm Flow", tone: "cyan" },
  { label: "Response & Adaptation", tone: "dotted" },
]

export const overviewMockupCopy = {
  eyebrow: "Chapter 2",
  title: "Global Governance Overview",
  support:
    "A closer look at the system that shapes our world. Multiple actors. Overlapping institutions. Shared challenges. No single world government, only structured cooperation.",
  selectedKicker: "Selected Relationship",
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
  nextTitle: "UN Command Center",
  nextBody:
    "Explore the core institution designed to maintain peace and security.",
  scrollCue: "Scroll to explore",
  chatTitle: "Ask about global governance",
  chatMeta: "Source-aware - Cite-verified",
  centerLabel: "Global Governance",
  nextIcon: ArrowRight,
  centerIcon: Globe2,
  institutionIcon: Building2,
}
