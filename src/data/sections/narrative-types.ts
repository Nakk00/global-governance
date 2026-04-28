export type NarrativeDisclosure = {
  title: string
  collapsedSummary: string
  details: string[]
  references?: NarrativeReferenceSource[]
  unavailableMessage?: string
}

export type NarrativeReferenceSource = {
  sourceId: string
  title: string
  provenance: string
  summary: string
  whyItMatters: string
}

export type NarrativeRecapContent = {
  takeaway: string
  nextStepLabel?: string
  nextStepTargetId?: string
}

export type NarrativeSectionContent = {
  id: string
  navigationLabel: string
  eyebrow: string
  title: string
  summary: string
  thesis: string
  supportingDetails: string[]
  disclosures: NarrativeDisclosure[]
  synthesis: string
  recap?: NarrativeRecapContent
}

export type ChapterTransitionContent = {
  label: string
  title: string
  body: string
}
