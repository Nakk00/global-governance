import {
  BarChart3,
  BookOpen,
  Building2,
  Globe2,
  Landmark,
  Leaf,
  Scale,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"
import type { ComponentType } from "react"

export type HeroMockupIcon = ComponentType<{
  "aria-hidden"?: boolean
  className?: string
}>

export type HeroMockupChapter = {
  id: string
  number: string
  label: string
  shortLabel: string
}

export type HeroMockupSystemRow = {
  label: string
  icon: HeroMockupIcon
}

export type HeroMockupPillar = {
  label: string
  icon: HeroMockupIcon
  position: "top" | "rightTop" | "rightBottom" | "bottom" | "leftBottom" | "leftTop"
}

export type HeroMockupUtility = {
  label: string
  icon: HeroMockupIcon
}

export const heroMockupChapters: HeroMockupChapter[] = [
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

export const heroMockupSystemRows: HeroMockupSystemRow[] = [
  { label: "States & Governments", icon: Landmark },
  { label: "International Institutions", icon: Building2 },
  { label: "Norms & Rules", icon: ShieldCheck },
  { label: "Collective Challenges", icon: Globe2 },
  { label: "Shared Solutions", icon: Sparkles },
]

export const heroMockupPillars: HeroMockupPillar[] = [
  { label: "Security", icon: Shield, position: "top" },
  { label: "Development", icon: Leaf, position: "rightTop" },
  { label: "Rights", icon: Users, position: "rightBottom" },
  { label: "Environment", icon: Globe2, position: "bottom" },
  { label: "Economy", icon: BarChart3, position: "leftBottom" },
  { label: "Rule of law", icon: Scale, position: "leftTop" },
]

export const heroMockupUtilities: HeroMockupUtility[] = [
  { label: "Search", icon: Search },
  { label: "Glossary", icon: BookOpen },
  { label: "Guide", icon: ShieldCheck },
]

export const heroMockupCopy = {
  eyebrow: "Global Systems Overview",
  headlineBeforeHighlight: "Power, rules, and institutions",
  headlineHighlight: "shape",
  headlineAfterHighlight: "our shared world.",
  support:
    "Explore how global governance connects states, institutions, norms, and collective action across borders.",
  primaryCta: "Begin the journey",
  secondaryCta: "Explore chapters",
  systemIntro: "Interconnected. Interdependent. Collectively governed.",
  currentFocus:
    "Setting the stage for how power, rules, and institutions shape global outcomes.",
  chatTitle: "Ask a question about this chapter",
  chatMeta: "Source-aware • Cite-verified",
  pillarQuote: "No single actor can solve global challenges alone.",
  pillarEmphasis: "Coordination creates impact.",
}
