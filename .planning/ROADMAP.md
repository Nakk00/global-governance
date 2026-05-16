# Roadmap: Global Governance

## Overview

This roadmap starts from the real brownfield baseline instead of replaying already-built work. The current repo already delivers the public learning shell, grounded chat, and private maintainer foundation, so the next milestone focuses on the remaining MVP gaps: depth-aware learning, trust/readiness polish, maintainer stability, and presentation-safe reliability.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Depth-Aware Learning Foundation** - Add Student / Expert mode across the public learning flow without destabilizing the existing SPA
- [ ] **Phase 2: Trust And Grounding Clarity** - Make source support, chat state semantics, and evaluator trust cues coherent across narrative and chat
- [x] **Phase 3: Maintainer Readiness Hardening** - Turn the private stewardship surface into a clearer, less fragile readiness console (completed 2026-05-09)
- [ ] **Phase 4: Demo Reliability And Verification** - Finish the brownfield MVP with performance hardening and repeatable pre-demo quality gates
- [x] **Phase 5: Admin UX Polish for Maintainers** - Turn the private maintainer surface into a dark analytics-heavy control center with richer monitoring metrics and first-class Audit Trail and Chatbot Trust sections (completed 2026-05-11; security review skipped by --force)
- [x] **Phase 6: Maintainer Codebase Modularization** - Reduce maintainer console and source stewardship file size, mixed responsibilities, and review risk through behavior-preserving module splits (completed 2026-05-14)
- [x] **Phase 7: Validation Evidence Bridge** - Bridge completed admin validation runs into source-facing stewardship history (completed 2026-05-16; phase 07.4 guided remediation workflow completed 2026-05-16)

## Phase Details

### Phase 1: Depth-Aware Learning Foundation
**Goal**: Introduce Student / Expert mode as an MVP capability through shared content modeling, thin session state, and depth-aware rendering across the public learning experience.
**Depends on**: Nothing (first phase)
**Requirements**: [DEPTH-01, DEPTH-02, DEPTH-03, DEPTH-04]
**UI hint**: yes
**Success Criteria** (what must be TRUE):
1. User can switch between Student and Expert mode without losing orientation or current section progress
2. User sees depth-appropriate narrative, module, and recap content in the same session
3. User-selected depth is reflected in chat context, suggested questions, and related learning cues where supported and falls back safely where not yet specialized
4. The public learning flow remains usable when a depth variant is missing
**Plans**: 3 plans

Plans:
- [ ] 01-01: Design the shared depth-aware content contract and session-state seam
- [ ] 01-02: Apply depth-aware rendering to the narrative shell, flagship modules, and recap surfaces
- [ ] 01-03: Thread depth context through chat requests, suggested questions, fallbacks, and verification coverage

### Phase 2: Trust And Grounding Clarity
**Goal**: Make the product’s academic trust model obvious to learners and evaluators through consistent source support, chat-state semantics, and reference visibility.
**Depends on**: Phase 1
**Requirements**: [TRUST-01, TRUST-02, TRUST-03]
**UI hint**: yes
**Success Criteria** (what must be TRUE):
1. Learner can tell the difference between grounded, weak-support, refusal, cooldown, and fallback states without guessing
2. Learner can inspect source support for flagship content and chat answers without losing place in the story
3. Evaluator can verify that references and chat responses align to approved materials through visible evidence surfaces
**Plans**: 2 plans

Plans:
- [ ] 02-01: Standardize trust-state UX, source-support labels, and reference patterns across learner surfaces
- [ ] 02-02: Align content, references, and chat evidence behavior with approved-source expectations

### Phase 3: Maintainer Readiness Hardening
**Goal**: Make the private stewardship surface easier to reason about, easier to navigate, and safer to extend as the brownfield MVP approaches demo use.
**Depends on**: Phase 2
**Requirements**: [READY-01, READY-02, READY-03]
**UI hint**: yes
**Success Criteria** (what must be TRUE):
1. Maintainer can open a readiness-first overview and immediately understand blockers and next actions
2. Maintainer can jump from high-level readiness findings to the affected source, validation, or audit context in one flow
3. Private overview, sources, validation, and audit tasks are split into smaller focused sections with clearer ownership and safer testing seams
**Plans**: 3 plans

Plans:

**Wave 1**
- [x] 03-01: Reshape the private information architecture around readiness-first workflows
- [x] 03-03: Strengthen backend/repository seams and targeted tests for stewardship and validation flows

**Wave 2** *(blocked on Wave 1 completion)*
- [x] 03-02: Split monolithic maintainer orchestration into smaller UI slices and focused hooks/components

Cross-cutting constraints:
- The maintainer experience must stay readiness-first while the original section model remains visible as secondary supporting structure.
- Readiness findings must route maintainers into source detail first, with validation evidence summarized inline before deeper inspection.
- Confidence should come primarily from frontend integration plus Django API integration coverage, with only minimal Playwright smoke coverage for the key browser journey.

### Phase 4: Demo Reliability And Verification
**Goal**: Make the brownfield MVP presentation-safe by tightening initial load behavior, graceful degradation, and repeatable multi-runtime verification.
**Depends on**: Phase 3
**Requirements**: [RELY-01, RELY-02, RELY-03, RELY-04]
**UI hint**: yes
**Success Criteria** (what must be TRUE):
1. Learner can reach a usable first render without unnecessary heavyweight modules blocking the path
2. Learner can complete the core educational flow even when chat or premium visuals are unavailable
3. Maintainer can run a documented pre-demo verification path across frontend, functions, backend, and browser coverage
4. The team can rehearse release/demo confidence without depending on memory alone
**Plans**: 3 plans

Plans:
- [ ] 04-01: Profile and lazy-load the right public-facing modules and failure paths
- [ ] 04-02: Harden graceful degradation and fallback coverage for chat and premium surfaces
- [ ] 04-03: Codify the brownfield verification path and close the most important cross-runtime gaps

## Progress

**Execution Order:**
Phases execute in numeric order unless explicitly re-promoted or forced: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 07.1 → 07.2 → 07.3 → 07.4 → 07.5 → 07.6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Depth-Aware Learning Foundation | 0/3 | Not started | - |
| 2. Trust And Grounding Clarity | 0/2 | Not started | - |
| 3. Maintainer Readiness Hardening | 3/3 | Complete    | 2026-05-09 |
| 4. Demo Reliability And Verification | 0/3 | Not started | - |
| 5. Admin UX Polish for Maintainers | 2/2 | Complete | 2026-05-11 |
| 6. Maintainer Codebase Modularization | 5/5 | Complete   | 2026-05-14 |
| 7. Validation Evidence Bridge | 1/1 | Complete | 2026-05-16 |

### Phase 5: Admin UX Polish for Maintainers

**Goal:** Turn the private maintainer surface into a dark analytics-heavy control center with richer monitoring metrics and first-class `Audit Trail` and `Chatbot Trust` sections.
**Requirements**: [ADMIN-01]
**Depends on:** Phase 4
**UI hint:** yes
**Status:** Complete — 2026-05-11
**Success Criteria** (what must be TRUE):
1. Maintainer opens a multi-card control center that emphasizes readiness, blockers, validation health, and next actions.
2. `Audit Trail` and `Chatbot Trust` are first-class private sections, while `Settings` remains secondary.
3. The private maintainer console stays inside the existing SPA shell while the dashboard contract becomes richer.
**Plans:** 2 plans

Plans:

**Wave 1**
- [x] 05-01: Extend the maintainer monitoring contract and backend aggregates for rich overview, audit, and trust signals

**Wave 2** *(blocked on Wave 1 completion)*
- [x] 05-02: Rebuild the maintainer shell into a dark control center with first-class Audit Trail and Chatbot Trust sections

Cross-cutting constraints:
- The maintainer console must remain private, SPA-first, and anchor-navigation oriented.
- The richer backend monitoring model is the canonical source of truth for overview, audit, and trust signals.
- `Settings` stays out of first-class navigation in Phase 5.
- The provided `Admin-Background.png` and `Admin-Logo.png` assets should be used to reinforce the admin brand.
- The control center must remain readable on mobile screens.
- `$gsd-secure-phase 5` was skipped via `$gsd-progress --next --force`; carry this as explicit verification debt if security review is needed later.

### Phase 6: Maintainer Codebase Modularization

**Goal:** Reduce maintainer console and source stewardship file size, mixed responsibilities, and review risk through behavior-preserving module splits after the Phase 5 control-center work stabilizes.
**Requirements**: [MOD-01, MOD-02, MOD-03, MOD-04, MOD-05]
**Depends on:** Phase 5
**UI hint:** no
**Success Criteria** (what must be TRUE):
1. `maintainerDashboardShared.tsx` no longer owns full feature pages.
2. Source detail, validation, audit trail, and chatbot trust implementations live in feature-owned folders.
3. `SourcesPage.tsx` is reduced to page state and page composition.
4. `backend/sources/repository.py` becomes a compatibility export layer instead of a monolithic repository implementation.
5. `OverviewPage.tsx` and maintainer API wrappers are split without changing routes, DTO fields, response envelopes, or session-expiry behavior.
**Plans:** 5/5 plans complete

Plans:

**Wave 1**
- [x] 06-01: Split maintainer shared types, routing, states, mutation helpers, and generic formatters

**Wave 2**
- [x] 06-02: Move source detail, validation, audit trail, and chatbot trust implementation into feature-owned modules

**Wave 3**
- [x] 06-03: Split source inventory page components and metrics helpers

**Wave 4**
- [x] 06-04: Split backend source repository into base, mapper, seed, storage, mutation, memory, and Supabase modules

**Wave 5**
- [x] 06-05: Split overview builders and maintainer API wrappers by feature

Cross-cutting constraints:
- The modularization must be behavior-preserving from a user and API-consumer perspective.
- Frontend routes, backend response contracts, DTO field names, session-expiry behavior, and private maintainer boundaries must stay stable.
- Compatibility exports are allowed during transition to reduce import churn.
- Backend repository work must run GitNexus impact analysis before implementation and keep backend verification focused on stewardship behavior.

### Phase 7: Validation Evidence Bridge

**Goal:** Bridge completed admin validation runs into source-facing stewardship history so source detail and inventory stay in sync with the validation workbench.
**Requirements**: [ADMIN-02]
**Depends on:** Phase 6
**UI hint:** no
**Success Criteria** (what must be TRUE):
1. Completed validation runs append one source history row per unique canonical source after terminal completion.
2. Source detail and inventory read `latestValidationOutcome` and `validationHistory` from backend-provided data.
3. The validation run stays immutable and the bridge remains service-role only with no browser-side writeback.
**Plans:** 1/1 plans complete

Plans:

**Wave 1**
- [x] 07-01: Bridge completed admin validation runs into source-facing stewardship history

Cross-cutting constraints:
- The writeback path must remain service-role only.
- The bridge must fail closed on unresolved snapshot ids and never write partial source history rows.
- The validation run remains immutable; source-facing history is append-only after terminal completion.
- Source detail and inventory continue to read backend-provided `latestValidationOutcome` and `validationHistory` without browser-side synthesis.

### Phase 07.1: Address tech debt: trust and grounding (INSERTED)

**Goal:** Make grounded, weak-support, refusal, cooldown, and fallback states legible while keeping source support visible on learner and evaluator surfaces.
**Requirements**: [TRUST-01, TRUST-02, TRUST-03]
**Depends on:** Phase 7
**UI hint:** yes
**Success Criteria** (what must be TRUE):
1. Learners can distinguish grounded, weak-support, refusal, cooldown, and fallback chat outcomes without losing orientation.
2. Learners can inspect source support for flagship content and chatbot answers through visible labels, references, or support chips.
3. Evaluators can verify that page content, references, and chatbot answers align to approved source material.
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 07.1 to break down)

### Phase 07.2: Address tech debt: depth-aware learning (INSERTED)

**Goal:** Preserve depth selection across the public learning flow and fall back safely when specialized variants are missing.
**Requirements**: [DEPTH-01, DEPTH-02, DEPTH-03, DEPTH-04]
**Depends on:** Phase 7
**UI hint:** yes
**Success Criteria** (what must be TRUE):
1. Users can switch between Student and Expert modes without losing current section context.
2. Depth-appropriate summaries and supporting detail appear in the core narrative, UN module, and West Philippine Sea dossier.
3. Depth selection carries into chat prompts, recap surfaces, related learning cues, and suggested questions during the same session.
4. The learning flow continues safely when a section or answer falls back to the default depth variant.
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 07.2 to break down)

### Phase 07.3: Address tech debt: demo reliability and verification (INSERTED)

**Goal:** Finish the brownfield MVP with graceful degradation and a fixed verification path for demos and releases.
**Requirements**: [RELY-01, RELY-02, RELY-03, RELY-04]
**Depends on:** Phase 7
**UI hint:** yes
**Success Criteria** (what must be TRUE):
1. Users can reach a usable initial public experience without waiting for heavyweight non-initial modules.
2. Users can complete the main learning flow even when chat or premium visuals are unavailable.
3. Maintainers can run a documented verification path that covers frontend, Supabase functions, backend, and browser demo checks in a fixed order before release or presentation.
4. Maintainers can rerun repeatable brownfield quality gates locally before demos or merges even before a full hosted CI pipeline exists.
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 07.3 to break down)

### Phase 07.4: Guided remediation workflow (INSERTED)

**Goal:** Turn non-pass validation results into explicit remediation items with deterministic classification, routing, and review visibility.
**Requirements**: [REMED-01]
**Depends on:** Phase 07.3
**UI hint:** yes
**Success Criteria** (what must be TRUE):
1. Validation runs create remediation items for each non-pass result.
2. Remediation items show the outcome, likely cause, destination surface, and next action clearly enough for maintainers to triage without guessing.
3. The workflow keeps immutable validation evidence separate from repair actions.
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 07.4 to break down)

### Phase 07.5: Safe remediation helpers (INSERTED)

**Goal:** Add explicit maintainer-approved helper actions and rerun confirmation so common remediation loops become faster without weakening trust boundaries.
**Requirements**: [REMED-02]
**Depends on:** Phase 07.4
**UI hint:** yes
**Success Criteria** (what must be TRUE):
1. Maintainers can open the affected source, inspect citations, retry validation, queue re-ingest, or mark an expected refusal through explicit actions.
2. Every applied helper action is auditable and visible in the repair history.
3. Resolution requires rerun confirmation rather than a source edit alone.
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 07.5 to break down)

### Phase 07.6: AI suggestion layer (INSERTED)

**Goal:** Add clearly labeled AI suggestions for remediation diagnosis and draft notes without autonomous writeback or hidden state changes.
**Requirements**: [REMED-03]
**Depends on:** Phase 07.5
**UI hint:** yes
**Success Criteria** (what must be TRUE):
1. AI can suggest likely causes, missing evidence, and next actions for remediation items.
2. AI suggestions stay review-required and never write directly into approved-source state.
3. Maintainers can use AI output as guidance without losing the ability to approve or reject every actual change.
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 07.6 to break down)
