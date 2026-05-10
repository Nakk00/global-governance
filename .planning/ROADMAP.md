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
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Depth-Aware Learning Foundation | 0/3 | Not started | - |
| 2. Trust And Grounding Clarity | 0/2 | Not started | - |
| 3. Maintainer Readiness Hardening | 3/3 | Complete    | 2026-05-09 |
| 4. Demo Reliability And Verification | 0/3 | Not started | - |

### Phase 5: Admin UX Polish for Maintainers

**Goal:** Turn the private maintainer surface into a dark analytics-heavy control center with richer monitoring metrics and first-class `Audit Trail` and `Chatbot Trust` sections.
**Requirements**: [ADMIN-01]
**Depends on:** Phase 4
**UI hint:** yes
**Success Criteria** (what must be TRUE):
1. Maintainer opens a multi-card control center that emphasizes readiness, blockers, validation health, and next actions.
2. `Audit Trail` and `Chatbot Trust` are first-class private sections, while `Settings` remains secondary.
3. The private maintainer console stays inside the existing SPA shell while the dashboard contract becomes richer.
**Plans:** 2 plans

Plans:

**Wave 1**
- [ ] 05-01: Extend the maintainer monitoring contract and backend aggregates for rich overview, audit, and trust signals

**Wave 2** *(blocked on Wave 1 completion)*
- [ ] 05-02: Rebuild the maintainer shell into a dark control center with first-class Audit Trail and Chatbot Trust sections

Cross-cutting constraints:
- The maintainer console must remain private, SPA-first, and anchor-navigation oriented.
- The richer backend monitoring model is the canonical source of truth for overview, audit, and trust signals.
- `Settings` stays out of first-class navigation in Phase 5.
- The provided `Admin-Background.png` and `Admin-Logo.png` assets should be used to reinforce the admin brand.
- The control center must remain readable on mobile screens.
