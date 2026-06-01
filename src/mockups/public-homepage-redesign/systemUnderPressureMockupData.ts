import {
  ArrowRight,
  BookOpen,
  Building2,
  CircleDot,
  FileText,
  Globe2,
  Hand,
  Landmark,
  Lightbulb,
  Map,
  MessageCircle,
  Network,
  Search,
  ShieldCheck,
  Target,
  Users,
  UsersRound,
  Vote,
} from "lucide-react"
import type { ComponentType } from "react"

export type SystemPressureIcon = ComponentType<{
  "aria-hidden"?: boolean
  className?: string
}>

export type SystemPressureChapter = {
  id: string
  number: string
  label: string
  shortLabel: string
  summary: string
  icon: SystemPressureIcon
}

export type SystemPressureUtility = {
  label: string
  icon: SystemPressureIcon
}

export type InstitutionRoom = {
  label: string
  body: string
  icon: SystemPressureIcon
}

export type PressureNode = {
  label: string
  body: string
  icon: SystemPressureIcon
  tone: "blue" | "gold"
}

export type ConstraintCard = {
  label: string
  body: string
  icon: SystemPressureIcon
}

const assetRoot = "/images/public-homepage/resource-pack/system-under-pressure"

export const systemPressureBackground = `${assetRoot}/backgrounds/chapter-3-system-under-pressure-background-03.png`

export const systemPressureMockupChapters: SystemPressureChapter[] = [
  {
    id: "hero-narrative-frame",
    number: "1",
    label: "Hero Narrative Frame",
    shortLabel: "Hero Narrative Frame",
    summary: "The question that starts the journey",
    icon: Globe2,
  },
  {
    id: "global-governance-overview",
    number: "2",
    label: "Global Governance Overview",
    shortLabel: "Global Governance Overview",
    summary: "The system, actors, and connections",
    icon: Network,
  },
  {
    id: "system-under-pressure",
    number: "3",
    label: "The System Under Pressure",
    shortLabel: "The System Under Pressure",
    summary: "Institutions organize. Politics tests the limits.",
    icon: Landmark,
  },
  {
    id: "west-philippine-sea-dossier",
    number: "4",
    label: "West Philippine Sea Case File",
    shortLabel: "West Philippine Sea Case File",
    summary: "A real dispute. A full test.",
    icon: Map,
  },
]

export const systemPressureUtilities: SystemPressureUtility[] = [
  { label: "Search", icon: Search },
  { label: "Glossary", icon: BookOpen },
  { label: "Guide", icon: ShieldCheck },
  { label: "Chat", icon: MessageCircle },
]

export const institutionRooms: InstitutionRoom[] = [
  {
    label: "General Assembly",
    body: "Universal forum for states' voices",
    icon: Users,
  },
  {
    label: "Security Council",
    body: "Focus on peace and security",
    icon: ShieldCheck,
  },
  {
    label: "International Law",
    body: "Rules, norms, and legal process",
    icon: FileText,
  },
  {
    label: "International Court",
    body: "Legal clarification and dispute settlement",
    icon: Landmark,
  },
  {
    label: "UN Agencies & Programs",
    body: "Technical cooperation and implementation",
    icon: Building2,
  },
]

export const pressureNodes: PressureNode[] = [
  {
    label: "Rules",
    body: "Agreements and norms",
    icon: FileText,
    tone: "blue",
  },
  {
    label: "Institutions",
    body: "Rooms that coordinate action",
    icon: Landmark,
    tone: "blue",
  },
  {
    label: "State Choices",
    body: "Interests, alliances, and strategies",
    icon: UsersRound,
    tone: "gold",
  },
  {
    label: "Outcomes",
    body: "Results on the ground",
    icon: Target,
    tone: "gold",
  },
]

export const constraintCards: ConstraintCard[] = [
  {
    label: "Consent",
    body: "States must agree. Nothing is automatic.",
    icon: UsersRound,
  },
  {
    label: "Veto",
    body: "A single state can block collective action.",
    icon: Hand,
  },
  {
    label: "Political Will",
    body: "Leaders choose what matters most.",
    icon: Vote,
  },
  {
    label: "Leverage",
    body: "Power, resources, and influence shape options.",
    icon: ShieldCheck,
  },
  {
    label: "Uneven Enforcement",
    body: "Rules apply differently across situations.",
    icon: CircleDot,
  },
]

export const systemPressureCopy = {
  eyebrow: "Chapter 3",
  title: "The System Under Pressure",
  support: "Institutions organize cooperation. Politics tests the limits.",
  institutionKicker: "Institution Rooms",
  constraintsKicker: "Constraints That Limit Outcomes",
  coordinationLabel: "Coordination",
  pressureLabel: "Pressure",
  roomLink: "How the system rooms work together",
  takeawayTitle: "Key takeaway",
  takeaway:
    "Institutions make cooperation possible. Politics decides how far it goes.",
  closing: "The system is not powerless. But it is not all-powerful either.",
  nextKicker: "Next",
  nextTitle: "West Philippine Sea Case File",
  activeChapterId: "system-under-pressure",
  logoAsset:
    "/images/public-homepage/resource-pack/hero/governance-compass-mark-01.png",
  takeawayIcon: Lightbulb,
  roomLinkIcon: Landmark,
  flowIcon: ArrowRight,
}
