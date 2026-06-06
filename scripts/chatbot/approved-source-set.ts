import { readFileSync } from "node:fs"

export type ApprovedSourceFile = {
  path: string
  sourceId: string
  fileType: "md" | "pdf"
  revision: string
  storage: {
    bucket: "project-source-pdfs" | "processed-exports"
    path: string
  }
  lineage: {
    kind: "raw" | "normalized"
    rawSourcePath: string
  }
}

type ManifestEntry = {
  sourcePath?: unknown
  sourceId?: unknown
  fileType?: unknown
  revision?: unknown
  storage?: {
    bucket?: unknown
    path?: unknown
  }
  lineage?: {
    kind?: unknown
    rawSourcePath?: unknown
  }
}

type ApprovedSourceManifest = {
  version?: unknown
  sources?: unknown
}

const manifestPath = "archive/docs/approved-sources/manifest.json"

export const approvedSourceFiles = loadApprovedSourceFiles()

function loadApprovedSourceFiles(): ApprovedSourceFile[] {
  const manifest = JSON.parse(
    readFileSync(manifestPath, "utf8")
  ) as ApprovedSourceManifest
  if (
    typeof manifest.version !== "string" ||
    !Array.isArray(manifest.sources)
  ) {
    throw new Error("Approved source manifest is malformed")
  }

  return manifest.sources.map((value, index) =>
    parseManifestEntry(value as ManifestEntry, index)
  )
}

function parseManifestEntry(
  entry: ManifestEntry,
  index: number
): ApprovedSourceFile {
  const path = requiredString(entry.sourcePath, `${index}.sourcePath`)
  const sourceId = requiredString(entry.sourceId, `${index}.sourceId`)
  const fileType = entry.fileType
  const revision = requiredString(entry.revision, `${index}.revision`)
  const bucket = entry.storage?.bucket
  const storagePath = requiredString(
    entry.storage?.path,
    `${index}.storage.path`
  )
  const lineageKind = entry.lineage?.kind
  const rawSourcePath = requiredString(
    entry.lineage?.rawSourcePath,
    `${index}.lineage.rawSourcePath`
  )

  if (fileType !== "md" && fileType !== "pdf") {
    throw new Error(`Unsupported manifest file type at entry ${index}`)
  }
  if (bucket !== "project-source-pdfs" && bucket !== "processed-exports") {
    throw new Error(`Unsupported manifest storage bucket at entry ${index}`)
  }
  if (lineageKind !== "raw" && lineageKind !== "normalized") {
    throw new Error(`Unsupported manifest lineage at entry ${index}`)
  }

  return {
    path,
    sourceId,
    fileType,
    revision,
    storage: {
      bucket,
      path: storagePath,
    },
    lineage: {
      kind: lineageKind,
      rawSourcePath,
    },
  }
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Approved source manifest field ${field} is required`)
  }
  return value.trim()
}
