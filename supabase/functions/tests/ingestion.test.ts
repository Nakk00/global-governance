import { readFileSync } from "node:fs"

import { describe, expect, it } from "vitest"

import {
  buildIngestionPayload,
  createInMemoryIngestionStore,
  extractPdfText,
  ingestIntoMemoryStore,
  validateIngestionInput,
} from "../_shared/ingestion-pipeline"
import {
  parseContentIngestionRequest,
  parsePdfIngestionRequest,
} from "../_shared/ingestion-request-validation"
import { pinnedEmbeddingConfig } from "../_shared/ingestion-types"

const sourcePath =
  "archive/docs/approved-sources/raw/topic-1-global-governance-basics-knowledge.md"

const markdownInput = {
  sourceId: "gg-src-global-governance-course-frame",
  sourcePath,
  fileType: "md",
  content: [
    "# Global Governance Basics",
    "",
    "Global governance coordinates states through institutions, rules, and public accountability.",
    "",
    "It is not the same as world government because sovereign states still retain authority.",
  ].join("\n"),
} as const

describe("ingestion pipeline helpers", () => {
  it("builds deterministic documents, chunks, references, and embedding config for unchanged input", async () => {
    const firstPayload = await buildIngestionPayload(markdownInput)
    const secondPayload = await buildIngestionPayload(markdownInput)

    expect(secondPayload).toEqual(firstPayload)
    expect(firstPayload.document.id).toBe(
      "doc_gg-src-global-governance-course-frame_6e5f63d40ade22c8"
    )
    expect(firstPayload.document.sourceId).toBe(
      "gg-src-global-governance-course-frame"
    )
    expect(firstPayload.document.checksum).toBe(
      "6e5f63d40ade22c89d1c6a3326e2ee896149160d1e06f4b5890f9feb0acc748e"
    )
    expect(firstPayload.document.embeddingConfig).toEqual(pinnedEmbeddingConfig)
    expect(firstPayload.document.embeddingConfig.synthetic).toBe(true)
    expect(firstPayload.document.metadata.dryRunOnly).toBe(true)
    expect(firstPayload.chunks.map((chunk) => chunk.chunkIndex)).toEqual([
      0, 1, 2,
    ])
    expect(
      firstPayload.chunks.every((chunk) => chunk.embedding.length === 384)
    ).toBe(true)
    expect(firstPayload.chunks.map((chunk) => chunk.id)).toEqual([
      `${firstPayload.document.id}_chunk_0000`,
      `${firstPayload.document.id}_chunk_0001`,
      `${firstPayload.document.id}_chunk_0002`,
    ])
    expect(firstPayload.references).toEqual([
      {
        id: `${firstPayload.document.id}_ref_gg-src-global-governance-course-frame`,
        documentId: firstPayload.document.id,
        sourceId: "gg-src-global-governance-course-frame",
        citationLabel: "Course frame",
        sourceTitle: "Global Governance Course Frame",
        canonicalUrl: null,
        chunkIds: firstPayload.chunks.map((chunk) => chunk.id),
        metadata: {
          bundleId: "global-governance-approved-sources",
          bundleVersion: "2026.05.01",
          sourceType: "course",
        },
      },
    ])
  })

  it("resolves aliases to canonical source ids before persistence", async () => {
    const payload = await buildIngestionPayload({
      ...markdownInput,
      sourceId: "wps-src-2016-tribunal-award",
      sourcePath:
        "archive/docs/approved-sources/raw/topic-6-west-philippine-sea-south-china-sea-case-knowledge.md",
    })

    expect(payload.document.sourceId).toBe("gg-src-south-china-sea-award")
    expect(payload.document.id).toMatch(/^doc_gg-src-south-china-sea-award_/)
    expect(payload.references[0]?.sourceId).toBe("gg-src-south-china-sea-award")
  })

  it("rejects unsupported, malformed, or unmapped inputs before payload creation", async () => {
    expect(() =>
      validateIngestionInput({
        ...markdownInput,
        fileType: "txt",
      })
    ).toThrow(/Unsupported ingestion file type/)

    expect(() =>
      validateIngestionInput({
        ...markdownInput,
        sourceId: "not-approved",
      })
    ).toThrow(/Unknown approved source id/)

    expect(() =>
      validateIngestionInput({
        ...markdownInput,
        sourcePath: "src/data/not-approved.md",
      })
    ).toThrow(/archive\/docs\/approved-sources/)

    expect(() =>
      validateIngestionInput({
        ...markdownInput,
        fileType: "pdf",
      })
    ).toThrow(/project-source-pdfs/)

    await expect(
      buildIngestionPayload({
        ...markdownInput,
        content: "   ",
      })
    ).rejects.toThrow(/content cannot be empty/)
  })

  it("keeps duplicate unchanged ingests idempotent in the persistence contract", async () => {
    const store = createInMemoryIngestionStore()
    const first = await ingestIntoMemoryStore(markdownInput, store)
    const second = await ingestIntoMemoryStore(markdownInput, store)

    expect(second).toEqual(first)
    expect(store.documents).toHaveLength(1)
    expect(store.chunks).toHaveLength(first.chunks.length)
    expect(store.references).toHaveLength(1)
    expect(store.referenceChunks).toHaveLength(first.chunks.length)
  })

  it("extracts supported PDF text and rejects malformed PDF input without side effects", () => {
    const text = extractPdfText(
      new TextEncoder().encode(
        "%PDF-1.7\n1 0 obj\n<<>>\nstream\n(Global governance from a PDF source) Tj\nendstream\n%%EOF"
      )
    )

    expect(text).toContain("Global governance from a PDF source")
    expect(() => extractPdfText(new TextEncoder().encode("not a pdf"))).toThrow(
      /Malformed PDF input/
    )
  })

  it("keeps raw source storage private and outside public assets", async () => {
    const payload = await buildIngestionPayload({
      ...markdownInput,
      storage: undefined,
    })

    expect(payload.document.storageBucket).toBeNull()
    expect(payload.document.storagePath).toBeNull()
    expect(payload.document.sourcePath).not.toMatch(/^public\//)
    expect(payload.document.metadata.storage.private).toBe(true)
  })

  it("rejects malformed request bodies instead of coercing them", () => {
    expect(() =>
      parseContentIngestionRequest({
        sourceId: 42,
        sourcePath,
        fileType: "md",
        content: "hello",
      })
    ).toThrow(/sourceId/)

    expect(() =>
      parseContentIngestionRequest({
        sourceId: "gg-src-global-governance-course-frame",
        sourcePath,
        fileType: "pdf",
        content: "hello",
      })
    ).toThrow(/Use ingest-pdf/)

    expect(() =>
      parsePdfIngestionRequest({
        sourceId: "gg-src-global-governance-course-frame",
        sourcePath,
        pdfBase64: "Zm9v",
        storage: {
          bucket: "processed-exports",
          path: "foo.pdf",
        },
      })
    ).toThrow(/project-source-pdfs/)
  })

  it("keeps retained Supabase ingestion functions dry-run only", () => {
    for (const path of [
      "supabase/functions/ingest-content/index.ts",
      "supabase/functions/ingest-pdf/index.ts",
    ]) {
      const source = readFileSync(path, "utf8")

      expect(source).toContain("activationAllowed: false")
      expect(source).toContain('delegate: "django-approved-source-ingestion"')
      expect(source).not.toContain("persistIngestionPayload")
      expect(source).not.toContain("uploadPrivateSourceFile")
    }
  })
})
