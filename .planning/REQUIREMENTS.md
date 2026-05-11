# Requirements: Global Governance

**Defined:** 2026-05-06
**Core Value:** Users should leave the experience able to explain global governance clearly and trust that the site's claims and chatbot answers are grounded in approved material.

## v1 Requirements

### Depth Modes

- [ ] **DEPTH-01**: User can switch between Student and Expert explanation depth without losing current section context
- [ ] **DEPTH-02**: User sees depth-appropriate summaries and supporting detail in the core narrative, UN module, and West Philippine Sea dossier
- [ ] **DEPTH-03**: User-selected depth carries into chat prompts, recap surfaces, related learning cues, and suggested questions during the same session
- [ ] **DEPTH-04**: User can continue the learning flow safely when a section or answer falls back to the default depth variant

### Trust & Grounding

- [ ] **TRUST-01**: Learner can clearly distinguish grounded, weak-support, refusal, cooldown, and fallback chat outcomes, including when support is limited
- [ ] **TRUST-02**: Learner can inspect source support for flagship educational content and chatbot answers through visible labels, references, or support chips without losing orientation in the story
- [ ] **TRUST-03**: Evaluator can see visible evidence that page content, references, and chatbot answers align to approved source material

### Maintainer Readiness

- [x] **READY-01**: Maintainer can open a readiness-first overview that surfaces blockers, health signals, source status, and recommended next actions quickly
- [x] **READY-02**: Maintainer can move from a readiness finding directly to the affected source, validation run, or audit trail in one flow
- [x] **READY-03**: Maintainer can complete overview, sources, validation, and audit tasks through smaller focused private sections instead of one fragile orchestration shell

### Reliability & Verification

- [ ] **RELY-01**: Learner can reach a usable initial public experience without waiting for heavyweight non-initial modules to finish loading
- [ ] **RELY-02**: Learner can complete the main learning flow even when chat or premium visual enhancements are unavailable
- [ ] **RELY-03**: Maintainer can run a documented verification path that covers frontend, Supabase functions, backend, and browser demo checks in a fixed order before release or presentation
- [ ] **RELY-04**: Maintainer can rely on repeatable brownfield quality gates that reduce integration drift and can be rerun locally before demos or merges even before a full hosted CI pipeline exists

## v2 Requirements

### Runtime Evolution

- **CUTOVER-01**: Learner-facing chat is served by Django instead of Supabase Edge Functions

### Depth Expansion

- **DEPTH-05**: User depth preference persists across sessions or shareable links
- **CHAT-01**: Chat guidance and prompt suggestions adapt more deeply to the selected learning mode and current lesson context

### Future Experience

- **SIM-01**: User can explore a scenario-based global-governance simulator
- **VIS-01**: Product can add broader premium 3D or showcase moments without weakening the core learning flow

### Maintainer UX

- **ADMIN-01**: Private maintainer views keep source status, validation outcomes, audit entries, and error states readable, actionable, and easy to navigate

### Maintainer Modularization

- **MOD-01**: Maintainer dashboard shared infrastructure is separated from feature-owned page implementations so `maintainerDashboardShared.tsx` no longer owns full feature pages
- **MOD-02**: Source inventory UI is split so `SourcesPage.tsx` owns page state and composition while filters, tables, cards, metrics, preview rail, and formatters live in focused modules
- **MOD-03**: Backend source repository code is split into focused contract, mapper, seed, storage, mutation, memory, and Supabase implementation modules while preserving current service, view, DTO, and response behavior
- **MOD-04**: Maintainer overview data builders and visual primitives are separated from top-level `OverviewPage.tsx` composition
- **MOD-05**: Maintainer API wrappers are grouped by feature while preserving shared fetch, envelope parsing, request shape, response parsing, and session-expiry behavior

## Out of Scope

| Feature | Reason |
|---------|--------|
| General-purpose assistant behavior | Breaks the bounded academic trust model |
| Learner accounts or LMS integration | Public learner MVP remains login-free |
| Public maintainer console discovery | Private stewardship surface must stay outside learner navigation |
| Full simulator delivery in this milestone | Too large for the remaining brownfield MVP |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DEPTH-01 | Phase 1 | Pending |
| DEPTH-02 | Phase 1 | Pending |
| DEPTH-03 | Phase 1 | Pending |
| DEPTH-04 | Phase 1 | Pending |
| TRUST-01 | Phase 2 | Pending |
| TRUST-02 | Phase 2 | Pending |
| TRUST-03 | Phase 2 | Pending |
| READY-01 | Phase 3 | Complete |
| READY-02 | Phase 3 | Complete |
| READY-03 | Phase 3 | Complete |
| RELY-01 | Phase 4 | Pending |
| RELY-02 | Phase 4 | Pending |
| RELY-03 | Phase 4 | Pending |
| RELY-04 | Phase 4 | Pending |
| CUTOVER-01 | Future milestone | Deferred |
| DEPTH-05 | Future milestone | Deferred |
| CHAT-01 | Future milestone | Deferred |
| ADMIN-01 | Future milestone | Deferred |
| MOD-01 | Phase 6 | Deferred |
| MOD-02 | Phase 6 | Deferred |
| MOD-03 | Phase 6 | Deferred |
| MOD-04 | Phase 6 | Deferred |
| MOD-05 | Phase 6 | Deferred |
| SIM-01 | Future milestone | Deferred |
| VIS-01 | Future milestone | Deferred |

**Coverage:**
- v1 requirements: 14 total
- Mapped to phases: 14
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-06*
*Last updated: 2026-05-11 after codebase modularization v2 proposal ingest*
