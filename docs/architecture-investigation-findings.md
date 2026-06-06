# Architecture Investigation Findings

Date: 2026-06-06  
Status: Architecture, modularization, and clean-code investigation complete  
Purpose: Separate durable project governance from the engineering work required to reach the target architecture.

## How To Use This Document

This document has two distinct outputs:

1. **Part I: Constitution Material** contains stable principles suitable for
   `.specify/memory/constitution.md`. These rules should remain valid even
   after the current refactors are complete.
2. **Part II: Implementation Work** contains concrete changes for the current
   codebase. These belong in specs, plans, tasks, issues, or refactor branches,
   not in the constitution.

The constitution should describe the architecture we intend to preserve. The
implementation backlog should describe the temporary work needed to reach and
maintain that architecture.

## Executive Conclusion

The repository should continue as a **multi-runtime modular monorepo**:

- a feature-owned Vite + React + TypeScript SPA
- a Django modular monolith for protected maintainer workflows
- a Django backend owner for public chat, Redis protection, and protected maintainer workflows
- thin Supabase Edge Function entry points for non-chat ingestion
- explicit typed contracts and adapters where runtime infrastructure varies

Each runtime needs a modularization style suited to its responsibilities:

- React: feature and user-workflow ownership
- Django: domain ownership with pragmatic internal layering for public chat and maintainer workflows
- Supabase: workflow-stage modules for non-chat ingestion and data/storage support
- shared code: a deliberately small set of proven cross-feature or
  cross-runtime contracts and primitives

The target is not microservices, micro-frontends, universal Clean Architecture,
or maximum file fragmentation. The target is code whose ownership, contracts,
failure states, and verification paths remain easy to understand.

# Part I: Constitution Material

The following material is suitable for adoption as permanent project law.
Exact wording may be adjusted when the constitution is amended, but the
principles should remain intact.

## A. Architecture Governance

### A1. Preserve the multi-runtime modular monorepo

- The frontend MUST remain a Vite-backed React + TypeScript SPA unless a
  constitution amendment explicitly changes that architecture.
- Protected maintainer and administrative workflows MUST remain in the Django
  modular monolith under `backend/`.
- Public grounded chat orchestration, Redis protection, privileged retrieval,
  citation packaging, and model-provider integration MUST remain in Django.
- Supabase Edge Functions MUST remain limited to non-chat ingestion and
  storage-support workflows unless an approved architecture change assigns
  them elsewhere.
- Browser-facing code MUST stay in `src/`. Service-role access, privileged
  retrieval, protected orchestration, and server secrets MUST stay in
  server-only runtimes.

### A2. Keep composition roots small

- Application entry points such as `src/main.tsx`, `src/App.tsx`, Django views,
  and Edge Function `index.ts` files SHOULD primarily compose or delegate.
- Entry points MUST NOT become the default home for feature rules, persistence
  details, parsing logic, or unrelated workflows.

### A3. Use adapters only at real points of variation

- An Interface and Adapter SHOULD be introduced when behavior or infrastructure
  genuinely varies, such as Supabase versus in-memory storage or Redis versus
  in-memory protection state.
- The project MUST NOT require controller, workflow, and repository layers for
  every feature when those layers only forward calls.
- An abstraction MUST provide meaningful Leverage or Locality; stylistic
  symmetry alone is not sufficient justification.

## B. Modularization Governance

### B1. Use runtime-appropriate modularization

- React code MUST be organized primarily by feature or user workflow.
- Django code MUST be organized primarily by domain, including `accounts`,
  `sources`, and `validation`.
- Supabase shared code MUST be organized around cohesive workflow stages and
  policies such as request validation, protection, grounding, ingestion, and
  persistence.
- The repository MUST NOT impose one identical internal folder pattern on all
  runtimes.

### B2. Preserve frontend ownership rules

- Feature rendering and interaction logic SHOULD live with the owning feature
  under `src/components`.
- Canonical narrative, navigation, chat prompt, and approved source content
  SHOULD remain in `src/data`.
- Feature-only state, helpers, tests, and visual behavior SHOULD remain close
  to the feature that owns them.
- Global contexts MUST be limited to genuinely cross-cutting concerns.
- Local React state MUST remain the default unless shared state has multiple
  real consumers and a stable cross-feature contract.

### B3. Keep shared Modules explicit and small

- Shared Modules MUST have multiple real consumers or define a stable
  cross-runtime contract.
- Shared folders MUST NOT become dumping grounds for code whose ownership is
  unclear.
- Compatibility exports and forwarding Modules MAY exist during migrations,
  but MUST have a removal condition and MUST NOT become the permanent design.
- The deletion test SHOULD be used when evaluating a shared Module: if removing
  it only removes indirection, it is too shallow; if removing it spreads
  complexity across callers, it is earning its place.

### B4. Optimize for Locality and Depth

- Related behavior, tests, types, and implementation knowledge SHOULD change
  together in as few places as practical.
- Modules SHOULD expose a compact Interface while hiding cohesive
  Implementation detail.
- Refactors MUST NOT fragment a cohesive workflow into helper-per-file
  structures that force maintainers to reconstruct one behavior across many
  locations.

## C. Clean-Code Governance

### C1. Use intention-revealing domain language

- Names MUST describe product concepts, observable behavior, or precise
  technical responsibilities.
- Vague names such as `manager`, `helper`, `processor`, or `data` SHOULD be
  avoided when a specific domain term exists.
- Existing domain language such as source stewardship, validation run,
  grounding, weak support, refusal, cooldown, and audit event SHOULD be used
  consistently across runtimes.

### C2. Keep responsibilities and abstraction levels coherent

- A function, class, or Module SHOULD have one understandable reason to change.
- High-level workflow policy SHOULD NOT be interleaved with low-level parsing,
  formatting, transport, or persistence details when those responsibilities
  can be separated meaningfully.
- Extraction MUST be driven by ownership, readability, reuse, or testability,
  not by arbitrary line-count targets.
- Longer cohesive code MAY remain together when splitting it would reduce
  readability or create shallow pass-through Modules.

### C3. Normalize external data at runtime boundaries

- Untrusted JSON, database rows, environment values, and external responses
  MUST be validated and converted into explicit application types before they
  spread through feature or domain logic.
- Broad types such as TypeScript `unknown` or Python `Any` MAY exist at external
  boundaries but SHOULD be narrowed promptly.
- Request and response envelopes MUST remain typed and explicit.

### C4. Model absence, failure, and degraded behavior deliberately

- `null` and `None` MAY be used when absence is an intentional, documented part
  of the contract.
- Ambiguous absence and unclassified failures MUST NOT be used in place of
  explicit states or typed errors.
- Loading, empty, outage, fallback, refusal, weak-support, and cooldown states
  MUST remain observable product states where applicable.
- Off-topic refusal, weak support, and cooldown MUST remain typed successful
  chat responses rather than transport failures.

### C5. Use comments for reasoning

- Comments SHOULD explain constraints, ordering, security decisions,
  accessibility behavior, external limitations, and narrowly scoped tool
  exceptions.
- Comments SHOULD NOT merely narrate code that can be made clear through names
  and structure.

### C6. Keep files readable from intent to detail

- Primary exported workflows or rendering entry points SHOULD appear before
  low-level implementation details when practical.
- Related declarations SHOULD remain close together.
- Private parsing, mapping, formatting, and transport details SHOULD sit below
  the higher-level behavior they support.

## D. Styling Governance

- Global CSS MUST be limited to tokens, resets, utilities, application-shell
  rules, and genuinely shared visual patterns.
- Feature-specific visual systems SHOULD be owned near their feature Modules.
- Moving styles MUST preserve accessibility, responsive behavior,
  reduced-motion behavior, and existing visual contracts.
- A specific styling mechanism such as CSS Modules MUST NOT be mandated unless
  the project explicitly adopts it.

## E. Contract And Verification Governance

- Tests MUST target observable behavior and stable Interfaces rather than
  private helper structure.
- Verification MUST use the fastest test layer that proves the changed
  behavior with confidence.
- Frontend unit and component tests SHOULD cover local state, rendering,
  parsers, and request integration.
- Supabase Function and Django tests SHOULD cover runtime contracts, policies,
  permissions, and response envelopes.
- Playwright SHOULD remain focused on browser behavior and critical journeys.
- Refactors that preserve behavior SHOULD avoid unnecessary test rewrites.
- Constitution 2.0.0 supersedes the original investigation recommendation:
  behavior-changing work MUST now follow red-green-refactor and meet the
  changed-scope coverage gate.

## F. Defaults The Constitution Should Reject

The constitution should reject these as project-wide defaults unless a future
amendment supplies evidence and migration plans:

- microservices or micro-frontends
- Next.js, App Router, or server components
- React Router for the current anchor-oriented public SPA
- a global store for ordinary feature state
- mandatory controller/workflow/repository layering
- helper-per-file fragmentation
- permanent compatibility barrels
- arbitrary maximum file or function lengths
- a universal maximum function argument count
- blanket bans on `null`, `None`, comments, or exceptions
- test-first requirements for documentation-only, generated-artifact, or
  non-behavioral configuration changes; constitution 2.0.0 limits the
  mandatory workflow to behavior-changing work

## G. Mapping To The Current Constitution

These findings can strengthen the existing constitution without replacing its
current accessibility, testing, verification, and delivery rules:

- **Principle I** should retain the SPA-first runtime boundaries and explicitly
  describe the Django modular monolith and thin Supabase entry points.
- **Principle II** should expand from folder placement into runtime-appropriate
  modularization, shared Module criteria, Locality, and migration-wrapper
  removal.
- **Principle III** already covers resilient product states and should retain
  that responsibility.
- **Principle IV** should add runtime-boundary normalization and behavior-based
  test surfaces.
- **Principle V** can remain focused on verification and delivery safety.
- A dedicated clean-code principle or a substantial expansion of Principle II
  should capture domain naming, coherent responsibility, abstraction levels,
  comments, and top-down readability.

# Part II: Implementation Work

The following items are actionable engineering work. They are specific to the
current repository and should be tracked through Spec Kit features, refactor
plans, or issues. They should not be copied into the constitution as permanent
file-level requirements.

## Current Baseline To Preserve

Implementation work should retain these existing strengths:

- `src/App.tsx` is a reasonable frontend composition root.
- `src/contexts/NavigationContext.tsx` hides complex scroll, hash, and focus
  behavior behind a compact Interface.
- `backend/sources/repositories/base.py` defines a justified repository
  Interface with multiple Adapters.
- Supabase ingestion entry points already delegate to cohesive shared workflow
  Modules, while public chat is being moved under Django ownership.
- Chat and maintainer flows already model degraded states explicitly.
- Frontend, Django, Edge Function, and Playwright verification are separated by
  runtime and behavior.

## Workstream 1: Complete Maintainer Workflow Modularization

**Priority:** Highest  
**Primary files:**

- `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx`
- `src/components/modules/MaintainerDashboard/AdminPortalShell.tsx`
- `src/components/modules/MaintainerDashboard/shared/`
- workflow folders such as `sources/`, `validation/`, and `overview/`

**Current problem:**

The large shared file still combines routing, authentication, data loading,
mutation orchestration, source inspection, validation, modal focus behavior,
formatting, and several page-level Interfaces. Some newer files only re-export
Implementations from that monolith, so the extraction is structurally visible
but not yet complete.

**Required work:**

- Move complete user workflows into feature-owned Modules.
- Move the associated state, rendering, helpers, and tests with each workflow.
- Keep the admin shell responsible for composition rather than feature rules.
- Switch consumers to the new owners before deleting compatibility exports.
- Remove each transitional wrapper once it no longer has callers.

**Completion criteria:**

- The shared monolith no longer owns unrelated maintainer workflows.
- Workflow Modules can be understood and tested through their own Interfaces.
- Compatibility wrappers have explicit removal status or have been deleted.
- Maintainer unit tests and relevant E2E journeys continue to pass.

## Workstream 2: Separate Maintainer Transport Contracts

**Priority:** High  
**Primary files:**

- `src/lib/maintainer/api.ts`
- `src/lib/maintainer/auth-api.ts`
- `src/lib/maintainer/source-api.ts`
- `src/lib/maintainer/mutation-api.ts`
- `src/lib/maintainer/validation-api.ts`
- `src/lib/maintainer/client.ts`
- `src/lib/maintainer/envelope.ts`

**Current problem:**

The compatibility barrel acts as both a contract owner and a re-export surface,
while feature transport Modules import types back from it. This creates cyclic
ownership pressure and makes it harder to see which Module owns each contract.

**Required work:**

- Move pure transport and domain-facing types into neutral contract Modules.
- Make feature transport Modules depend on contracts and the shared client,
  never on the compatibility barrel.
- Keep shared authentication, fetch, and envelope behavior concentrated in the
  existing client Modules.
- Reduce `api.ts` to an outward-only transitional export surface, then remove
  it when consumers use direct owners.

**Completion criteria:**

- Contract ownership is unambiguous.
- Feature transport Modules do not import from a barrel that re-exports them.
- Envelope parsing remains centralized and tested.
- No transport behavior or user-visible error mapping regresses.

## Workstream 3: Deepen The Validation Backend

**Priority:** High  
**Primary files:**

- `backend/validation/repository.py`
- `backend/validation/services.py`
- `backend/validation/views.py`
- `backend/validation/dtos.py`
- `backend/tests/test_admin_validation.py`

**Current problem:**

The repository Module contains in-memory behavior, Supabase transport, row
mapping, adapter selection, runtime fallback policy, validation evaluation, and
workflow orchestration. Entry functions repeat adapter selection and fallback
translation, while `services.py` mostly forwards calls.

**Required work:**

- Separate the in-memory and Supabase Adapters from validation workflow policy.
- Give row mapping and transport error translation clear ownership.
- Consolidate repeated fallback selection behind one named policy.
- Either deepen `services.py` with real workflow responsibility or remove the
  pass-through layer after updating callers.
- Preserve the typed `ValidationWorkflowError` contract and current fallback
  behavior.

**Completion criteria:**

- Storage Adapters can be tested independently from workflow policy.
- Runtime fallback behavior has one authoritative implementation.
- Views remain request adapters rather than persistence owners.
- Backend validation tests cover normal, missing-store, unavailable-store, and
  failed-run behavior.

## Workstream 4: Realign Styling Ownership

**Priority:** Medium  
**Primary files:**

- `src/index.css`
- `src/styles/motion.css`
- feature Modules under `src/components/`

**Current problem:**

`src/index.css` combines global tokens and resets with substantial feature
systems for the maintainer UI, public chapters, WPS dossier, and chat. The
class names already reveal feature ownership, but the files do not.

**Required work:**

- Inventory global tokens, resets, utilities, and shell rules that should stay
  in `src/index.css`.
- Move feature-specific rule groups into feature-owned stylesheets in small,
  behavior-preserving steps.
- Import feature styles through the owning Module or an intentional feature
  entry point.
- Remove moved rules from the global stylesheet after verifying cascade and
  load order.

**Completion criteria:**

- `src/index.css` contains only genuinely global concerns.
- Feature styling has a clear owner.
- Responsive, focus, reduced-motion, and visual regression checks pass for
  every moved feature.

## Workstream 5: Remove Shallow Transitional Modules

**Priority:** Medium  
**Primary files:**

- `backend/sources/services.py`
- `backend/validation/services.py`
- compatibility barrels and re-export-only maintainer files

**Current problem:**

Several Modules add navigation indirection without hiding meaningful
complexity. They are acceptable during migration but do not yet provide enough
Depth to justify permanent ownership.

**Required work:**

- Apply the deletion test to each forwarding Module.
- Deepen Modules that should own real policy or orchestration.
- Delete Modules whose removal only simplifies the call path.
- Update imports and tests in the same scoped change.

**Completion criteria:**

- Each remaining workflow or compatibility Module has a documented
  responsibility beyond forwarding.
- Transitional exports do not remain after their consumers migrate.
- Tests exercise stable behavior rather than the existence of pass-through
  calls.

## Workstream 6: Clarify Cross-Runtime Contract Ownership

**Priority:** Medium  
**Primary files:**

- `src/data/source-bundles/approved-source-bundle.ts`
- `supabase/functions/_shared/ingestion-types.ts`
- `supabase/functions/_shared/ingestion-pipeline.ts`

**Current problem:**

Supabase ingestion Modules import a typed source bundle whose primary ownership
is inside the browser-facing `src/data` tree. The data is currently pure, but
its location makes the runtime relationship less obvious.

**Required work:**

- Confirm which source-bundle types and values are truly runtime-neutral.
- Move only proven shared contracts or immutable data into an explicitly
  runtime-neutral location.
- Keep browser-only presentation data and server-only ingestion behavior in
  their existing runtimes.
- Update build, test, and import paths without creating a broad shared dumping
  ground.

**Completion criteria:**

- Cross-runtime imports point to an intentional shared owner.
- Browser bundles cannot import server-only behavior or secrets.
- Edge Function and frontend contract tests continue to pass.

## Workstream 7: Consolidate Error And Fallback Policies

**Priority:** Medium  
**Primary areas:**

- maintainer authentication and mutation state mapping
- validation repository fallback handling
- runtime response-envelope translation

**Current problem:**

Related failures are translated in several locations. The outcomes are mostly
explicit, but duplicated policy can drift as new error codes or states appear.

**Required work:**

- Identify repeated mappings that represent one product or runtime policy.
- Consolidate only those mappings behind intention-revealing functions.
- Preserve distinct handling where the caller genuinely needs different
  behavior.
- Add focused table-driven tests for error-code and state matrices.

**Completion criteria:**

- Each error or fallback policy has one authoritative mapping where practical.
- New codes require updates in fewer places.
- Typed user-visible states remain explicit.

## Workstream 8: Review Large Feature Modules Selectively

**Priority:** Lower, evidence-driven  
**Candidate files:**

- `src/components/chat/SourceAwareChat.tsx`
- `src/components/modules/WpsDossier/WpsDossier.tsx`
- other large feature Modules identified during future work

**Current problem:**

Some feature files are large, but size alone does not prove poor design.
`SourceAwareChat.tsx`, for example, combines interaction state, request
orchestration, motion configuration, and response rendering while already
extracting several coherent rendering functions.

**Required work:**

- Review these Modules only when a feature change exposes mixed ownership,
  repeated behavior, or difficult testing.
- Extract a responsibility only when the new Module receives a meaningful name
  and stable Interface.
- Avoid speculative splitting based on line count.

**Completion criteria:**

- Any extraction improves readability, Locality, or behavior-focused testing.
- No helper-per-file fragmentation is introduced.

## Recommended Sequence

1. Complete maintainer workflow ownership and transport contract separation.
2. Deepen the validation backend and remove shallow forwarding layers.
3. Consolidate repeated error and fallback policies while those owners become
   clearer.
4. Move feature-specific CSS incrementally alongside touched features.
5. Clarify the approved source bundle only after its cross-runtime consumers
   and build constraints are confirmed.
6. Review other large feature Modules only when active work supplies evidence
   for extraction.

Each workstream should be planned and verified independently. The repository is
already active and dirty, so broad architecture rewrites should not be bundled
into one migration.

## Implementation Definition Of Done

Architecture, modularization, or clean-code work is complete only when:

- ownership and dependency direction are clearer than before
- behavior and public contracts remain unchanged unless explicitly specified
- transitional wrappers introduced by the work have removal criteria
- tests target the resulting stable Interfaces
- verification matches every touched runtime
- accessibility and degraded-state behavior remain intact
- Graphify and GitNexus outputs are refreshed when meaningful code changes make
  the current architecture maps stale

## Final Classification Rule

Use this test when adding future findings:

- Put a statement in the **constitution** when it should still govern a newly
  rewritten implementation several years from now.
- Put a statement in **implementation work** when it names a current file,
  hotspot, migration step, temporary wrapper, or completion task.

Architecture principles are durable. Refactor instructions expire when the
work is finished.
