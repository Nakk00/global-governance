import {
  activeApprovedSourceBundle,
  getApprovedSource,
} from "../../../src/data/source-bundles/approved-source-bundle.ts"
import {
  type IngestionInput,
  type IngestionPayload,
  type PersistedIngestionPayload,
  type SupportedIngestionFileType,
  pinnedEmbeddingConfig,
} from "./ingestion-types.ts"

type ApprovedIngestionInput = Omit<IngestionInput, "fileType"> & {
  fileType: SupportedIngestionFileType
}

export type InMemoryIngestionStore = {
  documents: IngestionPayload["document"][]
  chunks: IngestionPayload["chunks"]
  references: IngestionPayload["references"]
  referenceChunks: PersistedIngestionPayload["referenceChunks"]
}

const approvedSourceRoot = "archive/docs/approved-sources/"

export function createInMemoryIngestionStore(): InMemoryIngestionStore {
  return {
    documents: [],
    chunks: [],
    references: [],
    referenceChunks: [],
  }
}

export function validateIngestionInput(
  input: IngestionInput
): ApprovedIngestionInput {
  if (input.fileType !== "md" && input.fileType !== "pdf") {
    throw new Error(`Unsupported ingestion file type: ${input.fileType}`)
  }

  const normalizedSourcePath = normalizeSourcePath(input.sourcePath)

  if (!normalizedSourcePath.startsWith(approvedSourceRoot)) {
    throw new Error(
      "Approved source inputs must live under archive/docs/approved-sources/"
    )
  }

  if (
    input.fileType === "pdf" &&
    (!input.storage ||
      input.storage.bucket !== "project-source-pdfs" ||
      input.storage.path.trim().length === 0)
  ) {
    throw new Error(
      "PDF ingestion requires a private project-source-pdfs storage target"
    )
  }

  getApprovedSource(input.sourceId)

  return {
    ...input,
    sourcePath: normalizedSourcePath,
    content: input.content.trim(),
    fileType: input.fileType,
  }
}

export async function buildIngestionPayload(
  input: IngestionInput
): Promise<IngestionPayload> {
  const validated = validateIngestionInput(input)
  const source = getApprovedSource(validated.sourceId)
  const normalizedContent = normalizeContent(validated.content)

  if (normalizedContent.length === 0) {
    throw new Error("Approved source content cannot be empty")
  }

  const checksum = await stableHash(normalizedContent)
  const documentId = `doc_${source.sourceId}_${checksum.slice(0, 16)}`
  const chunks = await Promise.all(
    chunkContent(normalizedContent).map(async (content, chunkIndex) => ({
      id: `${documentId}_chunk_${chunkIndex.toString().padStart(4, "0")}`,
      documentId,
      sourceId: source.sourceId,
      chunkIndex,
      content,
      contentChecksum: await stableHash(content),
      tokenCount: countApproximateTokens(content),
      embedding: buildDeterministicEmbedding(content),
      metadata: {
        sourcePath: validated.sourcePath,
        fileType: validated.fileType,
      },
    }))
  )

  return {
    document: {
      id: documentId,
      sourceId: source.sourceId,
      sourceType: source.sourceType,
      title: source.title,
      sourcePath: validated.sourcePath,
      storageBucket: validated.storage?.bucket ?? null,
      storagePath: validated.storage?.path ?? null,
      fileType: validated.fileType,
      checksum,
      version: activeApprovedSourceBundle.bundleVersion,
      embeddingConfig: pinnedEmbeddingConfig,
      metadata: {
        bundleId: activeApprovedSourceBundle.bundleId,
        bundleVersion: activeApprovedSourceBundle.bundleVersion,
        sourceType: source.sourceType,
        storage: {
          private: true,
          bucket: validated.storage?.bucket ?? null,
          path: validated.storage?.path ?? null,
        },
        ...(validated.metadata ?? {}),
      },
    },
    chunks,
    references: [
      {
        id: `${documentId}_ref_${source.sourceId}`,
        documentId,
        sourceId: source.sourceId,
        citationLabel: source.shortTitle,
        sourceTitle: source.title,
        canonicalUrl: source.url ?? null,
        chunkIds: chunks.map((chunk) => chunk.id),
        metadata: {
          bundleId: activeApprovedSourceBundle.bundleId,
          bundleVersion: activeApprovedSourceBundle.bundleVersion,
          sourceType: source.sourceType,
        },
      },
    ],
  }
}

export async function ingestIntoMemoryStore(
  input: IngestionInput,
  store: InMemoryIngestionStore
): Promise<PersistedIngestionPayload> {
  const payload = await buildIngestionPayload(input)
  const documentId = payload.document.id
  const referenceChunks = payload.references.flatMap((reference) =>
    reference.chunkIds.map((chunkId) => ({
      referenceId: reference.id,
      chunkId,
    }))
  )

  store.documents = [
    ...store.documents.filter((record) => record.id !== documentId),
    payload.document,
  ]
  store.chunks = [
    ...store.chunks.filter((record) => record.documentId !== documentId),
    ...payload.chunks,
  ]
  store.references = [
    ...store.references.filter((record) => record.documentId !== documentId),
    ...payload.references,
  ]
  store.referenceChunks = [
    ...store.referenceChunks.filter(
      (record) =>
        !payload.references.some(
          (reference) => reference.id === record.referenceId
        )
    ),
    ...referenceChunks,
  ]

  return {
    ...payload,
    referenceChunks,
  }
}

export function extractPdfText(bytes: Uint8Array): string {
  const decoded = new TextDecoder("latin1").decode(bytes)

  if (!decoded.startsWith("%PDF-")) {
    throw new Error("Malformed PDF input: missing PDF header")
  }

  const textRuns = Array.from(decoded.matchAll(/\(([^()]*)\)\s*Tj/g)).map(
    ([, text]) => text?.replaceAll("\\(", "(").replaceAll("\\)", ")") ?? ""
  )
  const extracted = normalizeContent(textRuns.join("\n"))

  if (extracted.length === 0) {
    throw new Error("Malformed PDF input: no extractable text")
  }

  return extracted
}

function normalizeContent(content: string): string {
  return content
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function chunkContent(content: string): string[] {
  return content
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
}

function countApproximateTokens(content: string): number {
  return content.split(/\s+/).filter(Boolean).length
}

function normalizeSourcePath(sourcePath: string): string {
  const normalized = sourcePath.replaceAll("\\", "/")
  const segments: string[] = []

  for (const segment of normalized.split("/")) {
    if (segment.length === 0 || segment === ".") {
      continue
    }

    if (segment === "..") {
      throw new Error(
        "Approved source paths must stay inside the source corpus"
      )
    }

    segments.push(segment)
  }

  return segments.join("/")
}

function buildDeterministicEmbedding(content: string): number[] {
  const vector: number[] = []
  let state = 2166136261

  for (const character of content) {
    state ^= character.charCodeAt(0)
    state = Math.imul(state, 16777619)
  }

  for (let index = 0; index < pinnedEmbeddingConfig.dimensions; index += 1) {
    state ^= index + 1
    state = Math.imul(state, 2246822519)
    const normalized = ((state >>> 0) / 0xffffffff) * 2 - 1
    vector.push(Number(normalized.toFixed(8)))
  }

  return vector
}

async function stableHash(content: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(content)
  )

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}
