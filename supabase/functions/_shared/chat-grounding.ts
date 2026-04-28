type ChatSourceType = "primary" | "course" | "case" | "reference"

type ApprovedSource = {
  sourceId: string
  title: string
  shortTitle: string
  sourceType: ChatSourceType
  detail: string
  url?: string
  keywords: string[]
}

type ChatCitation = Omit<ApprovedSource, "keywords">
type GroundedChatContext = {
  currentSectionId?: string
}

type GroundedChatEnvelope =
  | {
      success: true
      data:
        | {
            state: "answered"
            answer: string
            grounding: {
              supportLevel: "strong"
              cue: string
            }
            citations: ChatCitation[]
          }
        | {
            state: "weakSupport"
            message: string
            nextStep: string
            grounding: {
              supportLevel: "weak"
              cue: string
            }
            citations: ChatCitation[]
          }
    }
  | {
      success: false
      error: {
        code: string
        message: string
      }
    }

const approvedSources: ApprovedSource[] = [
  {
    sourceId: "gg-src-un-charter-institutions",
    title: "Charter of the United Nations",
    shortTitle: "UN Charter",
    sourceType: "primary",
    detail:
      "The Charter explains the UN purposes, sovereign equality, and institutional coordination role used in the course.",
    url: "https://www.un.org/en/about-us/un-charter/full-text",
    keywords: ["un", "charter", "security", "council", "coordinate"],
  },
  {
    sourceId: "gg-src-global-governance-course-frame",
    title: "Global Governance Course Frame",
    shortTitle: "Course frame",
    sourceType: "course",
    detail:
      "The course distinguishes global governance from world government and frames institutions as coordination tools.",
    keywords: ["global", "governance", "government", "institution"],
  },
  {
    sourceId: "gg-src-wps-arbitral-ruling",
    title: "West Philippine Sea Arbitral Ruling",
    shortTitle: "WPS ruling",
    sourceType: "case",
    detail:
      "The case material connects legal clarity to the political limits of enforcement in maritime disputes.",
    keywords: ["west", "philippine", "sea", "wps", "ruling", "arbitral"],
  },
]

const sourceInspectionKeywords = ["approved", "source", "sources", "inspect"]
const speculativeKeywords = [
  "should",
  "tomorrow",
  "next",
  "predict",
  "recommend",
  "best",
  "vote",
  "ought",
]
const sectionSourceMap: Record<string, string[]> = {
  "journey-start": ["gg-src-global-governance-course-frame"],
  "hero-narrative-frame": ["gg-src-global-governance-course-frame"],
  "global-governance-overview": ["gg-src-global-governance-course-frame"],
  "un-command-center": [
    "gg-src-un-charter-institutions",
    "gg-src-global-governance-course-frame",
  ],
  "governance-limits": [
    "gg-src-un-charter-institutions",
    "gg-src-global-governance-course-frame",
  ],
  "west-philippine-sea-dossier": ["gg-src-wps-arbitral-ruling"],
  "conclusion-references": [
    "gg-src-un-charter-institutions",
    "gg-src-global-governance-course-frame",
    "gg-src-wps-arbitral-ruling",
  ],
}

function getScopedSources(currentSectionId?: string) {
  const sourceIds =
    currentSectionId && sectionSourceMap[currentSectionId]
      ? sectionSourceMap[currentSectionId]
      : approvedSources.map((source) => source.sourceId)

  return approvedSources.filter((source) => sourceIds.includes(source.sourceId))
}

function countKeywordHits(question: string, source: ApprovedSource) {
  return source.keywords.filter((keyword) => question.includes(keyword)).length
}

function isSourceInspectionQuestion(question: string) {
  return sourceInspectionKeywords.some((keyword) => question.includes(keyword))
}

function isSpeculativeQuestion(question: string) {
  return speculativeKeywords.some((keyword) => question.includes(keyword))
}

function toCitation(source: ApprovedSource): ChatCitation {
  return {
    sourceId: source.sourceId,
    title: source.title,
    shortTitle: source.shortTitle,
    sourceType: source.sourceType,
    detail: source.detail,
    ...(source.url ? { url: source.url } : {}),
  }
}

export function retrieveApprovedSources(
  question: string,
  context?: GroundedChatContext
): ChatCitation[] {
  const normalizedQuestion = question.toLowerCase()
  const scopedSources = getScopedSources(context?.currentSectionId)

  if (isSourceInspectionQuestion(normalizedQuestion)) {
    return scopedSources.map(toCitation).slice(0, 3)
  }

  const matches = scopedSources
    .map((source) => ({
      source,
      score: countKeywordHits(normalizedQuestion, source),
    }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .map(({ source }) => source)

  return matches.map(toCitation).slice(0, 3)
}

function hasStrongGrounding({
  question,
  citations,
  context,
}: {
  question: string
  citations: ChatCitation[]
  context?: GroundedChatContext
}) {
  const normalizedQuestion = question.toLowerCase()

  if (citations.length === 0) {
    return false
  }

  if (isSourceInspectionQuestion(normalizedQuestion)) {
    return true
  }

  if (isSpeculativeQuestion(normalizedQuestion)) {
    return false
  }

  const scopedSourceIds = new Set(
    getScopedSources(context?.currentSectionId).map((source) => source.sourceId)
  )

  if (context?.currentSectionId) {
    return citations.some((citation) => scopedSourceIds.has(citation.sourceId))
  }

  const totalKeywordHits = citations.reduce((count, citation) => {
    const source = approvedSources.find(
      (candidate) => candidate.sourceId === citation.sourceId
    )

    return source ? count + countKeywordHits(normalizedQuestion, source) : count
  }, 0)

  return citations.length > 1 || totalKeywordHits > 1
}

export function assembleGroundedChatResponse({
  question,
  sources,
  context,
}: {
  question: string
  sources: ChatCitation[]
  context?: GroundedChatContext
}): GroundedChatEnvelope {
  if (
    !hasStrongGrounding({
      question,
      citations: sources,
      context,
    })
  ) {
    return {
      success: true,
      data: {
        state: "weakSupport",
        message:
          "I can connect this to the course, but the approved materials do not support a confident answer.",
        nextStep:
          "Try asking about global governance, the UN system, or the West Philippine Sea case.",
        grounding: {
          supportLevel: "weak",
          cue: "Limited support in approved materials",
        },
        citations: [],
      },
    }
  }

  const primarySource = sources[0]
  const questionFocus = question.trim().replace(/[?.!]+$/, "")

  return {
    success: true,
    data: {
      state: "answered",
      answer: `Grounded in approved course materials, ${questionFocus} is best read through the course's central claim: global governance coordinates rules, institutions, and state behavior without becoming world government. The sources support this as a curriculum helper, not as open-ended speculation.`,
      grounding: {
        supportLevel: "strong",
        cue: `Grounded with ${sources.length} approved source${sources.length === 1 ? "" : "s"}`,
      },
      citations: [primarySource, ...sources.slice(1)],
    },
  }
}

export function createChatErrorEnvelope(
  code: string,
  message: string
): GroundedChatEnvelope {
  return {
    success: false,
    error: {
      code,
      message,
    },
  }
}
