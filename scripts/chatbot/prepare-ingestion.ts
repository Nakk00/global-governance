import { readFile } from "node:fs/promises"

import { buildIngestionPayload } from "../../supabase/functions/_shared/ingestion-pipeline.ts"
import { approvedSourceFiles } from "./approved-source-set.ts"

async function main() {
  const payloads = await Promise.all(
    approvedSourceFiles.map(async (sourceFile) =>
      buildIngestionPayload({
        sourceId: sourceFile.sourceId,
        sourcePath: sourceFile.path,
        fileType: sourceFile.fileType,
        content: await readFile(sourceFile.path, "utf8"),
        storage: sourceFile.storage,
      })
    )
  )

  console.log(
    JSON.stringify(
      {
        preparedAt: new Date().toISOString(),
        documentCount: payloads.length,
        chunkCount: payloads.reduce(
          (count, payload) => count + payload.chunks.length,
          0
        ),
        documents: payloads.map((payload) => ({
          id: payload.document.id,
          sourceId: payload.document.sourceId,
          sourcePath: payload.document.sourcePath,
          checksum: payload.document.checksum,
          chunkCount: payload.chunks.length,
        })),
      },
      null,
      2
    )
  )
}

await main()
