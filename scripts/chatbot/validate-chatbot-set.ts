import { access, readFile } from "node:fs/promises"

import { buildIngestionPayload } from "../../supabase/functions/_shared/ingestion-pipeline.ts"
import { approvedSourceFiles } from "./approved-source-set.ts"

async function main() {
  const errors: string[] = []

  for (const sourceFile of approvedSourceFiles) {
    try {
      await access(sourceFile.path)
      await buildIngestionPayload({
        sourceId: sourceFile.sourceId,
        sourcePath: sourceFile.path,
        fileType: sourceFile.fileType,
        content: await readFile(sourceFile.path, "utf8"),
        storage: sourceFile.storage,
      })
    } catch (error) {
      errors.push(
        `${sourceFile.path}: ${
          error instanceof Error ? error.message : "unknown validation error"
        }`
      )
    }
  }

  if (errors.length > 0) {
    console.error(errors.join("\n"))
    process.exitCode = 1
    return
  }

  console.log(
    `Validated ${approvedSourceFiles.length} approved source files for ingestion.`
  )
}

await main()
