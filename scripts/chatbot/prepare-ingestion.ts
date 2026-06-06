import { createHash } from "node:crypto"
import { readFile } from "node:fs/promises"

import { approvedSourceFiles } from "./approved-source-set.ts"

async function main() {
  const documents = await Promise.all(
    approvedSourceFiles.map(async (sourceFile) => {
      const content = await readFile(sourceFile.path)

      return {
        sourceId: sourceFile.sourceId,
        sourcePath: sourceFile.path,
        revision: sourceFile.revision,
        fileType: sourceFile.fileType,
        checksum: createHash("sha256").update(content).digest("hex"),
        byteCount: content.byteLength,
        storage: sourceFile.storage,
        lineage: sourceFile.lineage,
      }
    })
  )

  console.log(
    JSON.stringify(
      {
        preparedAt: new Date().toISOString(),
        mode: "manifest-validation",
        documentCount: documents.length,
        documents,
      },
      null,
      2
    )
  )
}

await main()
