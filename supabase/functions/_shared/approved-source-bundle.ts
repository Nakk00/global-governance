import {
  activeApprovedSourceBundle,
  getChatCitationSources,
} from "../../../src/data/source-bundles/approved-source-bundle.ts"

export type ServerApprovedSource = ReturnType<
  typeof getChatCitationSources
>[number]

export const approvedSourceBundleIdentity = {
  bundleId: activeApprovedSourceBundle.bundleId,
  bundleVersion: activeApprovedSourceBundle.bundleVersion,
}

export function getServerChatApprovedSources(): ServerApprovedSource[] {
  return getChatCitationSources()
}

export function getServerSectionSourceMap(): Record<string, string[]> {
  return getServerChatApprovedSources().reduce<Record<string, string[]>>(
    (map, source) => {
      for (const sectionId of source.sectionIds) {
        map[sectionId] = [...(map[sectionId] ?? []), source.sourceId]
      }

      return map
    },
    {}
  )
}
