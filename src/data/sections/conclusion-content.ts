import type {
  NarrativeDisclosure,
  NarrativeSectionContent,
} from "@/data/sections/narrative-types"
import { getConclusionReferenceSources } from "@/data/source-bundles/approved-source-bundle"

export function hasCompleteConclusionReferences(
  disclosure: NarrativeDisclosure
) {
  const references = disclosure.references ?? []

  return (
    references.length >= 3 &&
    references.every(
      (source) =>
        source.sourceId.trim() &&
        source.title.trim() &&
        source.provenance.trim() &&
        source.summary.trim() &&
        source.whyItMatters.trim()
    )
  )
}

export const conclusionContent: NarrativeSectionContent = {
  id: "conclusion-references",
  navigationLabel: "Conclusion and references",
  eyebrow: "Wrap-up",
  title: "Global governance is the work of making shared rules usable",
  summary:
    "The project’s thesis is that global governance is not world government; it is the practical, contested work of coordinating states through institutions, law, norms, evidence, and public accountability.",
  thesis:
    "When learners can see both the promise and the limits of the system, they can judge international problems with more clarity and less fatalism.",
  supportingDetails: [
    "The core narrative begins with shared problems, moves through the UN as a coordination system, confronts enforcement limits, and tests the pattern through the West Philippine Sea.",
    "The sources below keep the closing claim inspectable: they show the institutional design, legal limits, and public-accountability record behind the journey.",
  ],
  disclosures: [
    {
      title: "Inspect the sources",
      collapsedSummary:
        "Open three approved source notes that anchor the thesis without turning the ending into a document dump.",
      details: [
        "These references support the project thesis from three angles: the UN's institutional architecture, the legal record around the West Philippine Sea, and the broader public-accountability logic of rules-based cooperation.",
      ],
      unavailableMessage:
        "Source support is temporarily unavailable. The conclusion remains readable, but the approved references need complete metadata before they can be inspected here.",
      references: getConclusionReferenceSources(),
    },
  ],
  synthesis:
    "The clean takeaway: global governance is imperfect because it works through states, but it matters because shared rules give people a way to argue, organize, and demand better conduct.",
  recap: {
    takeaway:
      "This chapter closed the journey with the thesis intact: global governance is imperfect, contested, and still worth understanding.",
    nextStepLabel: "Return to Journey start",
    nextStepTargetId: "journey-start",
  },
}
