export type ApprovedSourceFile = {
  path: string
  sourceId: string
  fileType: "md" | "pdf"
  storage?: {
    bucket: "project-source-pdfs" | "processed-exports"
    path: string
  }
}

export const approvedSourceFiles: ApprovedSourceFile[] = [
  {
    path: "archive/docs/approved-sources/raw/topic-1-global-governance-basics-knowledge.md",
    sourceId: "gg-src-global-governance-course-frame",
    fileType: "md",
  },
  {
    path: "archive/docs/approved-sources/raw/topic-2-major-actors-global-governance-knowledge.md",
    sourceId: "gg-src-global-governance-course-frame",
    fileType: "md",
  },
  {
    path: "archive/docs/approved-sources/raw/topic-3-united-nations-purpose-structure-knowledge.md",
    sourceId: "gg-src-un-charter-institutions",
    fileType: "md",
  },
  {
    path: "archive/docs/approved-sources/raw/topic-4-limits-criticisms-global-governance-knowledge.md",
    sourceId: "gg-src-global-governance-course-frame",
    fileType: "md",
  },
  {
    path: "archive/docs/approved-sources/raw/topic-5-international-law-dispute-resolution-knowledge.md",
    sourceId: "gg-src-philippines-arbitration-filing",
    fileType: "md",
  },
  {
    path: "archive/docs/approved-sources/raw/topic-6-west-philippine-sea-south-china-sea-case-knowledge.md",
    sourceId: "gg-src-south-china-sea-award",
    fileType: "md",
  },
  {
    path: "archive/docs/approved-sources/raw/topic-7-enforcement-gap-ruling-vs-reality-knowledge.md",
    sourceId: "gg-src-wps-enforcement-gap-comparison",
    fileType: "md",
  },
  {
    path: "archive/docs/approved-sources/raw/topic-8-asean-and-regional-governance-knowledge.md",
    sourceId: "gg-src-wps-political-reality-record",
    fileType: "md",
  },
]
