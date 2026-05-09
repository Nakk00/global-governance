# Graph Report - src  (2026-05-09)

## Corpus Check
- 63 files · ~96,647 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 170 nodes · 282 edges · 22 communities (21 shown, 1 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `436e7767`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]

## God Nodes (most connected - your core abstractions)
1. `fetchMaintainerJson()` - 17 edges
2. `cn()` - 10 edges
3. `resolveNarrativeRecapCue()` - 9 edges
4. `requestGroundedAnswer()` - 7 edges
5. `parseSuccessData()` - 7 edges
6. `parseGroundedChatEnvelope()` - 7 edges
7. `clearSupabaseSession()` - 7 edges
8. `useNavigation()` - 6 edges
9. `asRecord()` - 6 edges
10. `requireString()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `openChunkDetail()` --calls--> `fetchChunkDetail()`  [INFERRED]
  components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx → lib/maintainer/api.ts
- `openCitationDetail()` --calls--> `fetchCitationDetail()`  [INFERRED]
  components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx → lib/maintainer/api.ts
- `parseCitation()` --calls--> `resolveApprovedSourceId()`  [INFERRED]
  lib/chat/grounded-answer.ts → data/source-bundles/approved-source-bundle.ts
- `runSelectedSet()` --calls--> `launchValidationRun()`  [INFERRED]
  components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx → lib/maintainer/api.ts
- `runSelectedSet()` --calls--> `fetchValidationRuns()`  [INFERRED]
  components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx → lib/maintainer/api.ts

## Communities (22 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.13
Nodes (22): fetchAdminMe(), fetchChunkDetail(), fetchCitationDetail(), fetchMaintainerJson(), fetchSourceChunks(), fetchSourceCitations(), fetchSourceDetail(), fetchStewardshipDashboard() (+14 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (10): getSourceAwareChatStarterPrompts(), resolveStarterPromptState(), closeChat(), handleShellKeyDown(), useNavigation(), cn(), closeAndReturnFocus(), handleDisclosureKeyDown() (+2 more)

### Community 2 - "Community 2"
Cohesion: 0.1
Nodes (12): NavigationProvider(), getChapterIndex(), isChapterId(), isKnownSectionId(), AppShell(), ChapterTransitionBlock(), getCanonicalRecapTargetId(), resolveNarrativeRecapCue() (+4 more)

### Community 3 - "Community 3"
Cohesion: 0.25
Nodes (15): createAnonymousSessionId(), getAnonymousSessionId(), requestGroundedAnswer(), asRecord(), createChatRequest(), optionalString(), parseCitation(), parseCitations() (+7 more)

### Community 4 - "Community 4"
Cohesion: 0.16
Nodes (9): useMaintainerDashboardData(), useMaintainerGate(), useMaintainerNavigation(), MaintainerLogin(), AccessStateView(), clearSupabaseSession(), getSupabaseSession(), isSupabaseSessionExpired() (+1 more)

### Community 5 - "Community 5"
Cohesion: 0.24
Nodes (7): hasCompleteConclusionReferences(), createWpsEvidenceRegistry(), getApprovedSource(), getChatCitationSources(), getConclusionReferenceSources(), getDossierEvidenceSources(), resolveApprovedSourceId()

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 1` to `Community 2`?**
  _High betweenness centrality (0.555) - this node is a cross-community bridge._
- **Why does `requestGroundedAnswer()` connect `Community 3` to `Community 1`?**
  _High betweenness centrality (0.267) - this node is a cross-community bridge._
- **Why does `Table()` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.186) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `resolveNarrativeRecapCue()` (e.g. with `UNCommandCenter()` and `WpsDossier()`) actually correct?**
  _`resolveNarrativeRecapCue()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `requestGroundedAnswer()` (e.g. with `createChatRequest()` and `parseGroundedChatEnvelope()`) actually correct?**
  _`requestGroundedAnswer()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._