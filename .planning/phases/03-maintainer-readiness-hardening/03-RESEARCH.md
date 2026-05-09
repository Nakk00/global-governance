# Phase 3: Maintainer Readiness Hardening - Research

**Researched:** 2026-05-07
**Domain:** Brownfield maintainer-dashboard refactor across a React + TypeScript SPA and Django admin APIs
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Readiness Overview Focus
- **D-01:** The maintainer overview should be a health-summary-first dashboard, not a blockers-first triage wall.
- **D-02:** The top summary should be grouped by workflow health rather than by abstract readiness states.
- **D-03:** Each workflow card should show status plus key metrics at a glance.
- **D-04:** The top-level summary cards should be Sources, Validation, and Audit/Operations.
- **D-05:** Clicking a workflow card should open a filtered drill-down view rather than a generic section landing or a direct jump to a single record.
- **D-06:** Filtered drill-downs should prioritize problems plus recent context.
- **D-07:** Recent context in drill-downs should appear inline per issue rather than in a separate activity strip or side panel.

#### Drill-down Flow
- **D-08:** When a readiness finding is selected, the first destination should be source detail first.
- **D-09:** Source detail should lead with the current blocking issue, with broader source orientation supporting it.
- **D-10:** After the blocking issue, the next easiest move should be to inspect supporting validation context.
- **D-11:** Validation evidence should be shown inline on source detail as a summary, with deeper validation inspection available from there.

#### Section Boundaries
- **D-12:** The private maintainer IA should use a hybrid model: keep the core implementation-friendly sections, but make the user experience readiness-first.
- **D-13:** Readiness-first navigation should live as an overview hub plus contextual readiness shortcuts inside sections.
- **D-14:** The readiness experience should be primary, while the original section model remains visible as secondary supporting structure.
- **D-15:** The Overview section should receive the largest simplification pass in this phase.

#### Frontend Decomposition Strategy
- **D-16:** Frontend decomposition should use hook and component extraction, rather than a visual-only cleanup or a full state-model rewrite.
- **D-17:** The first extraction target should be overview/readiness UI slices.
- **D-18:** Extracted pieces should use mixed organization: visual shells for UI structure plus focused workflow hooks for readiness logic.
- **D-19:** The frontend should move toward independent page-level containers rather than keeping most state in one top-level dashboard container.
- **D-20:** After the split, the top-level maintainer shell should own navigation, auth, and a small shared readiness context.

#### Backend Seam Hardening
- **D-21:** The highest-priority backend seam in this phase is the stewardship/source flow.
- **D-22:** Backend hardening should focus on repository/service separation rather than only payload cleanup or mutation-guard polish.
- **D-23:** The service layer should primarily own readiness-oriented shaping for maintainer-facing contracts.
- **D-24:** Repositories should stay narrow and own raw data retrieval and persistence only.

#### Testing Emphasis
- **D-25:** Phase 3 confidence should focus on maintainer integration seams across frontend and backend rather than one layer alone.
- **D-26:** The main testing mix should be frontend integration coverage plus Django API integration coverage, with browser E2E kept minimal.
- **D-27:** Minimal browser coverage should prove the overview-to-source-detail drill-down journey.

### the agent's Discretion
- Exact component names under `src/components/modules/MaintainerDashboard/`
- Exact hook boundaries under `src/components/modules/MaintainerDashboard/hooks/`
- DTO naming for any new readiness-specific view models that preserve current envelopes
- Exact split between Overview, Sources, Validation, and Operations files as long as readiness-first UX remains primary

### Deferred Ideas (OUT OF SCOPE)
- None
</user_constraints>

<architectural_responsibility_map>
## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Readiness-first overview cards and filtered entry points | Browser/Client | API/Backend | UI owns presentation and navigation state, but the data still comes from protected admin endpoints. |
| Source-first drill-down with blocking issue and inline validation summary | Browser/Client | API/Backend | The browser assembles the drill-down flow while the backend remains the source of truth for source detail, validation history, and evidence summaries. |
| Maintainer auth gate, session bootstrap, and route shell | Browser/Client | API/Backend | Browser state must remain local to the private shell while Django continues to enforce the actual protected boundary. |
| Stewardship dashboard shaping and source/validation readiness summaries | API/Backend | Database/Storage | This is the main seam to harden so views stay thin and repositories stop carrying too much orchestration. |
| Source persistence, lifecycle transitions, ingest dispatch, validation-run storage | Database/Storage | API/Backend | Repository boundaries should remain focused on retrieval and persistence; orchestration belongs above them. |
| Verification coverage for maintainer flows | Browser/Client | API/Backend | Frontend integration tests and Django tests should prove the main seam, with only one minimal browser proof for the key journey. |
</architectural_responsibility_map>

<research_summary>
## Summary

The current codebase already contains most of the raw capabilities this phase needs. `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx` implements route parsing, auth bootstrap, overview, source detail, validation workbench, operations history, upload flows, lifecycle mutations, chunk inspection, citation inspection, modal focus handling, and display utilities in one large file. `src/lib/maintainer/api.ts` is already a strong typed seam for frontend requests, and the Django side already exposes stable `/api/admin/*` endpoints with safe envelopes and integration tests.

The main planning insight is that this phase should not invent a new architecture. The fastest safe path is a brownfield reshaping pass: keep the existing private SPA boundary, keep the typed API layer, make the overview and drill-down experience more readiness-first, then extract that stabilized behavior into page-owned hooks and components. On the backend, move readiness-oriented orchestration into explicit services so repository modules stop mixing persistence with contract shaping.

The strongest recommendation is to sequence the phase as: first make the readiness journey clearer using the current contracts, then extract the frontend into smaller ownership boundaries, while backend seam hardening runs in parallel on its own file set. That preserves momentum without forcing a full-stack contract redesign just to improve the maintainer experience.

**Primary recommendation:** Preserve the current maintainer contracts and private SPA shell, reshape the overview and source-detail journey first, then extract frontend ownership boundaries and add backend services that own readiness shaping above narrow repositories.
</research_summary>

<standard_stack>
## Standard Stack

The established tools already present in this repo are sufficient for this phase; no new routing or state-management framework is justified.

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `react` | `19.2.4` | Maintainer UI rendering and state | Already the repo baseline; supports modern update patterns without introducing another view layer. |
| `typescript` | `5.9.3` | Typed browser contracts and refactor safety | Critical for splitting the large maintainer module without losing DTO and prop safety. |
| `vite` | `7.3.1` | SPA build and local iteration | Existing app runtime and dev workflow. |
| `Django` | `5.2.13` | Protected admin boundary and safe JSON envelopes | Already owns `/api/admin/*`; the phase should strengthen this boundary rather than move logic into the browser. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@testing-library/react` | `16.3.0` | Frontend integration-style component coverage | Use for readiness routing, filtered drill-down state, and source-detail evidence summaries. |
| `vitest` | `4.1.5` | Fast frontend/unit execution | Use as the primary UI regression layer for split hooks and page-owned containers. |
| `@playwright/test` | `1.59.1` | Minimal browser confidence | Use only for the overview-to-source-detail smoke journey required by D-27. |
| `pytest` + `pytest-django` | `9.0.3` / `4.12.0` | Django API integration coverage | Use to lock safe envelopes, service/repository seams, and fallback behavior around stewardship and validation flows. |
| `PyJWT` | `2.12.0` | Admin JWT verification support | Existing dependency backing the protected maintainer auth boundary. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Local route parser in the private shell | React Router | A router would add migration overhead and broader architecture churn without being necessary for this private surface. |
| Local page state + focused hooks | Global store (`zustand`, context-heavy state machine) | A global store would centralize more logic, but the phase decisions explicitly prefer page-level containers plus a small shared context. |
| Existing typed fetch helpers in `src/lib/maintainer/api.ts` | New client abstraction or query cache library | A new data-fetching library would add more moving parts than value for this targeted brownfield hardening pass. |

**Installation:** No new packages are required for the recommended path.
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### System Architecture Diagram

```text
Maintainer visits /maintainer/*
  -> browser session bootstrap (`getSupabaseSession`, expiry check)
  -> Django admin identity check (`/api/admin/me`)
  -> private shell resolves route + section preset
  -> overview or section page requests typed admin data
       -> `src/lib/maintainer/api.ts`
       -> Django view (`backend/sources/views.py` or `backend/validation/views.py`)
       -> service layer shapes readiness contract
       -> repository retrieves / persists source or validation records
  -> page renders workflow health, blockers, recent context, and drill-down actions
  -> source-detail page becomes the first investigative stop
       -> inline validation evidence summary
       -> deeper validation run detail only when requested
  -> verification layers prove:
       -> Vitest integration for UI states
       -> Django tests for protected contracts
       -> one Playwright smoke for overview -> source detail
```

### Recommended Project Structure
```text
src/components/modules/MaintainerDashboard/
├── MaintainerDashboard.tsx          # Shell only: auth gate, nav, shared readiness context
├── hooks/
│   ├── useMaintainerGate.ts         # Session + admin bootstrap
│   ├── useMaintainerNavigation.ts   # Route parsing + preset drill-down state
│   ├── useMaintainerDashboardData.ts
│   └── useSourceInspection.ts
├── overview/
│   ├── OverviewPage.tsx
│   └── OverviewCards.tsx
├── sources/
│   ├── SourcesPage.tsx
│   ├── SourceDetailPage.tsx
│   └── SourceInspectorTabs.tsx
├── validation/
│   ├── ValidationWorkbench.tsx
│   └── ValidationResultOverlay.tsx
└── shared/
    ├── MaintainerSectionNav.tsx
    ├── SectionState.tsx
    └── LifecycleBadge.tsx

backend/sources/
├── repository.py                    # Narrow persistence + retrieval
├── services.py                      # Readiness shaping and orchestration
└── views.py                         # Thin request/response translation

backend/validation/
├── repository.py
├── services.py
└── views.py
```

### Pattern 1: Shell Owns Gate + Navigation, Pages Own Workflow State
**What:** Keep `MaintainerDashboard.tsx` responsible for auth bootstrap, shell-level navigation, and only the smallest shared readiness context; move per-section fetch state and UI logic into page-owned hooks/components.

**When to use:** Any time a single SPA feature file has mixed auth, routing, fetch orchestration, render trees, modals, and data formatting in one place.

**Example:**
```tsx
// Shell boundary
export function MaintainerDashboard() {
  const gate = useMaintainerGate()
  const navigation = useMaintainerNavigation()

  if (gate.state !== "ready") {
    return <MaintainerAccessBoundary gate={gate} />
  }

  return (
    <MaintainerShell navigation={navigation}>
      <MaintainerRoutes route={navigation.route} session={gate.session} />
    </MaintainerShell>
  )
}
```

### Pattern 2: Source Detail Is the Investigative Hub
**What:** Readiness cards should not try to solve every issue inline. They should route maintainers into source detail with a preserved filter/preset, where the blocking issue appears first and validation evidence is summarized in-place.

**When to use:** Any readiness UI where maintainers need a fast “what is wrong -> what source is affected -> what evidence supports it” path.

**Example:**
```tsx
// Page-level drill-down pattern
<SourceDetailPage
  sourceId={route.sourceId}
  readinessPreset={route.preset}
  initialPanel="blocker"
  showValidationSummary
/>
```

### Pattern 3: Services Shape Contracts, Repositories Stay Narrow
**What:** Introduce `services.py` above repositories for dashboard composition, readiness rollups, and view-oriented orchestration while keeping repository methods focused on raw retrieval, mutation, and persistence.

**When to use:** When repository modules start containing both data access and the higher-level rules that determine how the UI should understand readiness.

**Example:**
```python
# backend/sources/services.py
def get_stewardship_dashboard() -> StewardshipDashboardDto:
    snapshots = repository.list_source_snapshots()
    validation_state = validation_services.list_validation_runs()
    return build_readiness_dashboard(snapshots=snapshots, validation_state=validation_state)
```

### Anti-Patterns to Avoid
- **Router rewrite as “cleanup”:** This phase is a maintainer hardening pass, not a platform rewrite.
- **Global store first:** The locked decisions call for page-level ownership plus a small shared shell context, not another giant center of gravity.
- **Repository as service layer:** `backend/sources/repository.py` already shows the cost of mixing persistence, orchestration, and DTO shaping in one place.
- **Test pyramid inversion:** Do not turn readiness-state matrices into broad Playwright suites when Vitest and Django tests can prove them faster.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Private-route platform rewrite | A new router architecture for the maintainer shell | The existing local route parser with targeted presets | The public app is intentionally SPA-first and the private shell only needs focused route-state hardening. |
| Generic client cache system | A new query client or global fetch cache | `src/lib/maintainer/api.ts` plus page-owned loading state | The current typed fetch seam is already good enough and keeps the refactor scope honest. |
| Backend envelope system | A second response/error abstraction for admin views | Existing `success_response` / `error_response` helpers | Safe admin envelopes are already standardized; duplicate abstractions create drift. |
| End-to-end regression matrix | Large browser-only coverage for every readiness state | Vitest + Django tests + one smoke Playwright journey | Faster layers already cover most of the business logic and state branching. |

**Key insight:** This phase wins by clarifying ownership boundaries, not by introducing more infrastructure. The repo already has the primitives needed; the risk is overbuilding while trying to “clean up.”
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Reordering the UI Before Stabilizing the Workflow
**What goes wrong:** The file gets split into many components before the readiness journey itself is clarified, which spreads the confusion across more files.
**Why it happens:** Component extraction feels safer than behavior changes, so teams decompose first.
**How to avoid:** First land the readiness-first overview and source-first drill-down using the existing contracts, then extract the settled behavior into hooks and page components.
**Warning signs:** New files appear quickly, but the overview still behaves like a generic section switcher.

### Pitfall 2: Hidden Shared State After the Split
**What goes wrong:** A “decomposed” maintainer surface still relies on one top-level component for page-specific fetches, stale-response guards, and modal coordination.
**Why it happens:** The original top-level state is copied into helper functions rather than being reassigned to page ownership.
**How to avoid:** Move gate/session/nav state into the shell and give each page its own hook for data and effect lifecycles.
**Warning signs:** The shell still imports most fetch functions or keeps many `useState` branches for pages it no longer renders directly.

### Pitfall 3: Service Layer That Merely Wraps the Repository
**What goes wrong:** `services.py` becomes a thin pass-through and repository complexity remains unchanged.
**Why it happens:** Teams add the file but do not move readiness shaping and contract assembly out of the repository.
**How to avoid:** Move dashboard composition, source-detail readiness summaries, and validation fallback orchestration into explicit service functions with tests.
**Warning signs:** Views keep importing repository functions directly, or service tests cannot assert any behavior beyond “calls repository once.”
</common_pitfalls>

<code_examples>
## Code Examples

### Safe stale-response guard belongs with the page-owned fetch
```tsx
// Source: current repo pattern in MaintainerDashboard.tsx
const requestKey = ++detailRequestKeyRef.current
setDetailState({ state: "loading" })
const source = await fetchSourceDetail(sourceId, session)
if (requestKey !== detailRequestKeyRef.current) {
  return
}
setDetailState({ state: "ready", source })
```

### Existing typed API seam should remain the browser boundary
```ts
// Source: src/lib/maintainer/api.ts
export async function fetchSourceDetail(sourceId: string, session: SupabaseSession) {
  return fetchMaintainerJson<SourceDetail>(
    `/api/admin/sources/${encodeURIComponent(sourceId)}`,
    session
  )
}
```

### Existing Django view helpers already support a thin-view pattern
```py
# Source: backend/sources/views.py
def _mutation_response(action: Callable[[], object], *, status: int = 200) -> JsonResponse:
    try:
        return success_response(action(), status=status)
    except SourceMutationError as error:
        return error_response(
            code=error.code,
            message=error.message,
            status=error.status,
            details={"fields": error.fields} if error.fields else None,
        )
```
</code_examples>

<sota_updates>
## State of the Art (2024-2025)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Huge feature component with all async state in one file | Page-owned hooks and extracted composites | Ongoing React app maintenance norm | Easier stale-response control, clearer test seams, smaller blast radius per change. |
| Browser-heavy regression coverage | Vitest + integration tests with small browser smoke layer | Matured across 2024-2025 frontend testing practice | Faster feedback and less flaky maintenance for readiness-state matrices. |
| Repository modules doing both access and orchestration | Explicit service layer above repositories | Common Django/service-boundary evolution | Makes contracts easier to reason about and safer to extend for maintainer workflows. |

**New tools/patterns to consider:**
- `startTransition` for non-urgent maintainer route or filter changes that should not block user input.
- `useEffectEvent` only where event-style callback extraction genuinely simplifies effect dependencies; do not force it where plain closures are clearer.

**Deprecated/outdated:**
- Big “dashboard container” ownership as the default answer for every private-surface problem.
- Broad Playwright-first test matrices for data-state coverage already provable in Vitest or Django.
</sota_updates>

<open_questions>
## Open Questions

1. **Does the readiness overview need new backend aggregate fields immediately?**
   - What we know: The current dashboard DTO already exposes `overview`, source inventory, validation runs, and audit events.
   - What's unclear: Whether the desired workflow cards can be satisfied by deriving counts client-side or whether the API should expose explicit workflow summaries.
   - Recommendation: Plan the UI to work with current DTOs first; only add backend aggregate fields if the client-side derivation becomes too brittle during execution.

2. **How far should the frontend extraction go in one phase?**
   - What we know: The current file has many clear extraction targets, especially overview, source detail, validation workbench, and shared shell pieces.
   - What's unclear: Whether modal/inspection utilities should move in the same pass or remain in the shell until later.
   - Recommendation: Prioritize page-level containers and hooks first; only extract low-level utilities when it meaningfully reduces shell ownership.
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx` — current private-shell ownership, route parsing, stale-response guards, page render tree
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` — existing frontend readiness and private-surface behavior coverage
- `src/lib/maintainer/api.ts` — typed admin DTOs and browser request boundary
- `backend/sources/repository.py` — current stewardship repository/protocol/orchestration blend
- `backend/sources/views.py` — admin source endpoints and safe envelope helpers
- `backend/validation/repository.py` — validation-run lifecycle, fallback behavior, and immutable run summaries
- `backend/validation/views.py` — validation endpoints and launch boundary
- `backend/tests/test_admin_stewardship.py`, `backend/tests/test_admin_validation.py`, `backend/tests/test_admin_auth.py` — integration coverage that constrains safe refactors
- `AGENTS.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, `.planning/PROJECT.md`, `.planning/phases/03-maintainer-readiness-hardening/03-CONTEXT.md`

### Secondary (MEDIUM confidence)
- `graphify-out-merged/GRAPH_REPORT.md`, `graphify-out/GRAPH_REPORT.md`, `graphify-out-backend/GRAPH_REPORT.md` — architectural orientation only; graph is stale relative to `HEAD`
- GitNexus query/context results for `MaintainerDashboard` and `StewardshipRepository` — useful for relationship confirmation and blast-radius awareness

### Tertiary (LOW confidence - needs validation)
- None
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: React/Vite maintainer SPA + Django protected admin APIs
- Ecosystem: Vitest, React Testing Library, Playwright, pytest-django
- Patterns: readiness-first drill-down, page-owned hooks, service-over-repository shaping
- Pitfalls: monolithic shell state, false decompositions, pass-through services

**Confidence breakdown:**
- Standard stack: HIGH - derived from repo-pinned dependencies and current runtime boundaries
- Architecture: HIGH - verified directly against current source files
- Pitfalls: HIGH - visible in current file concentration and test layering
- Code examples: HIGH - sourced from the existing codebase

**Research date:** 2026-05-07
**Valid until:** 2026-06-06
</metadata>

---
*Phase: 03-maintainer-readiness-hardening*
*Research completed: 2026-05-07*
*Ready for planning: yes*
