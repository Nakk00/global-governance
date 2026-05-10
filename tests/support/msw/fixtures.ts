export const maintainerSession = {
  accessToken: "maintainer-token",
  expiresAt: 1_893_456_000,
  user: { id: "user-123", email: "admin@example.test" },
}

export const adminIdentity = {
  userId: "user-123",
  email: "admin@example.test",
  role: "admin",
  isActive: true,
}

export const stewardshipDashboard = {
  overview: {
    sourceCount: 2,
    activeSourceCount: 2,
    draftSourceCount: 0,
    partialSourceCount: 1,
    latestIngestionStatus: "warning",
    latestValidationStatus: "warning",
    readinessState: "partial",
  },
  monitoring: {
    readiness: {
      label: "Readiness",
      value: "2/2 active",
      tone: "warning",
      detail: "Active approved sources ready for learner-facing grounding.",
    },
    blockers: {
      label: "Blockers",
      value: "1",
      tone: "critical",
      detail:
        "Draft, partial, or failed validation items needing maintainer attention.",
    },
    validationHealth: {
      label: "Validation health",
      value: "Warning",
      tone: "warning",
      detail: "1 warning and 0 failed source validation signals.",
    },
    nextActions: [
      {
        label: "Close partial evidence",
        detail: "1 source record needs ingestion follow-up.",
        href: "/maintainer/sources",
        priority: "high",
      },
    ],
  },
  auditTrail: {
    totalEvents: 1,
    latestOutcome: "succeeded",
    latestEventAt: "2026-05-05T00:02:00Z",
    recentEvents: [
      {
        eventId: "audit-1",
        sourceId: "gg-src-un-charter-institutions",
        eventType: "audit",
        outcome: "succeeded",
        origin: "admin@example.test",
        occurredAt: "2026-05-05T00:02:00Z",
        summary: "Lifecycle action recorded for stewarded source.",
      },
    ],
  },
  chatbotTrust: {
    state: "partial",
    groundedSourceCount: 1,
    validationRunCount: 1,
    latestValidationStatus: "warning",
    warningCount: 1,
    failedCount: 0,
    evidence: [
      {
        label: "Grounded sources",
        value: "1",
        tone: "good",
        detail:
          "Active chat-scoped sources with successful ingestion evidence.",
      },
      {
        label: "Validation coverage",
        value: "1",
        tone: "warning",
        detail:
          "Canonical validation signals available to the private console.",
      },
    ],
  },
  sources: [
    {
      sourceId: "gg-src-un-charter-institutions",
      title: "Charter of the United Nations",
      sourceType: "primary",
      lifecycleState: "active",
      aliases: [],
      usageScope: ["presentation", "chat", "ingestion"],
      provenance:
        "Foundational UN treaty; institutional design; primary source",
      ingestionReadiness: "partial",
      latestValidationOutcome: "warning",
      latestIngestJob: null,
      partialData: [
        { field: "ingestionReadiness", reason: "No persisted document yet." },
      ],
    },
    {
      sourceId: "gg-src-south-china-sea-award",
      title: "South China Sea Arbitration Award",
      sourceType: "case",
      lifecycleState: "active",
      aliases: ["wps-src-2016-tribunal-award"],
      usageScope: ["presentation", "chat", "evidence", "ingestion"],
      provenance: "2016 UNCLOS tribunal award; legal record",
      ingestionReadiness: "ready",
      latestValidationOutcome: "succeeded",
      latestIngestJob: null,
      partialData: [],
    },
  ],
  ingestionRuns: [
    {
      eventId: "ingest-1",
      sourceId: "gg-src-un-charter-institutions",
      eventType: "ingest",
      outcome: "succeeded",
      origin: "admin@example.test",
      occurredAt: "2026-05-05T00:00:00Z",
      summary: "UN Charter source ingested into the retrieval index.",
    },
  ],
  validationRuns: [
    {
      eventId: "validation-1",
      sourceId: "gg-src-un-charter-institutions",
      eventType: "validation",
      outcome: "warning",
      origin: "admin@example.test",
      occurredAt: "2026-05-05T00:01:00Z",
      summary: "Demo readiness validation completed with weak support.",
    },
  ],
  auditEvents: [
    {
      eventId: "audit-1",
      sourceId: "gg-src-un-charter-institutions",
      eventType: "audit",
      outcome: "succeeded",
      origin: "admin@example.test",
      occurredAt: "2026-05-05T00:02:00Z",
      summary: "Lifecycle action recorded for stewarded source.",
    },
  ],
}

export const sourceDetail = {
  ...stewardshipDashboard.sources[0],
  summary:
    "Defines the UN purposes, organs, member obligations, and coordination role.",
  metadata: {
    canonicalSourceId: "gg-src-un-charter-institutions",
    sourceType: "primary",
  },
  approvalLineage: [],
  ingestionProvenance: [],
  validationHistory: [],
  auditTrail: [],
}

export const chunkInspection = {
  anchor: {
    documentId: "doc-un-charter-v2",
    version: "v2",
    sourceId: "gg-src-un-charter-institutions",
    state: "ready",
    message:
      "Inspecting chunk records from the latest successful document revision.",
    nextStep: "Re-ingest if the visible evidence is stale or incomplete.",
  },
  chunks: [
    {
      id: "chunk-un-charter-0",
      documentId: "doc-un-charter-v2",
      sourceId: "gg-src-un-charter-institutions",
      chunkIndex: 0,
      tokenCount: 42,
      contentPreview: "The UN Charter establishes the organs and obligations.",
      embeddingPresent: true,
      activeState: "ready",
      pageNumber: 1,
      heading: "Preamble",
      metadata: {},
    },
  ],
  partialData: [],
}

export const citationInspection = {
  anchor: chunkInspection.anchor,
  citations: [
    {
      id: "ref-un-charter",
      documentId: "doc-un-charter-v2",
      sourceId: "gg-src-un-charter-institutions",
      citationLabel: "Charter of the United Nations",
      displayLabel: "UN Charter",
      linkedChunkIds: ["chunk-un-charter-0"],
      activeState: "ready",
      pageNumber: 1,
      sectionHeading: "Preamble",
      metadata: {},
    },
  ],
  partialData: [],
}

export const chunkDetail = {
  ...chunkInspection.chunks[0],
  content: "The UN Charter establishes the organs and obligations.",
  linkedCitationIds: ["ref-un-charter"],
  createdAt: "2026-05-05T00:00:00Z",
  updatedAt: "2026-05-05T00:00:00Z",
}

export const citationDetail = {
  ...citationInspection.citations[0],
  sourceTitle: "Charter of the United Nations",
  sourcePath: "bootstrap-approved-source-bundle",
  copyableLabel: "UN Charter",
  linkedChunks: chunkInspection.chunks,
}

export const validationSets = {
  defaultSetId: "demo-readiness-v1",
  sets: [
    {
      validationSetId: "demo-readiness-v1",
      name: "Demo Readiness v1",
      description: "Baseline demo checks.",
      version: 1,
      isDefault: true,
      questionCount: 5,
      createdBy: "system-seed",
      createdAt: "2026-05-05T00:00:00Z",
      updatedAt: "2026-05-05T00:00:00Z",
    },
  ],
}

export const validationRun = {
  runId: "val-run-1",
  validationSetId: "demo-readiness-v1",
  validationSetName: "Demo Readiness v1",
  validationSetVersion: 1,
  status: "completed",
  totalCount: 5,
  passCount: 1,
  weakSupportCount: 1,
  refusedCount: 1,
  failedCount: 1,
  errorCount: 1,
  averageLatencyMs: 685,
  createdBy: "admin@example.test",
  createdAt: "2026-05-05T00:00:00Z",
  startedAt: "2026-05-05T00:00:01Z",
  completedAt: "2026-05-05T00:00:05Z",
  sourceSnapshotIds: ["gg-src-un-charter-institutions@active"],
  state: "ready",
  notes: "Immutable validation run completed.",
  results: [
    {
      resultId: "result-pass",
      validationQuestionId: "demo-q-grounded-un-charter",
      questionText: "What is the UN Security Council's role?",
      expectedState: "grounded",
      actualState: "grounded",
      outcome: "pass",
      answerPreview: "The Security Council has primary responsibility...",
      retrievedSourceIds: ["gg-src-un-charter-institutions"],
      citationIds: ["ref-un-charter"],
      supportScore: 0.93,
      latencyMs: 840,
      notes: "Expected grounded answer matched.",
      createdAt: "2026-05-05T00:00:05Z",
    },
  ],
  auditEvents: [],
}

export const validationRunList = {
  runs: [validationRun],
}

export const answeredChatResponse = {
  state: "answered",
  answer:
    "Global governance coordinates rules and institutions without becoming a world government.",
  grounding: {
    supportLevel: "strong",
    cue: "Grounded with 1 approved source",
  },
  citations: [
    {
      sourceId: "gg-src-global-governance-course-frame",
      title: "Global Governance Course Frame",
      shortTitle: "Course frame",
      sourceType: "course",
      detail:
        "The course frame distinguishes global governance from world government.",
    },
  ],
}

export const weakSupportChatResponse = {
  state: "weakSupport",
  message:
    "The approved materials do not support a confident answer to that question.",
  nextStep:
    "Reframe the question around the course sources, the UN, or the West Philippine Sea dossier.",
  grounding: {
    supportLevel: "weak",
    cue: "Limited support in approved materials",
  },
  citations: [],
}

export const refusedChatResponse = {
  state: "refused",
  code: "off_topic",
  message:
    "I can only help with this Global Governance course and its approved materials.",
  nextStep:
    "Try a question about the UN, global governance, or the West Philippine Sea case.",
}

export const cooldownChatResponse = {
  state: "cooldown",
  code: "abuse_cooldown",
  message:
    "The assistant is temporarily limited after repeated off-topic prompts.",
  nextStep: "Wait briefly before trying a course-focused question.",
  retryAfterSeconds: 60,
}
