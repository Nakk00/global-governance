# Graph Report - backend  (2026-05-09)

## Corpus Check
- 55 files · ~14,004 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 473 nodes · 1230 edges · 34 communities (28 shown, 6 thin omitted)
- Extraction: 73% EXTRACTED · 27% INFERRED · 0% AMBIGUOUS · INFERRED: 335 edges (avg confidence: 0.59)
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
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]

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
- `AdminStewardshipApiTests` --uses--> `AdminAuthError`  [INFERRED]
  tests/test_admin_stewardship.py → accounts/auth.py
- `AdminValidationApiTests` --uses--> `AdminAuthError`  [INFERRED]
  tests/test_admin_validation.py → accounts/auth.py
- `reserved_admin()` --calls--> `admin_me()`  [INFERRED]
  config/api.py → accounts/views.py
- `not_found()` --calls--> `error_response()`  [INFERRED]
  config/api.py → common/responses.py
- `server_error()` --calls--> `error_response()`  [INFERRED]
  config/api.py → common/responses.py

## Communities (34 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (49): _build_storage_path(), _chunk_from_row(), _chunk_row(), _citation_from_row(), _citation_row(), _clean_list(), _clean_source_id(), _clean_text() (+41 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (24): AdminAuthError, get_supabase_jwt_verifier(), parse_bearer_token(), SupabaseJwtVerifier, VerifiedSupabaseClaims, AdminProfile, AdminProfileNotFoundError, AdminProfileRepositoryError (+16 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (49): AdminIdentity, authorize_admin_request(), _identity_from_profile(), admin_me(), _has_unexpected_body(), error_envelope(), error_response(), exception_to_error_envelope() (+41 more)

### Community 3 - "Community 3"
Cohesion: 0.1
Nodes (34): ValidationAuditEventDto, ValidationResultDto, ValidationRunDetailDto, ValidationRunListDto, ValidationRunSummaryDto, ValidationSetDto, ValidationSetListDto, _answer_preview() (+26 more)

### Community 4 - "Community 4"
Cohesion: 0.22
Nodes (26): ApprovedSourceSeed, ChunkDetailDto, ChunkRowDto, CitationDetailDto, CitationRowDto, IngestJobDto, InspectionAnchorDto, PartialDataMarker (+18 more)

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (12): main(), check_backend_prerequisites(), EnvRequirement, load_env_file(), Raised when backend startup prerequisites are not satisfied., RuntimeCheckError, validate_backend_dependencies(), validate_python_runtime() (+4 more)

### Community 7 - "Community 7"
Cohesion: 0.13
Nodes (8): AccountsConfig, AppConfig, AuditConfig, ChatbotConfig, IngestionConfig, RetrievalConfig, SourcesConfig, ValidationConfig

### Community 8 - "Community 8"
Cohesion: 0.18
Nodes (4): get_stewardship_dashboard(), list_audit_events(), list_ingestion_runs(), list_validation_runs()

### Community 11 - "Community 11"
Cohesion: 0.25
Nodes (3): TokenVerifier, AdminProfileRepository, Protocol

## Knowledge Gaps
- **4 isolated node(s):** `EnvRequirement`, `Raised when backend startup prerequisites are not satisfied.`, `ASGI config for the Global Governance backend.`, `WSGI config for the Global Governance backend.`
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminAuthError` connect `Community 1` to `Community 9`, `Community 2`, `Community 6`?**
  _High betweenness centrality (0.290) - this node is a cross-community bridge._
- **Why does `SourceMutationError` connect `Community 4` to `Community 0`, `Community 2`?**
  _High betweenness centrality (0.226) - this node is a cross-community bridge._
- **Why does `ValidationWorkflowError` connect `Community 3` to `Community 2`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `SupabaseStewardshipRepository` (e.g. with `ApprovedSourceSeed` and `ChunkDetailDto`) actually correct?**
  _`SupabaseStewardshipRepository` has 16 INFERRED edges - model-reasoned connections that need verification._
- **Are the 16 inferred relationships involving `InMemoryStewardshipRepository` (e.g. with `ApprovedSourceSeed` and `ChunkDetailDto`) actually correct?**
  _`InMemoryStewardshipRepository` has 16 INFERRED edges - model-reasoned connections that need verification._
- **Are the 16 inferred relationships involving `SourceMutationError` (e.g. with `ApprovedSourceSeed` and `ChunkDetailDto`) actually correct?**
  _`SourceMutationError` has 16 INFERRED edges - model-reasoned connections that need verification._
- **Are the 16 inferred relationships involving `StewardshipRepository` (e.g. with `ApprovedSourceSeed` and `ChunkDetailDto`) actually correct?**
  _`StewardshipRepository` has 16 INFERRED edges - model-reasoned connections that need verification._