# Graph Report - .  (2026-05-09)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 711 nodes · 1656 edges · 59 communities (50 shown, 9 thin omitted)
- Extraction: 79% EXTRACTED · 21% INFERRED · 0% AMBIGUOUS · INFERRED: 348 edges (avg confidence: 0.59)
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
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]

## God Nodes (most connected - your core abstractions)
1. `SupabaseStewardshipRepository` - 49 edges
2. `InMemoryStewardshipRepository` - 35 edges
3. `SourceMutationError` - 32 edges
4. `StewardshipRepository` - 28 edges
5. `AdminAuthBoundaryTests` - 25 edges
6. `AdminAuthError` - 24 edges
7. `error_response()` - 24 edges
8. `FakeRepository` - 24 edges
9. `AdminStewardshipApiTests` - 22 edges
10. `SourceRecord` - 20 edges

## Surprising Connections (you probably didn't know these)
- `openChunkDetail()` --calls--> `fetchChunkDetail()`  [INFERRED]
  components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx → lib/maintainer/api.ts
- `openCitationDetail()` --calls--> `fetchCitationDetail()`  [INFERRED]
  components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx → lib/maintainer/api.ts
- `AdminAuthError` --uses--> `AdminStewardshipApiTests`  [INFERRED]
  accounts/auth.py → tests/test_admin_stewardship.py
- `AdminAuthError` --uses--> `AdminValidationApiTests`  [INFERRED]
  accounts/auth.py → tests/test_admin_validation.py
- `authorize_admin_request()` --calls--> `_guard_request()`  [INFERRED]
  accounts/permissions.py → sources/views.py

## Communities (59 total, 9 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (49): _build_storage_path(), _chunk_from_row(), _chunk_row(), _citation_from_row(), _citation_row(), _clean_list(), _clean_source_id(), _clean_text() (+41 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (30): AdminAuthError, get_supabase_jwt_verifier(), parse_bearer_token(), SupabaseJwtVerifier, TokenVerifier, VerifiedSupabaseClaims, AdminIdentity, authorize_admin_request() (+22 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (47): getServerChatApprovedSources(), getServerSectionSourceMap(), assembleGroundedChatResponse(), createChatErrorEnvelope(), createCooldownChatResponse(), createRefusedChatResponse(), getScopedSources(), hasStrongGrounding() (+39 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (46): admin_me(), _has_unexpected_body(), error_envelope(), error_response(), exception_to_error_envelope(), success_envelope(), success_response(), BoundaryValidationError (+38 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (33): useMaintainerDashboardData(), useMaintainerGate(), useMaintainerNavigation(), fetchAdminMe(), fetchChunkDetail(), fetchCitationDetail(), fetchMaintainerJson(), fetchSourceChunks() (+25 more)

### Community 5 - "Community 5"
Cohesion: 0.1
Nodes (34): ValidationAuditEventDto, ValidationResultDto, ValidationRunDetailDto, ValidationRunListDto, ValidationRunSummaryDto, ValidationSetDto, ValidationSetListDto, _answer_preview() (+26 more)

### Community 6 - "Community 6"
Cohesion: 0.19
Nodes (26): ApprovedSourceSeed, ChunkDetailDto, ChunkRowDto, CitationDetailDto, CitationRowDto, IngestJobDto, InspectionAnchorDto, PartialDataMarker (+18 more)

### Community 7 - "Community 7"
Cohesion: 0.13
Nodes (22): createAnonymousSessionId(), getAnonymousSessionId(), requestGroundedAnswer(), asRecord(), createChatRequest(), optionalString(), parseCitation(), parseCitations() (+14 more)

### Community 8 - "Community 8"
Cohesion: 0.14
Nodes (12): main(), check_backend_prerequisites(), EnvRequirement, load_env_file(), Raised when backend startup prerequisites are not satisfied., RuntimeCheckError, validate_backend_dependencies(), validate_python_runtime() (+4 more)

### Community 10 - "Community 10"
Cohesion: 0.13
Nodes (8): AccountsConfig, AppConfig, AuditConfig, ChatbotConfig, IngestionConfig, RetrievalConfig, SourcesConfig, ValidationConfig

### Community 11 - "Community 11"
Cohesion: 0.18
Nodes (4): get_stewardship_dashboard(), list_audit_events(), list_ingestion_runs(), list_validation_runs()

### Community 13 - "Community 13"
Cohesion: 0.21
Nodes (5): getCanonicalRecapTargetId(), resolveNarrativeRecapCue(), UNCommandCenter(), WpsDossier(), WpsEvidenceSurface()

### Community 15 - "Community 15"
Cohesion: 0.24
Nodes (4): getSourceAwareChatStarterPrompts(), resolveStarterPromptState(), closeChat(), handleShellKeyDown()

### Community 17 - "Community 17"
Cohesion: 0.25
Nodes (4): NavigationProvider(), AppShell(), ChapterTransitionBlock(), HeroNarrativeFrame()

### Community 18 - "Community 18"
Cohesion: 0.36
Nodes (3): getChapterIndex(), isChapterId(), isKnownSectionId()

## Knowledge Gaps
- **4 isolated node(s):** `EnvRequirement`, `Raised when backend startup prerequisites are not satisfied.`, `ASGI config for the Global Governance backend.`, `WSGI config for the Global Governance backend.`
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminAuthError` connect `Community 1` to `Community 9`, `Community 3`, `Community 12`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **Why does `SourceMutationError` connect `Community 6` to `Community 0`, `Community 3`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Why does `ValidationWorkflowError` connect `Community 5` to `Community 3`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `SupabaseStewardshipRepository` (e.g. with `PartialDataMarker` and `StewardshipEventDto`) actually correct?**
  _`SupabaseStewardshipRepository` has 16 INFERRED edges - model-reasoned connections that need verification._
- **Are the 16 inferred relationships involving `InMemoryStewardshipRepository` (e.g. with `PartialDataMarker` and `StewardshipEventDto`) actually correct?**
  _`InMemoryStewardshipRepository` has 16 INFERRED edges - model-reasoned connections that need verification._
- **Are the 16 inferred relationships involving `SourceMutationError` (e.g. with `PartialDataMarker` and `StewardshipEventDto`) actually correct?**
  _`SourceMutationError` has 16 INFERRED edges - model-reasoned connections that need verification._
- **Are the 16 inferred relationships involving `StewardshipRepository` (e.g. with `PartialDataMarker` and `StewardshipEventDto`) actually correct?**
  _`StewardshipRepository` has 16 INFERRED edges - model-reasoned connections that need verification._