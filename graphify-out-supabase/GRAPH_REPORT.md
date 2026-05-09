# Graph Report - C:\Users\Nakko\Desktop\VSCode-ProjectFiles\Global-Governance\supabase  (2026-05-05)

## Corpus Check
- Corpus is ~7,997 words - fits in a single context window. You may not need a graph.

## Summary
- 68 nodes · 144 edges · 10 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `064d4413`
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
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]

## God Nodes (most connected - your core abstractions)
1. `evaluateChatProtection()` - 9 edges
2. `buildIngestionPayload()` - 8 edges
3. `parseContentIngestionRequest()` - 8 edges
4. `parsePdfIngestionRequest()` - 7 edges
5. `retrieveApprovedSources()` - 6 edges
6. `hasStrongGrounding()` - 5 edges
7. `assembleGroundedChatResponse()` - 5 edges
8. `getProtectionStore()` - 5 edges
9. `readRequiredStorage()` - 5 edges
10. `createRefusedChatResponse()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `assembleGroundedChatResponse()` --calls--> `hasStrongGrounding()`  [EXTRACTED]
  functions/_shared/chat-grounding.ts → functions/_shared/chat-grounding.ts  _Bridges community 6 → community 5_
- `evaluateChatProtection()` --calls--> `getProtectionStore()`  [EXTRACTED]
  functions/_shared/chat-protection.ts → functions/_shared/chat-protection.ts  _Bridges community 7 → community 8_

## Communities (10 total, 0 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.26
Nodes (9): buildIngestionPayload(), chunkContent(), createInMemoryIngestionStore(), extractPdfText(), ingestIntoMemoryStore(), normalizeContent(), normalizeSourcePath(), stableHash() (+1 more)

### Community 1 - "Community 1"
Cohesion: 0.28
Nodes (4): escapeRegExp(), hashSessionKey(), matchesKeywordBoundary(), resolveAnonymousSessionId()

### Community 2 - "Community 2"
Cohesion: 0.56
Nodes (8): asRecord(), parseContentIngestionRequest(), parsePdfIngestionRequest(), readFileType(), readOptionalMetadata(), readOptionalStorage(), readRequiredStorage(), readRequiredString()

### Community 3 - "Community 3"
Cohesion: 0.54
Nodes (5): deletePrivateSourceFile(), encodeStorageObjectPath(), persistIngestionPayload(), readSupabaseServiceConfig(), uploadPrivateSourceFile()

### Community 4 - "Community 4"
Cohesion: 0.43
Nodes (3): getServerChatApprovedSources(), getServerSectionSourceMap(), createChatErrorEnvelope()

### Community 5 - "Community 5"
Cohesion: 0.53
Nodes (4): assembleGroundedChatResponse(), createCooldownChatResponse(), createRefusedChatResponse(), resetProtectionStore()

### Community 6 - "Community 6"
Cohesion: 0.5
Nodes (5): getScopedSources(), hasStrongGrounding(), isSourceInspectionQuestion(), isSpeculativeQuestion(), retrieveApprovedSources()

### Community 7 - "Community 7"
Cohesion: 0.4
Nodes (5): evaluateChatProtection(), getProtectionRecord(), isCourseBoundaryQuestion(), saveProtectionRecord(), secondsUntil()

### Community 8 - "Community 8"
Cohesion: 0.5
Nodes (4): createMemoryProtectionStore(), createRedisProtectionStore(), getProtectionStore(), getRedisUrl()

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `evaluateChatProtection()` connect `Community 7` to `Community 8`, `Community 1`, `Community 3`, `Community 5`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `parseContentIngestionRequest()` connect `Community 2` to `Community 0`, `Community 3`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `buildIngestionPayload()` connect `Community 0` to `Community 3`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._