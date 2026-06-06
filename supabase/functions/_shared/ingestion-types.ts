import type { ApprovedSourceType } from "../../../src/data/source-bundles/approved-source-bundle.ts"

export type SupportedIngestionFileType = "md" | "pdf"

export type IngestionStorageTarget = {
  bucket: "project-source-pdfs" | "processed-exports"
  path: string
}

export type IngestionInput = {
  sourceId: string
  sourcePath: string
  fileType: SupportedIngestionFileType | string
  content: string
  storage?: IngestionStorageTarget
  metadata?: Record<string, unknown>
}

export type EmbeddingConfig = {
  provider: "dry-run"
  model: "deterministic-dry-run-vector"
  dimensions: 384
  meanPool: true
  normalize: true
  synthetic: true
}

export type EmbeddingVector = number[]

export const pinnedEmbeddingConfig: EmbeddingConfig = {
  provider: "dry-run",
  model: "deterministic-dry-run-vector",
  dimensions: 384,
  meanPool: true,
  normalize: true,
  synthetic: true,
}

export type IngestionDocumentRecord = {
  id: string
  sourceId: string
  sourceType: ApprovedSourceType
  title: string
  sourcePath: string
  storageBucket: IngestionStorageTarget["bucket"] | null
  storagePath: string | null
  fileType: SupportedIngestionFileType
  checksum: string
  version: string
  embeddingConfig: EmbeddingConfig
  metadata: Record<string, unknown>
}

export type IngestionChunkRecord = {
  id: string
  documentId: string
  sourceId: string
  chunkIndex: number
  content: string
  contentChecksum: string
  tokenCount: number
  embedding: EmbeddingVector
  metadata: Record<string, unknown>
}

export type IngestionReferenceRecord = {
  id: string
  documentId: string
  sourceId: string
  citationLabel: string
  sourceTitle: string
  canonicalUrl: string | null
  chunkIds: string[]
  metadata: Record<string, unknown>
}

export type IngestionPayload = {
  document: IngestionDocumentRecord
  chunks: IngestionChunkRecord[]
  references: IngestionReferenceRecord[]
}

export type PersistedIngestionPayload = IngestionPayload & {
  referenceChunks: Array<{
    referenceId: string
    chunkId: string
  }>
}
