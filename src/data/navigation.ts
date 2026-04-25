export type ChapterNavigationItem = {
  id: string
  label: string
  eyebrow: string
  summary: string
}

export const chapterNavigation: ChapterNavigationItem[] = [
  {
    id: "hero-narrative-frame",
    label: "Hero Narrative Frame",
    eyebrow: "Opening",
    summary:
      "Establish the topic, tone, and reason to continue into the learning journey.",
  },
  {
    id: "global-governance-overview",
    label: "Global governance overview",
    eyebrow: "Big idea",
    summary:
      "See how states, institutions, law, and norms coordinate action across borders.",
  },
  {
    id: "un-command-center",
    label: "UN Command Center",
    eyebrow: "Institutions",
    summary:
      "Meet the major UN bodies and the different jobs they perform in the system.",
  },
  {
    id: "governance-limits",
    label: "Governance limits and enforcement",
    eyebrow: "Constraints",
    summary:
      "Track why global rules can matter even when enforcement depends on politics and consent.",
  },
  {
    id: "west-philippine-sea-dossier",
    label: "West Philippine Sea dossier",
    eyebrow: "Case file",
    summary:
      "Use a regional dispute to test how law, institutions, and state behavior interact.",
  },
  {
    id: "conclusion-references",
    label: "Conclusion and references",
    eyebrow: "Wrap-up",
    summary:
      "Return to the core thesis and the sources that ground the learning journey.",
  },
]

export const journeyStartSection: ChapterNavigationItem = {
  id: "journey-start",
  label: "Journey start",
  eyebrow: "Orientation",
  summary:
    "Start with the throughline: cooperation, power, and shared problems without a world government.",
}

export const defaultChapterId = chapterNavigation[0].id

export function isChapterId(value: string) {
  return chapterNavigation.some((item) => item.id === value)
}

export function isKnownSectionId(value: string) {
  return isChapterId(value) || value === journeyStartSection.id
}

export function getChapterIndex(id: string) {
  return chapterNavigation.findIndex((item) => item.id === id)
}
