export type ApprovedSourceLifecycle =
  | {
      state: "active"
    }
  | {
      state: "deprecated"
      replacementSourceId: string
      note: string
    }

export type ApprovedSourceType = "primary" | "course" | "case" | "reference"

export type ApprovedSourceUsageScope =
  | "presentation"
  | "chat"
  | "evidence"
  | "ingestion"

export type ApprovedSourceRecord = {
  sourceId: string
  sourceType: ApprovedSourceType
  title: string
  shortTitle: string
  provenance: string
  summary: string
  whyItMatters: string
  detail: string
  usageScope: ApprovedSourceUsageScope[]
  lifecycle: ApprovedSourceLifecycle
  aliases: string[]
  ingestion: {
    status: "ready-for-later-preparation"
    boundary: string
  }
  url?: string
  keywords: string[]
}

export type ConclusionReferenceAdapter = {
  sourceId: string
}

export type ChatCitationAdapter = {
  sourceId: string
  sectionIds: string[]
}

export type DossierEvidenceAdapter = {
  ownerType: "timeline" | "comparison"
  ownerId: string
  sourceId: string
}

export type ApprovedSourceBundle = {
  bundleId: string
  bundleVersion: string
  status: "active"
  ordering: "sourceId-ascending"
  reviewContract: {
    repoManaged: true
    publicMaintainerDashboard: false
    presentationBoundary: string
    ingestionBoundary: string
    idImmutability: string
    aliasBehavior: string
    deprecationHandling: string
    versionBumpRules: string[]
    diffReviewPath: string
  }
  sources: ApprovedSourceRecord[]
  adapters: {
    conclusionReferences: ConclusionReferenceAdapter[]
    chatCitations: ChatCitationAdapter[]
    dossierEvidence: DossierEvidenceAdapter[]
  }
}

const sourceRecords: ApprovedSourceRecord[] = [
  {
    sourceId: "gg-src-global-governance-course-frame",
    sourceType: "course",
    title: "Global Governance Course Frame",
    shortTitle: "Course frame",
    provenance: "Repo-authored course framing; curriculum source",
    summary:
      "Defines the course distinction between global governance and world government, with institutions framed as coordination tools.",
    whyItMatters:
      "It keeps chat answers and early chapter references tied to the course thesis instead of open-ended political commentary.",
    detail:
      "The course distinguishes global governance from world government and frames institutions as coordination tools.",
    usageScope: ["chat", "ingestion"],
    lifecycle: { state: "active" },
    aliases: [],
    ingestion: {
      status: "ready-for-later-preparation",
      boundary:
        "Story 5.1 approves the source identity only; Story 5.2 prepares chunks, files, and embeddings.",
    },
    keywords: ["global", "governance", "government", "institution"],
  },
  {
    sourceId: "gg-src-philippines-arbitration-filing",
    sourceType: "case",
    title: "Philippines Notification and Statement of Claim",
    shortTitle: "Arbitration filing",
    provenance: "2013 legal filing; UNCLOS arbitration; case initiation",
    summary:
      "Identifies the legal questions the Philippines brought under UNCLOS dispute settlement.",
    whyItMatters:
      "It shows how the dispute moved from maritime confrontation into an institutional process with defined questions.",
    detail:
      "The filing identifies the legal questions the Philippines brought under UNCLOS dispute settlement.",
    usageScope: ["evidence", "ingestion"],
    lifecycle: { state: "active" },
    aliases: ["wps-src-2013-arbitration-filing"],
    ingestion: {
      status: "ready-for-later-preparation",
      boundary:
        "Approved for evidence identity; retrieval packaging belongs to the ingestion story.",
    },
    keywords: ["arbitration", "filing", "philippines", "unclos"],
  },
  {
    sourceId: "gg-src-post-award-compliance-record",
    sourceType: "case",
    title: "Post-Award Compliance and Diplomacy Record",
    shortTitle: "Post-award record",
    provenance:
      "Post-2016 implementation context; diplomacy; enforcement limits",
    summary:
      "Tracks continued maritime pressure, diplomatic positioning, and public accountability after the award.",
    whyItMatters:
      "It supports the governance lesson that law can shape legitimacy while practical change still depends on state action.",
    detail:
      "A post-award source cluster tracking continued maritime pressure, diplomatic positioning, and public accountability.",
    usageScope: ["evidence", "ingestion"],
    lifecycle: { state: "active" },
    aliases: ["wps-src-post-2016-compliance"],
    ingestion: {
      status: "ready-for-later-preparation",
      boundary:
        "Approved for evidence identity; later ingestion must define concrete source files.",
    },
    keywords: ["post", "award", "compliance", "diplomacy", "enforcement"],
  },
  {
    sourceId: "gg-src-scarborough-standoff-record",
    sourceType: "case",
    title: "Scarborough Shoal Standoff Public Record",
    shortTitle: "Scarborough record",
    provenance: "2012 maritime incident; timeline source; contested access",
    summary:
      "Shows how official vessels and access claims turned Scarborough Shoal into a visible dispute.",
    whyItMatters:
      "It anchors the opening milestone in observable state behavior instead of treating the dispute as an abstract claim.",
    detail:
      "A contemporary incident record showing how official vessels and access claims turned the shoal into a visible dispute.",
    usageScope: ["evidence", "ingestion"],
    lifecycle: { state: "active" },
    aliases: ["wps-src-2012-scarborough"],
    ingestion: {
      status: "ready-for-later-preparation",
      boundary:
        "Approved for evidence identity; later source preparation decides final document packaging.",
    },
    keywords: ["scarborough", "shoal", "standoff", "maritime"],
  },
  {
    sourceId: "gg-src-south-china-sea-award",
    sourceType: "case",
    title: "South China Sea Arbitration Award",
    shortTitle: "SCS award",
    provenance:
      "2016 UNCLOS tribunal award; legal record; West Philippine Sea case",
    summary:
      "Clarifies maritime entitlements and legal findings while showing that legal judgment and political enforcement remain different problems.",
    whyItMatters:
      "It supports the journey's central tension: rules can clarify claims and strengthen accountability even when enforcement is contested.",
    detail:
      "The case material connects legal clarity to the political limits of enforcement in maritime disputes.",
    usageScope: ["presentation", "chat", "evidence", "ingestion"],
    lifecycle: { state: "active" },
    aliases: ["gg-src-wps-arbitral-ruling", "wps-src-2016-tribunal-award"],
    ingestion: {
      status: "ready-for-later-preparation",
      boundary:
        "Approved for presentation, chat, and evidence identity; Story 5.2 owns chunking and retrieval preparation.",
    },
    keywords: ["west", "philippine", "sea", "wps", "ruling", "arbitral"],
  },
  {
    sourceId: "gg-src-sustainable-development-report",
    sourceType: "reference",
    title: "UN Sustainable Development Goals Report",
    shortTitle: "SDG report",
    provenance:
      "UN public progress report; accountability evidence; policy snapshot",
    summary:
      "Tracks shared goals, uneven progress, and the public evidence governments use to compare commitments against visible outcomes.",
    whyItMatters:
      "It shows why global governance still matters in practice: common measures help people argue, organize, and demand better conduct.",
    detail:
      "The SDG report gives learners a public-accountability example for shared goals and visible outcomes.",
    usageScope: ["presentation", "ingestion"],
    lifecycle: { state: "active" },
    aliases: [],
    ingestion: {
      status: "ready-for-later-preparation",
      boundary:
        "Approved for presentation identity; ingestion source file selection is deferred.",
    },
    keywords: ["sustainable", "development", "goals", "accountability"],
  },
  {
    sourceId: "gg-src-un-charter-institutions",
    sourceType: "primary",
    title: "Charter of the United Nations",
    shortTitle: "UN Charter",
    provenance: "Foundational UN treaty; institutional design; primary source",
    summary:
      "Defines the UN's purposes, organs, member obligations, and Security Council structure that frame the chapter's institutional overview.",
    whyItMatters:
      "It grounds the thesis that global governance coordinates states through shared institutions rather than replacing state sovereignty.",
    detail:
      "The Charter explains the UN purposes, sovereign equality, and institutional coordination role used in the course.",
    usageScope: ["presentation", "chat", "ingestion"],
    lifecycle: { state: "active" },
    aliases: [],
    ingestion: {
      status: "ready-for-later-preparation",
      boundary:
        "Approved as a source identity; privileged retrieval and citation packaging stay server-side.",
    },
    url: "https://www.un.org/en/about-us/un-charter/full-text",
    keywords: ["un", "charter", "security", "council", "coordinate"],
  },
  {
    sourceId: "gg-src-wps-enforcement-gap-comparison",
    sourceType: "case",
    title: "Tribunal Award and Post-Award Conduct Comparison",
    shortTitle: "Enforcement gap",
    provenance:
      "Comparison source; legal outcome versus implementation; UNCLOS",
    summary:
      "Pairs the award and later conduct to separate legal clarification from enforcement capacity.",
    whyItMatters:
      "It helps learners verify why the ruling mattered even though it did not automatically change behavior at sea.",
    detail:
      "A paired reading of the award and later conduct that separates legal clarification from enforcement capacity.",
    usageScope: ["evidence", "ingestion"],
    lifecycle: { state: "active" },
    aliases: ["wps-src-comparison-enforcement-gap"],
    ingestion: {
      status: "ready-for-later-preparation",
      boundary:
        "Approved as a dossier comparison identity; later ingestion decides exact source grouping.",
    },
    keywords: ["enforcement", "gap", "comparison", "implementation"],
  },
  {
    sourceId: "gg-src-wps-political-reality-record",
    sourceType: "case",
    title: "Diplomatic Response and State Behavior Record",
    shortTitle: "Political reality",
    provenance: "Comparison source; diplomacy; state behavior",
    summary:
      "Records how states used diplomacy, reputation, and capacity after the award.",
    whyItMatters:
      "It keeps the comparison grounded in political incentives rather than implying law and power are separate worlds.",
    detail:
      "A governance-focused record of how states used diplomacy, reputation, and capacity after the award.",
    usageScope: ["evidence", "ingestion"],
    lifecycle: { state: "active" },
    aliases: ["wps-src-comparison-political-reality"],
    ingestion: {
      status: "ready-for-later-preparation",
      boundary:
        "Approved as a dossier comparison identity; later ingestion decides exact source grouping.",
    },
    keywords: ["diplomacy", "state", "behavior", "political", "reality"],
  },
]

export const activeApprovedSourceBundle: ApprovedSourceBundle = {
  bundleId: "global-governance-approved-sources",
  bundleVersion: "2026.05.01",
  status: "active",
  ordering: "sourceId-ascending",
  reviewContract: {
    repoManaged: true,
    publicMaintainerDashboard: false,
    presentationBoundary:
      "Browser consumers may render adapter metadata from this bundle, but they must not mutate approved sources or perform privileged retrieval.",
    ingestionBoundary:
      "This bundle approves source identities and metadata only. Story 5.2 owns file preparation, chunking, embeddings, and storage records.",
    idImmutability:
      "Published sourceId values are contract identifiers. Do not rename or remove one silently after it appears in this bundle.",
    aliasBehavior:
      "Legacy ids and renamed ids must be listed in aliases and resolved to a canonical active source before consumers use them.",
    deprecationHandling:
      "Deprecated sources remain visible in the manifest with a replacementSourceId and note until all consumers migrate.",
    versionBumpRules: [
      "Bump the bundle version for membership, metadata, usage-scope, lifecycle, alias, adapter, or ordering changes.",
      "Keep source records ordered by sourceId and adapter arrays ordered by owner key, then sourceId, so git diffs show the real change.",
      "Review the bundle diff before ingestion or answer-generation changes consume the new inventory.",
    ],
    diffReviewPath:
      "Inspect this file in git before changing ingestion, references, chat citations, or dossier evidence; no public maintainer UI is part of this workflow.",
  },
  sources: sourceRecords,
  adapters: {
    conclusionReferences: [
      { sourceId: "gg-src-un-charter-institutions" },
      { sourceId: "gg-src-south-china-sea-award" },
      { sourceId: "gg-src-sustainable-development-report" },
    ],
    chatCitations: [
      {
        sourceId: "gg-src-global-governance-course-frame",
        sectionIds: [
          "journey-start",
          "hero-narrative-frame",
          "global-governance-overview",
          "governance-limits",
          "un-command-center",
          "conclusion-references",
        ],
      },
      {
        sourceId: "gg-src-south-china-sea-award",
        sectionIds: ["west-philippine-sea-dossier", "conclusion-references"],
      },
      {
        sourceId: "gg-src-un-charter-institutions",
        sectionIds: [
          "un-command-center",
          "governance-limits",
          "conclusion-references",
        ],
      },
    ],
    dossierEvidence: [
      {
        ownerType: "comparison",
        ownerId: "enforcement-gap",
        sourceId: "gg-src-wps-enforcement-gap-comparison",
      },
      {
        ownerType: "comparison",
        ownerId: "political-reality",
        sourceId: "gg-src-wps-political-reality-record",
      },
      {
        ownerType: "timeline",
        ownerId: "arbitration-filing",
        sourceId: "gg-src-philippines-arbitration-filing",
      },
      {
        ownerType: "timeline",
        ownerId: "enforcement-limits",
        sourceId: "gg-src-post-award-compliance-record",
      },
      {
        ownerType: "timeline",
        ownerId: "scarborough-shoal-incident",
        sourceId: "gg-src-scarborough-standoff-record",
      },
      {
        ownerType: "timeline",
        ownerId: "tribunal-ruling",
        sourceId: "gg-src-south-china-sea-award",
      },
    ],
  },
}

export function resolveApprovedSourceId(sourceId: string): string {
  const source = activeApprovedSourceBundle.sources.find(
    (candidate) =>
      candidate.sourceId === sourceId || candidate.aliases.includes(sourceId)
  )

  if (!source) {
    throw new Error(`Unknown approved source id: ${sourceId}`)
  }

  if (source.lifecycle.state === "deprecated") {
    return source.lifecycle.replacementSourceId
  }

  return source.sourceId
}

export function getApprovedSource(sourceId: string): ApprovedSourceRecord {
  const canonicalSourceId = resolveApprovedSourceId(sourceId)
  const source = activeApprovedSourceBundle.sources.find(
    (candidate) => candidate.sourceId === canonicalSourceId
  )

  if (!source || source.lifecycle.state !== "active") {
    throw new Error(`Inactive approved source id: ${sourceId}`)
  }

  return source
}

export function getConclusionReferenceSources() {
  return activeApprovedSourceBundle.adapters.conclusionReferences.map(
    ({ sourceId }) => {
      const source = getApprovedSource(sourceId)

      return {
        sourceId: source.sourceId,
        title: source.title,
        provenance: source.provenance,
        summary: source.summary,
        whyItMatters: source.whyItMatters,
      }
    }
  )
}

export function getDossierEvidenceSources() {
  return activeApprovedSourceBundle.adapters.dossierEvidence.map((adapter) => {
    const source = getApprovedSource(adapter.sourceId)

    return {
      ownerType: adapter.ownerType,
      ownerId: adapter.ownerId,
      sourceId: source.sourceId,
      sourceLabel: source.title,
      summary: source.summary,
      metadata: source.provenance,
      whyItMatters: source.whyItMatters,
    }
  })
}

export function getChatCitationSources() {
  return activeApprovedSourceBundle.adapters.chatCitations.map((adapter) => {
    const source = getApprovedSource(adapter.sourceId)

    return {
      sourceId: source.sourceId,
      title: source.title,
      shortTitle: source.shortTitle,
      sourceType: source.sourceType,
      detail: source.detail,
      url: source.url,
      keywords: source.keywords,
      sectionIds: adapter.sectionIds,
    }
  })
}
