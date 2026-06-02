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
    label: "Global Governance Overview",
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
    label: "The System Under Pressure",
    shellLabel: "The System Under Pressure",
    mobileLabel: "Pressure",
    eyebrow: "Institutions under pressure",
    summary:
      "Institutions organize cooperation while politics tests enforcement limits.",
    themeKey: "system-pressure",
    defaultPanelId: "general-assembly",
    chapterKind: "analysis",
  },
  {
    id: "west-philippine-sea-dossier",
    number: 4,
    label: "West Philippine Sea Case File",
    shellLabel: "West Philippine Sea Case File",
    mobileLabel: "WPS Case",
    eyebrow: "Case file",
    summary:
      "Use a regional dispute to test how law, institutions, and state behavior interact.",
    themeKey: "dossier",
    defaultPanelId: "timeline",
    chapterKind: "case-file",
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
const legacySectionRedirects = {
  [journeyStartSection.id]: "global-governance-overview",
  "governance-limits": "un-command-center",
  "conclusion-references": "west-philippine-sea-dossier",
} as const

export function isChapterId(value: string) {
  return chapterNavigation.some((item) => item.id === value)
}

export function getChapterById(id: string) {
  return chapterNavigation.find((item) => item.id === id) ?? null
}

export function isKnownSectionId(value: string) {
  return isChapterId(value) || value in legacySectionRedirects
}

export function resolveKnownSectionId(value: string) {
  if (isChapterId(value)) {
    return value
  }

  return (
    legacySectionRedirects[value as keyof typeof legacySectionRedirects] ?? null
  )
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
