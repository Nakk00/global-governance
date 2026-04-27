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

export type WpsTimelineEvent = {
  id: string
  year: string
  label: string
  summary: string
  context: string
  legalContext: string
  significance: string
}

export const wpsTimelineEvents: WpsTimelineEvent[] = [
  {
    id: "scarborough-shoal-incident",
    year: "2012",
    label: "Scarborough Shoal incident",
    summary:
      "A standoff near Scarborough Shoal brings maritime claims and state presence into sharper public view.",
    context:
      "Philippine and Chinese vessels faced one another around Scarborough Shoal, turning an already contested maritime space into a visible dispute over control, access, and official presence.",
    legalContext:
      "The incident raised questions about maritime entitlements, historic-rights claims, and how the UN Convention on the Law of the Sea frames rights at sea.",
    significance:
      "It made the dispute concrete for learners: governance questions were no longer abstract rules, but choices made by states on the water.",
  },
  {
    id: "arbitration-filing",
    year: "2013",
    label: "Arbitration filing",
    summary:
      "The Philippines brings the dispute into compulsory arbitration under UNCLOS.",
    context:
      "The Philippines initiated arbitration to challenge parts of China's maritime claims and seek legal clarification without trying to settle sovereignty over land features.",
    legalContext:
      "The filing used UNCLOS dispute-settlement procedures to ask a tribunal to interpret maritime rights, entitlements, and the legal status of features.",
    significance:
      "It shows how a state can use institutions to narrow the argument, move from rhetoric to legal questions, and create a public record.",
  },
  {
    id: "tribunal-ruling",
    year: "2016",
    label: "Tribunal ruling",
    summary:
      "The arbitral tribunal clarifies key maritime rights and rejects broad historic-rights claims.",
    context:
      "The tribunal issued its award after reviewing the legal claims and evidence presented in the case.",
    legalContext:
      "The ruling found no legal basis for broad historic-rights claims within the nine-dash line and clarified how UNCLOS treats maritime zones and features.",
    significance:
      "It gave legal clarity to the dispute and became a reference point for diplomacy, public explanation, and future claims-making.",
  },
  {
    id: "enforcement-limits",
    year: "Post-2016",
    label: "Enforcement limits",
    summary:
      "Legal clarity does not automatically change behavior without political follow-through and enforcement capacity.",
    context:
      "After the ruling, tensions and contested activity continued, showing that a legal outcome can shape the debate without instantly settling conduct at sea.",
    legalContext:
      "International rulings can clarify obligations and rights, but institutions often depend on state compliance, diplomacy, and collective pressure for practical effect.",
    significance:
      "This is the governance lesson: law can strengthen legitimacy and coordination, while enforcement still depends on power, strategy, and public accountability.",
  },
]

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
