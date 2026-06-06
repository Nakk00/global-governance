import type { SourceInventoryItem } from "@/lib/maintainer/source-api"

export function validationStatusKey(source: SourceInventoryItem) {
  return source.latestValidationOutcome ?? "missing"
}

export function sourceMatchesSearch(
  source: SourceInventoryItem,
  normalizedSearch: string
) {
  return [
    source.title,
    source.sourceId,
    source.provenance,
    source.sourceType,
    source.lifecycleState,
    ...source.aliases,
  ].some((value) => value.toLowerCase().includes(normalizedSearch))
}
