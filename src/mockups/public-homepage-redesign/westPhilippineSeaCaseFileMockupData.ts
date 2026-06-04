import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  FileSearch,
  FileText,
  FolderOpen,
  Gavel,
  Globe2,
  Landmark,
  Layers,
  Map,
  MapPinned,
  MessageCircle,
  RefreshCw,
  Scale,
  ScrollText,
  Search,
  Shield,
  ShieldCheck,
  Target,
  TriangleAlert,
  Users,
} from "lucide-react"
import type { ComponentType } from "react"

export type WpsCaseFileIcon = ComponentType<{
  "aria-hidden"?: boolean
  className?: string
}>

export type WpsCaseFileChapter = {
  id: string
  number: string
  label: string
  shortLabel: string
}

export type WpsCaseFileUtility = {
  label: string
  icon: WpsCaseFileIcon
}

export type WpsCaseFileTimelineItem = {
  id: string
  year: string
  title: string
  summary: string
  detail: string
  icon: WpsCaseFileIcon
}

export type WpsCaseFileMapLabel = {
  id: string
  label: string
  position:
    | "luzon"
    | "palawan"
    | "west-philippine-sea"
    | "spratly-islands"
    | "scarborough-shoal"
}

export type WpsCaseFileLegendItem = {
  label: string
  tone: "eez" | "tribunal" | "claim" | "baseline"
}

export type WpsCaseFileEvidenceCategory = {
  id: string
  title: string
  summary: string
  sourceTypeLabel: string
  tone: "history" | "geography" | "legal" | "conduct"
  icon: WpsCaseFileIcon
}

export type WpsCaseFileRulingRealityRow = {
  id: string
  legalClarity: string
  politicalReality: string
}

export type WpsCaseFileThesisAction = {
  id: string
  label: string
  detail: string
  icon: WpsCaseFileIcon
}

export type WpsCaseFileReferenceItem = {
  id: string
  title: string
  detail: string
  icon: WpsCaseFileIcon
}

export type WpsCaseFileTrustCategory = {
  id: string
  label: string
  detail: string
  tone: "primary" | "secondary"
}

const assetRoot =
  "/images/public-homepage/resource-pack/west-philippine-sea-case-file"

export const wpsCaseFileBackground = `${assetRoot}/backgrounds/chapter-4-west-philippine-sea-case-file-background-01.png`

export const wpsCaseFileMapBase = `${assetRoot}/maps/chapter-4-west-philippine-sea-maritime-map-base-01.png`

export const wpsCaseFileChapters: WpsCaseFileChapter[] = [
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
    label: "The System Under Pressure",
    shortLabel: "The System Under Pressure",
  },
  {
    id: "west-philippine-sea-dossier",
    number: "4",
    label: "West Philippine Sea Case File",
    shortLabel: "West Philippine Sea Case File",
  },
]

export const wpsCaseFileUtilities: WpsCaseFileUtility[] = [
  { label: "Search", icon: Search },
  { label: "Glossary", icon: BookOpen },
  { label: "Guide", icon: ShieldCheck },
  { label: "Chat", icon: MessageCircle },
]

export const wpsCaseFileCopy = {
  activeChapterId: "west-philippine-sea-dossier",
  brandLogoAsset:
    "/images/public-homepage/resource-pack/hero/governance-compass-mark-01.png",
  eyebrow: "Chapter 4",
  title: "West Philippine Sea Case File",
  subtitle: "A ruling can clarify rights. Politics decides what changes.",
  timelineTitle: "Timeline",
  timelineCta: "View timeline details",
  mapTitle: "Maritime Case Map",
  mapSummary:
    "The map frames Luzon, Palawan, Scarborough Shoal, and the Spratly Islands against EEZ, tribunal, claim, and baseline references.",
  evidenceTitle: "Evidence",
  evidenceCta: "Explore all evidence",
  comparisonTitle: "Ruling vs Reality",
  legalHeading: "Legal Clarity",
  legalSubheading: "(2016 Award)",
  realityHeading: "Political Reality",
  realitySubheading: "(Today)",
  awardNote:
    "The Award is final and without appeal. Its full effect depends on political will and consistent, lawful action.",
  finalThesisTitle: "Final Thesis",
  finalThesisBody:
    "International law provides clarity; it does not by itself ensure change. The 2016 Award affirms the Philippines' rights in the West Philippine Sea. Sustained diplomacy, lawful conduct, and stronger institutions are needed to turn legal victories into lasting realities.",
  referencesTitle: "References & Sources",
  trustTitle: "Source Trust Guide",
  chatTitle: "Ask a question about this chapter",
  chatMeta: "Source-aware • Cite-verified",
  headingIcon: Compass,
  timelineIcon: Clock,
  mapIcon: MapPinned,
  evidenceIcon: FolderOpen,
  comparisonIcon: Scale,
  legalIcon: CheckCircle2,
  realityIcon: TriangleAlert,
  awardIcon: Globe2,
  finalThesisIcon: Target,
  referencesIcon: FileText,
  trustIcon: Shield,
  chatIcon: MessageCircle,
  detailIcon: ArrowRight,
}

export const wpsCaseFileTimeline: WpsCaseFileTimelineItem[] = [
  {
    id: "arbitration-filing",
    year: "2012",
    title: "Philippines initiates arbitration under UNCLOS.",
    summary: "A maritime standoff becomes a legal case.",
    detail:
      "The dispute moves from contested access at sea into a formal legal track, showing how public claims can become institutional questions.",
    icon: FileText,
  },
  {
    id: "tribunal-constituted",
    year: "2013",
    title: "The Tribunal is constituted; proceedings begin.",
    summary: "The case record starts to take shape.",
    detail:
      "Arbitration gives the Philippines a forum to clarify maritime rights without asking the tribunal to decide sovereignty over land features.",
    icon: Gavel,
  },
  {
    id: "final-award",
    year: "2016",
    title: "Arbitral Tribunal issues the Final Award on 12 July 2016.",
    summary: "Legal clarity enters the record.",
    detail:
      "The Award rejects broad historic-rights claims and clarifies the role of UNCLOS in maritime entitlements.",
    icon: Scale,
  },
  {
    id: "post-award",
    year: "Post-2016",
    title: "Implementation remains limited; conditions on the ground persist.",
    summary: "Politics still shapes practical change.",
    detail:
      "The ruling changes the diplomatic and legal frame, but compliance, enforcement, and daily access still depend on state choices.",
    icon: RefreshCw,
  },
]

export const wpsCaseFileMapLabels: WpsCaseFileMapLabel[] = [
  { id: "luzon", label: "Luzon", position: "luzon" },
  { id: "palawan", label: "Palawan", position: "palawan" },
  {
    id: "west-philippine-sea",
    label: "West Philippine Sea",
    position: "west-philippine-sea",
  },
  {
    id: "spratly-islands",
    label: "Spratly Islands",
    position: "spratly-islands",
  },
  {
    id: "scarborough-shoal",
    label: "Scarborough Shoal",
    position: "scarborough-shoal",
  },
]

export const wpsCaseFileLegend: WpsCaseFileLegendItem[] = [
  { label: "Philippine EEZ (200 nm)", tone: "eez" },
  { label: "Arbitral Tribunal Jurisdiction", tone: "tribunal" },
  { label: "Claim Line (Nine-Dash Line)", tone: "claim" },
  { label: "Baselines", tone: "baseline" },
]

export const wpsCaseFileEvidenceCategories: WpsCaseFileEvidenceCategory[] = [
  {
    id: "historic-use",
    title: "Historic Use of Waters and Features",
    summary: "Longstanding Philippine activities in the area.",
    sourceTypeLabel: "Historical Records",
    tone: "history",
    icon: ScrollText,
  },
  {
    id: "geographic-realities",
    title: "Geographic & Maritime Realities",
    summary: "Features, distances, and entitlements under UNCLOS.",
    sourceTypeLabel: "Geo-Spatial Data",
    tone: "geography",
    icon: Map,
  },
  {
    id: "legal-findings",
    title: "Legal Findings (2016 Award)",
    summary: "Rulings on jurisdiction, maritime rights, and entitlements.",
    sourceTypeLabel: "Tribunal Award",
    tone: "legal",
    icon: Landmark,
  },
  {
    id: "state-practice",
    title: "State Practice & Conduct",
    summary: "Official acts, protests, and diplomacy.",
    sourceTypeLabel: "Official Records",
    tone: "conduct",
    icon: FileSearch,
  },
]

export const wpsCaseFileRulingRealityRows: WpsCaseFileRulingRealityRow[] = [
  {
    id: "nine-dash-line",
    legalClarity: "Nine-dash line has no legal basis.",
    politicalReality: "The line continues to be asserted.",
  },
  {
    id: "scarborough-eez",
    legalClarity:
      "Features like Scarborough Shoal are within the Philippine EEZ.",
    politicalReality: "Access remains restricted; incidents continue.",
  },
  {
    id: "spratly-entitlements",
    legalClarity:
      "No feature in the Spratly Islands generates an EEZ or continental shelf.",
    politicalReality: "Artificial features and outposts remain in place.",
  },
  {
    id: "sovereign-rights",
    legalClarity: "Philippines' sovereign rights in its EEZ are well-founded.",
    politicalReality:
      "Interference with fishing, surveys, and resource activities persists.",
  },
  {
    id: "respect-rights",
    legalClarity: "Obligation to respect Philippines' rights under UNCLOS.",
    politicalReality: "Compliance remains inadequate.",
  },
]

export const wpsCaseFileThesisActions: WpsCaseFileThesisAction[] = [
  {
    id: "protect-rights",
    label: "Protect rights through law and diplomacy.",
    detail: "Legal clarity needs steady public and diplomatic follow-through.",
    icon: ShieldCheck,
  },
  {
    id: "strengthen-capacity",
    label: "Strengthen institutions and maritime capacity.",
    detail: "Implementation depends on institutions able to act lawfully.",
    icon: Globe2,
  },
  {
    id: "build-partnerships",
    label: "Build partnerships for a rules-based maritime order.",
    detail: "Regional and international support raises the cost of disregard.",
    icon: Users,
  },
  {
    id: "educate-public",
    label: "Educate, inform, and uphold the truth at sea.",
    detail: "Public understanding keeps the record visible and accountable.",
    icon: BookOpen,
  },
]

export const wpsCaseFileReferences: WpsCaseFileReferenceItem[] = [
  {
    id: "pca-award",
    title:
      "PCA Case No. 2013-19, The Republic of the Philippines v. The People's Republic of China",
    detail: "12 July 2016",
    icon: BookOpen,
  },
  {
    id: "unclos",
    title: "United Nations Convention on the Law of the Sea (UNCLOS)",
    detail: "1982",
    icon: Landmark,
  },
  {
    id: "dfa",
    title: "Philippine Department of Foreign Affairs (DFA)",
    detail: "Official statements and briefs",
    icon: FileText,
  },
  {
    id: "namria",
    title: "National Mapping & Resource Information Authority (NAMRIA)",
    detail: "Maritime baselines",
    icon: Compass,
  },
  {
    id: "asean",
    title: "ASEAN Regional Forum (ARF)",
    detail: "Statements on maritime security and cooperation",
    icon: Users,
  },
]

export const wpsCaseFileTrustCategories: WpsCaseFileTrustCategory[] = [
  {
    id: "primary",
    label: "Primary",
    detail: "Official & legal documents",
    tone: "primary",
  },
  {
    id: "secondary",
    label: "Secondary",
    detail: "Technical & academic sources",
    tone: "secondary",
  },
]

export const wpsCaseFileLayerIcon = Layers
