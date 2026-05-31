export type ChapterNavigationItem = {
  id: string
  number: number
  label: string
  shellLabel: string
  mobileLabel: string
  eyebrow: string
  summary: string
  themeKey?: string
  defaultPanelId?: string
  chapterKind?:
    | "hero"
    | "overview"
    | "module"
    | "analysis"
    | "case-file"
    | "conclusion"
}

export const chapterNavigation: ChapterNavigationItem[] = [
  {
    id: "hero-narrative-frame",
    number: 1,
    label: "Hero Narrative Frame",
    shellLabel: "Hero Narrative Frame",
    mobileLabel: "Hero",
    eyebrow: "Opening",
    summary:
      "Establish the topic, tone, and reason to continue into the learning journey.",
    themeKey: "hero",
    chapterKind: "hero",
  },
  {
    id: "global-governance-overview",
    number: 2,
    label: "Global governance overview",
    shellLabel: "Global Governance Overview",
    mobileLabel: "Overview",
    eyebrow: "Big idea",
    summary:
      "See how states, institutions, law, and norms coordinate action across borders.",
    themeKey: "overview",
    defaultPanelId: "system-framing",
    chapterKind: "overview",
  },
  {
    id: "un-command-center",
    number: 3,
    label: "UN Command Center",
    shellLabel: "UN Command Center",
    mobileLabel: "UN",
    eyebrow: "Institutions",
    summary:
      "Meet the major UN bodies and the different jobs they perform in the system.",
    themeKey: "command-center",
    defaultPanelId: "general-assembly",
    chapterKind: "module",
  },
  {
    id: "governance-limits",
    number: 4,
    label: "Governance limits and enforcement",
    shellLabel: "Governance Limits and Enforcement",
    mobileLabel: "Limits",
    eyebrow: "Constraints",
    summary:
      "Track why global rules can matter even when enforcement depends on politics and consent.",
    themeKey: "limits",
    defaultPanelId: "ideal-vs-reality",
    chapterKind: "analysis",
  },
  {
    id: "west-philippine-sea-dossier",
    number: 5,
    label: "West Philippine Sea dossier",
    shellLabel: "West Philippine Sea Dossier",
    mobileLabel: "WPS",
    eyebrow: "Case file",
    summary:
      "Use a regional dispute to test how law, institutions, and state behavior interact.",
    themeKey: "dossier",
    defaultPanelId: "timeline",
    chapterKind: "case-file",
  },
  {
    id: "conclusion-references",
    number: 6,
    label: "Conclusion and references",
    shellLabel: "Conclusion and References",
    mobileLabel: "Conclusion",
    eyebrow: "Wrap-up",
    summary:
      "Return to the core thesis and the sources that ground the learning journey.",
    themeKey: "conclusion",
    chapterKind: "conclusion",
  },
]

export const journeyStartSection: ChapterNavigationItem = {
  id: "journey-start",
  number: 0,
  label: "Journey start",
  shellLabel: "Journey Start",
  mobileLabel: "Start",
  eyebrow: "Orientation",
  summary:
    "Start with the throughline: cooperation, power, and shared problems without a world government.",
  themeKey: "orientation",
}

export const defaultChapterId = chapterNavigation[0].id
export const chapterCount = chapterNavigation.length

export function isChapterId(value: string) {
  return chapterNavigation.some((item) => item.id === value)
}

export function getChapterById(id: string) {
  return chapterNavigation.find((item) => item.id === id) ?? null
}

export function isKnownSectionId(value: string) {
  return isChapterId(value) || value === journeyStartSection.id
}

export function getChapterIndex(id: string) {
  return chapterNavigation.findIndex((item) => item.id === id)
}

export function getAdjacentChapterId(
  id: string,
  direction: "previous" | "next"
) {
  const currentIndex = getChapterIndex(id)

  if (currentIndex < 0) {
    return null
  }

  const adjacentIndex =
    direction === "previous" ? currentIndex - 1 : currentIndex + 1

  return chapterNavigation[adjacentIndex]?.id ?? null
}
