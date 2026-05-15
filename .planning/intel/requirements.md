# Ingested Requirements

Source: `archive/docs/planning-artifacts/codebase-modularization-v2-proposal.md`

## MOD-01: Maintainer Shared Module Split

Maintainer dashboard shared infrastructure should be separated from feature-owned page implementations so `maintainerDashboardShared.tsx` no longer owns full feature pages.

Acceptance signals:
- Shared types, routing helpers, generic read states, mutation state helpers, and generic formatters live in focused shared modules.
- Source detail implementation lives under `src/components/modules/MaintainerDashboard/sources/`.
- Validation implementation lives under `src/components/modules/MaintainerDashboard/validation/`.
- Audit Trail and Chatbot Trust implementation live in feature-owned folders.
- Existing route behavior, public component behavior, source detail lazy loading, and tests remain stable.

## MOD-02: Source Inventory Page Split

`SourcesPage.tsx` should become a page coordinator instead of a combined page and component library.

Acceptance signals:
- Inventory filters, table, mobile cards, preview rail, source metrics, and source formatting helpers are extracted.
- Page-level selected source, pagination, filter state, composition, and navigation calls remain in `SourcesPage.tsx`.

## MOD-03: Backend Source Repository Split

`backend/sources/repository.py` should stop owning repository contracts, implementations, mappers, storage, mutation helpers, and seed data in one file.

Acceptance signals:
- Repository protocol and shared errors live in a base module.
- Seed data, row mappers, storage helpers, mutation validation, in-memory repository, and Supabase repository live in focused modules.
- `backend/sources/repository.py` remains as a temporary compatibility export layer while imports settle.
- Service function names, view behavior, DTO fields, response envelopes, source mutation semantics, and safe 404 behavior remain stable.

## MOD-04: Overview Page Decomposition

`OverviewPage.tsx` should separate data builders and visual primitives from top-level page composition.

Acceptance signals:
- Blocker, action, source, validation, audit, and trust summary builders are extracted.
- Page-level layout, section ordering, and dashboard composition remain in `OverviewPage.tsx`.

## MOD-05: Maintainer API Wrapper Split

`src/lib/maintainer/api.ts` should preserve shared fetch/envelope/session behavior while grouping endpoint wrappers by feature.

Acceptance signals:
- Shared client and envelope parsing stay centralized.
- Auth, source, validation, mutation, and ingestion wrappers are grouped in feature-specific modules.
- Function names remain stable where practical.
- Request shape, response parsing, and session-expiry behavior remain stable.

## DOC-01: Action-First Admin Side Guide

The private maintainer/admin behavior should be documented in a beginner-friendly guide that explains sign-in, the private gate, section routing, dashboard triage, source inventory, source-detail remediation, validation follow-up, chatbot trust diagnosis, audit confirmation, and the browser/backend boundary.

Acceptance signals:
- The guide covers the maintainer entry point, sign-in/session behavior, and `GET /api/admin/me` gate.
- The guide explains the dashboard cards, blocker labels, top-level tabs, and nested source tabs in plain language.
- The guide answers "what does this mean, where do I click, what do I do next, and how do I know it is fixed?" for `High`, `Medium`, `Pending`, `Queued`, `Processing`, `Stale`, `Partial`, `Approved`, `Passed`, and weak-support states.
- The guide includes a Mermaid graph for the end-to-end request path and a short verification summary.
- The guide clearly separates verified behavior from inferred notes or future improvements.

## DOC-02: Verification Summary And Gap List

The guide should include a short summary of what is confirmed by code and tests and a gap list for anything still unclear or untested.

Acceptance signals:
- Verified code and test areas are named explicitly, including the maintainer dashboard shell, source detail tabs, validation workbench, audit trail, trust page, and relevant backend auth/source/validation boundaries.
- Remaining gaps or risks are called out instead of hidden, especially any `Pending` interpretation, synthetic summary values, or unsupported repair steps.
- The guide avoids presenting assumptions as confirmed facts.
- Any blocker or status that depends on context includes the next safe page or tab to inspect.
