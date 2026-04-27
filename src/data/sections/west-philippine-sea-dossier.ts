import type { NarrativeSectionContent } from "@/data/sections/narrative-types"

export type WpsDossierShellContent = {
  chapterLabel: string
  investigationLabel: string
  openingCue: string
  entryLabel: string
  entryPrompt: string
  controls: {
    title: string
    detail: string
  }[]
}

export const westPhilippineSeaDossier: NarrativeSectionContent = {
  id: "west-philippine-sea-dossier",
  navigationLabel: "West Philippine Sea dossier",
  eyebrow: "Case file",
  title: "The West Philippine Sea turns the theory into a test",
  summary:
    "The West Philippine Sea dispute shows how legal rulings, maritime claims, regional diplomacy, and state behavior interact when institutions clarify rules but cannot instantly settle power politics.",
  thesis:
    "The case matters because it makes the abstract tension visible: rules can clarify rights, while enforcement still depends on political strategy and collective response.",
  supportingDetails: [
    "A case dossier approach helps separate the legal question from the political question. What does the rule say? Who accepts it? What behavior changes, and what behavior continues?",
    "It also shows why public explanation matters. Citizens need more than slogans; they need a way to connect institutions, evidence, and consequences.",
  ],
  disclosures: [
    {
      title: "How to read the dispute as a governance case",
      collapsedSummary:
        "Track claims, legal findings, state behavior, diplomatic response, and public consequences as separate but connected layers.",
      details: [
        "The legal layer asks what standards apply. The institutional layer asks where disputes are heard. The political layer asks how states respond when outcomes affect interest and identity.",
        "Keeping those layers distinct helps learners avoid the false choice between 'law solves everything' and 'law means nothing.'",
      ],
    },
  ],
  synthesis:
    "The case shows the central lesson of the journey: global governance is strongest when law, institutions, evidence, and public accountability reinforce one another.",
  recap: {
    takeaway:
      "This chapter tested the theory in a real dispute, where law clarifies claims while politics shapes what changes on the water.",
    nextStepLabel: "Continue to Conclusion and references",
    nextStepTargetId: "conclusion-references",
  },
}

export const wpsDossierShell: WpsDossierShellContent = {
  chapterLabel: "Chapter: West Philippine Sea dossier",
  investigationLabel: "Evidence-led investigation",
  openingCue:
    "Open the case as a continuation of the journey: the same question about rules and power now meets a concrete maritime dispute.",
  entryLabel: "Dossier entry",
  entryPrompt:
    "Use these two entry points to begin the chapter before the later evidence tools arrive.",
  controls: [
    {
      title: "Open the evidence file",
      detail:
        "Start with the record: claims, rulings, state behavior, and public consequences should be read as connected evidence, not as isolated headlines.",
    },
    {
      title: "Trace law and power",
      detail:
        "Follow the tension this case exposes: legal clarity can shape claims and diplomacy even when enforcement still depends on political choices.",
    },
  ],
}
