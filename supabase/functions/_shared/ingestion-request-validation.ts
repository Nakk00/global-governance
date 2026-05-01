import type {
  IngestionInput,
  IngestionStorageTarget,
  SupportedIngestionFileType,
} from "./ingestion-types.ts"

type PdfIngestionRequest = {
  sourceId: string
  sourcePath: string
  pdfBase64: string
  storage: IngestionStorageTarget
  metadata?: Record<string, unknown>
}

export function parseContentIngestionRequest(value: unknown): IngestionInput {
  const record = asRecord(value)
  const fileType = readFileType(record.fileType)

  if (fileType !== "md") {
    if (fileType === "pdf") {
      throw new Error("Use ingest-pdf for PDF ingestion.")
    }

    throw new Error(
      `Unsupported ingestion file type: ${String(record.fileType)}`
    )
  }

  return {
    sourceId: readRequiredString(record.sourceId, "sourceId"),
    sourcePath: readRequiredString(record.sourcePath, "sourcePath"),
    fileType,
    content: readRequiredString(record.content, "content"),
    storage: readOptionalStorage(record.storage),
    metadata: readOptionalMetadata(record.metadata),
  }
}

export function parsePdfIngestionRequest(value: unknown): PdfIngestionRequest {
  const record = asRecord(value)
  const storage = readRequiredStorage(record.storage)

  if (storage.bucket !== "project-source-pdfs") {
    throw new Error(
      "PDF ingestion must store raw files in project-source-pdfs."
    )
  }

  return {
    sourceId: readRequiredString(record.sourceId, "sourceId"),
    sourcePath: readRequiredString(record.sourcePath, "sourcePath"),
    pdfBase64: readRequiredString(record.pdfBase64, "pdfBase64"),
    storage,
    metadata: readOptionalMetadata(record.metadata),
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Ingestion request body must be an object.")
  }

  return value as Record<string, unknown>
}

function readRequiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `Ingestion request field "${field}" must be a non-empty string.`
    )
  }

  return value
}

function readFileType(value: unknown): SupportedIngestionFileType | "unknown" {
  return value === "md" || value === "pdf" ? value : "unknown"
}

function readOptionalStorage(
  value: unknown
): IngestionStorageTarget | undefined {
  if (typeof value === "undefined") {
    return undefined
  }

  return readRequiredStorage(value)
}

function readRequiredStorage(value: unknown): IngestionStorageTarget {
  const record = asRecord(value)
  const bucket = record.bucket
  const path = readRequiredString(record.path, "storage.path")

  if (bucket !== "project-source-pdfs" && bucket !== "processed-exports") {
    throw new Error('Ingestion request field "storage.bucket" is invalid.')
  }

  return {
    bucket,
    path,
  }
}

function readOptionalMetadata(
  value: unknown
): Record<string, unknown> | undefined {
  if (typeof value === "undefined") {
    return undefined
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error('Ingestion request field "metadata" must be an object.')
  }

  return value as Record<string, unknown>
}
