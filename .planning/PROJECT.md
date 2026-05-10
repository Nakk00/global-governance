# Global Governance

## What This Is

Global Governance is a brownfield React + TypeScript single-page educational experience for GNED-07: The Contemporary World. It combines guided scrollytelling, interactive institutional and case-study modules, a grounded public chatbot, and a private maintainer readiness surface so students can understand and present global governance with confidence while maintainers keep the trust model healthy.

## Core Value

Users should leave the experience able to explain global governance clearly and trust that the site's claims and chatbot answers are grounded in approved material.

## Requirements

### Validated

- ✓ Learners can move through a section-based public SPA that covers the core narrative, United Nations exploration, and West Philippine Sea case-study flow — existing brownfield baseline
- ✓ Learners can use a grounded public chat surface that returns answered, weak-support, refusal, and cooldown states through the active Supabase Edge Function path — existing brownfield baseline
- ✓ Maintainers can sign in to a private console and inspect readiness, sources, validation, and audit workflows through protected Django APIs — existing brownfield baseline
- ✓ The repo already supports split verification lanes across frontend unit tests, Supabase function tests, Django tests, and Playwright browser checks — existing brownfield baseline
- ✓ Maintainers can use a readiness-first private console with source-first drill-downs, inline validation evidence, and thinner frontend/backend stewardship seams — validated in Phase 3: Maintainer Readiness Hardening

### Active

- [ ] Add Student / Expert depth mode as an MVP capability across the narrative, flagship modules, recap surfaces, and chat context
- [ ] Harden trust and clarity so chat, references, and page content expose source support and failure states consistently in demo conditions
- [ ] Improve performance and release verification so the public learner flow remains reliable on the reference demo device

### Out of Scope

- Public Django chat cutover — deferred while `supabase/functions/v1/chat` remains the active learner-facing boundary
- General-purpose or open-domain assistant behavior — the chatbot stays bounded to approved project material
- Learner accounts, LMS integration, or a public maintainer dashboard — the learner experience remains login-free and the admin surface remains private
- Full simulator scope or broad heavy-3D expansion — stretch work only after MVP reliability and clarity are stable

## Context

The repo is already a substantial brownfield implementation. The public experience is a Vite SPA with anchor-navigation structure, typed content modules in `src/data/`, learner-facing chat in `src/components/chat/`, and flagship modules such as the UN Command Center and WPS dossier in `src/components/modules/`. The live grounded-chat path still runs through Supabase Edge Functions, while Django currently owns protected maintainer/auth/source/validation operations behind `/api/admin/*`.

Project documentation already exists in BMAD artifacts, codebase mapping docs, Graphify reports, and GitNexus indexing. Those inputs agree on the product direction but disagree in one important area: some planning artifacts assume an eventual Django-owned public chat boundary, while the current codebase and tests still treat that cutover as intentionally deferred. This initialization therefore anchors to actual brownfield behavior first and treats public-chat migration as future scope unless explicitly re-promoted.

The current product value is already visible: the learning flow, grounded chat, and private stewardship surface exist. The highest-value remaining MVP work is not starting from zero. It is finishing the narrative depth system, tightening trust cues, reducing maintainer fragility, and making demo readiness more repeatable.

Phase 3 is now complete. The maintainer surface has a readiness-first overview, source-first investigation flow, inline validation evidence, thinner dashboard shell ownership, and explicit backend service seams. The next planning focus is demo reliability and repeatable verification for the remaining MVP path.

An archived chatbot/admin improvement proposal has now been folded into the same roadmap. Its chat-side ideas reinforce the existing depth, trust, and reliability phases, while its admin-side ideas sharpen the private readiness direction already validated in Phase 3. The proposal does not introduce a new runtime boundary; it tightens the current brownfield priorities.

## Constraints

- **Tech stack**: Keep the frontend as a React + TypeScript SPA built with Vite and `pnpm` — this preserves the current public architecture and avoids an unnecessary framework pivot
- **Runtime boundary**: Keep browser-safe code in `src/`, protected maintainer orchestration in Django, and the active public chat/retrieval path in Supabase Edge Functions until a deliberate cutover phase exists
- **Product scope**: The learner journey must remain usable without login, and the maintainer surface must stay private and non-public-facing
- **Accessibility**: Reduced motion, keyboard access, visible fallback states, and readable presentation remain non-negotiable across all new work
- **Performance**: Heavy modules, optional premium visuals, and depth-aware enhancements must not break the initial usable state on the reference device
- **Trust model**: Off-topic refusal, weak support, cooldown, and source visibility are typed product behaviors, not optional polish

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Treat initialization as a brownfield MVP setup | Existing code already implements the core narrative, chat, and private maintainer baseline; planning from scratch would ignore real architecture and risk | ✓ Good |
| Promote Student / Expert mode into active MVP scope | You explicitly chose `2B`, and adaptive depth is the largest remaining capability gap between the current brownfield baseline and the desired classroom-ready product | — Pending |
| Keep roadmap granularity coarse | The project already has many moving parts; coarse phases keep the next planning wave focused on the highest-risk MVP gaps instead of re-sharding old work | — Pending |
| Keep the active learner chat boundary on Supabase Edge Functions | Codebase mapping, route guards, and current client wiring all confirm the Django public chat cutover is intentionally deferred today | ✓ Good |
| Use interactive workflow gates with research, plan check, and verifier enabled | The product still has meaningful scope and architecture decisions ahead, so guarded planning is worth the extra friction | — Pending |
| Absorb the archived chatbot/admin improvement proposal into the current v1 roadmap | It aligns with existing phase intent and should sharpen, not replace, the brownfield plan | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `$gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `$gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-10 after chatbot/admin proposal merge*
