<!--
Sync Impact Report
Version change: 1.1.0 -> 2.0.0
Modified principles:
- I. Multi-Runtime Architecture Boundaries: corrected public-chat ownership from
  Supabase Edge Functions to Django
- VI. Verification and Delivery Safety -> VI. Test-Driven Verification and
  Delivery Safety
Added sections:
- Mandatory red-green-refactor workflow and test-first exception policy
- 80% changed-scope coverage gate and critical-journey E2E policy
Removed sections: None
Templates requiring updates:
- .specify/templates/plan-template.md: updated
- .specify/templates/spec-template.md: updated
- .specify/templates/tasks-template.md: updated
- .specify/templates/checklist-template.md: updated
- .specify/templates/commands/*.md: not present in this Spec Kit install
- AGENTS.md: updated
- README.md: reviewed, no update required
Follow-up TODOs: None
-->

# Global Governance Constitution

## Core Principles

### I. Multi-Runtime Architecture Boundaries
This repository MUST remain a multi-runtime modular monorepo unless a future
constitution amendment explicitly changes the architecture. The public
frontend MUST remain a Vite-backed React + TypeScript single-page app.
Protected maintainer and administrative workflows MUST remain in the Django
modular monolith under `backend/`. Public grounded chat orchestration,
Redis-backed protection, privileged retrieval, citation packaging, and
model-provider integration MUST remain in Django. Supabase Edge Functions
MUST remain limited to non-chat ingestion and storage-support workflows unless
an approved architecture change assigns them elsewhere.

Browser-facing code MUST live in `src/`. Service-role access, server secrets,
privileged retrieval, protected orchestration, and server-side persistence
MUST stay in server-only runtimes. Plans MUST NOT assume Next.js, App Router,
server components, React Router, a global store, or a public maintainer
dashboard without an explicit architecture amendment. Rationale: each runtime
has a distinct trust boundary and product responsibility that must remain
visible.

### II. Runtime-Appropriate Modularization
Each runtime MUST use the modularization style appropriate to its work:

- React code MUST be organized primarily by feature or user workflow.
- Django code MUST be organized primarily by domain, with pragmatic internal
  layering only where responsibilities genuinely differ.
- Supabase entry points MUST remain thin, while shared server code is organized
  around cohesive workflow stages and policies.
- The repository MUST NOT impose one identical folder or layering pattern on
  every runtime.

Composition roots such as `src/main.tsx`, `src/App.tsx`, Django views, and Edge
Function `index.ts` files SHOULD compose or delegate rather than accumulate
feature rules, persistence details, or parsing logic. Feature-only behavior,
state, tests, types, and styles SHOULD remain close to their owner. Canonical
narrative and approved source content SHOULD remain in `src/data`, while
global contexts MUST be limited to genuinely cross-cutting concerns.

Shared modules MUST have multiple real consumers or own a stable contract.
They MUST NOT become dumping grounds for unclear ownership. Interfaces,
adapters, and additional layers SHOULD be introduced only at real points of
variation or when they hide meaningful complexity. Compatibility exports MAY
support a migration, but MUST have a removal condition. Refactors MUST favor
locality and cohesive modules over helper-per-file fragmentation. Rationale:
clear ownership and compact interfaces keep this ongoing codebase navigable.

### III. Accessible, Resilient Learning Experience
Every user-facing feature MUST preserve keyboard access, visible focus,
reduced-motion behavior, and usable fallback, empty, loading, and error states.
The core learning flow MUST remain usable when chat, premium visuals, external
media, or showcase scenes fail. Responsive behavior and accessibility MUST be
preserved when components or styles move between owners.

Chat and grounding states such as off-topic refusal, weak support, and
cooldown MUST be modeled as typed successful responses, not transport
failures. Rationale: public learning content must remain understandable and
usable under degraded conditions.

### IV. Typed Boundary Contracts and Deliberate States
Untrusted JSON, database rows, environment values, and external responses MUST
be validated and converted into explicit application types at runtime
boundaries. TypeScript `unknown` and Python `Any` MAY appear at an external
boundary, but MUST be narrowed before data spreads through feature or domain
logic. Request and response envelopes MUST remain typed and explicit.

Absence, failure, and degraded behavior MUST be modeled deliberately. `null`
and `None` MAY be used when absence is an intentional, documented contract;
ambiguous absence and unclassified failures MUST NOT replace explicit states
or typed errors. Browser code MUST NOT import server-only behavior or secrets.
Cross-runtime contracts MUST have an intentional neutral owner rather than
being shared through accidental dependency direction. Rationale: runtime
validation and explicit states prevent external uncertainty from leaking
through the system.

### V. Cohesive, Intention-Revealing Code
Names MUST express product concepts, observable behavior, or precise technical
responsibilities. Established domain language such as source stewardship,
validation run, grounding, weak support, refusal, cooldown, and audit event
SHOULD be used consistently across runtimes. Vague terms such as `manager`,
`helper`, `processor`, or `data` SHOULD be replaced when a precise domain term
exists.

Functions, classes, and modules SHOULD have one understandable reason to
change and SHOULD keep related abstraction levels coherent. High-level policy
SHOULD NOT be interleaved with low-level parsing, formatting, transport, or
persistence when a meaningful separation improves ownership, readability, or
testability. Extraction MUST be evidence-driven; arbitrary limits on file
length, function length, or argument count are not governance rules. Longer
cohesive code MAY remain together when splitting it would add indirection.

Comments SHOULD explain constraints, ordering, security decisions,
accessibility behavior, or external limitations rather than narrate clear
code. Public workflows and rendering entry points SHOULD appear before their
private implementation details when practical. Rationale: clean code here
means clear intent and cohesive ownership, not mechanical conformity.

### VI. Test-Driven Verification and Delivery Safety
Every behavior-changing feature, bug fix, refactor, API endpoint, and
interactive component MUST follow red-green-refactor:

1. Define the user journey or observable behavior.
2. Add the smallest test that expresses the expected behavior, including
   relevant edge, error, and boundary cases.
3. Run the selected test and confirm it fails for the intended reason.
4. Implement the minimum code needed to make the test pass.
5. Refactor only while the selected test suite remains green.

Documentation-only, comment-only, generated-artifact, and non-behavioral
configuration changes MAY omit a failing test. Any other exception MUST be
documented in the plan or task with the reason tests cannot practically lead
the change and the alternative verification evidence required. Existing
behavior-preserving refactors MUST add a characterization test before changing
structure when adequate coverage does not already exist.

Verification MUST use the fastest layer that proves observable behavior with
confidence. Use `pnpm test:unit` for frontend rendering, state, parsers, and
adapters; Vitest + React Testing Library + MSW for mocked request integration;
`pnpm test:functions` for non-chat Supabase ingestion and storage-support
workflows; `pnpm backend:test` plus relevant backend checks for Django changes;
`pnpm test:e2e` for critical browser journeys; and `pnpm test:chat:live` for
minimal real Django chat wiring.

Tests MUST target stable behavior and public interfaces rather than private
helper structure. New or materially changed executable code MUST achieve at
least 80% line, branch, function, and statement coverage where the selected
tool reports those metrics. When a tool reports fewer dimensions, every
reported dimension MUST meet 80%. Untouched legacy code does not block a
feature, but plans MUST define the changed scope, the coverage command, and any
measured gap before implementation. Test infrastructure needed to measure the
gate MUST be added before feature implementation. Skipped or disabled tests
MUST NOT be used to satisfy acceptance or coverage gates unless the reason and
removal condition are documented.

All work MUST use `pnpm` for project commands and select checks based on the
changed surfaces. Default frontend checks are `pnpm lint`, `pnpm typecheck`,
and `pnpm build`; default backend checks are `pnpm backend:lint`,
`pnpm backend:typecheck`, `pnpm backend:security`, `pnpm backend:test`, and
`pnpm backend:check`. Formatting, architecture analysis, branch, PR, and
handoff requirements MUST follow `AGENTS.md`. Rationale: confidence comes from
focused evidence and disciplined delivery, not indiscriminate broad suites.

## Technology and Repository Constraints

- The primary frontend stack is Vite, React, TypeScript, Tailwind/shadcn-style
  primitives, and feature-owned React components.
- Reusable shadcn/ui primitives MUST remain in `src/components/ui`; feature
  composites MUST remain in feature-owned folders under `src/components`.
- Source content belongs in `src/data`, shared helpers in `src/lib`, hooks in
  `src/hooks`, contexts in `src/contexts`, and shared types in `src/types`.
- Supabase migrations MUST remain in `supabase/migrations`; Edge Functions
  MUST remain under `supabase/functions/<function-name>/index.ts`; shared
  server-only helpers MUST remain under `supabase/functions/_shared`.
- Static assets belong under `public/`; heavy media and 3D assets MUST be
  isolated so they can be lazy-loaded.
- Global CSS MUST be limited to tokens, resets, utilities, application-shell
  rules, and genuinely shared visual patterns. Feature-specific visual systems
  SHOULD be owned near their feature modules.
- No particular feature styling mechanism is mandatory unless the project
  explicitly adopts it through an amendment or documented architecture
  decision.
- Checked-in tests MUST use the locations and intent tags defined in
  `AGENTS.md`.

## Development Workflow and Quality Gates

- Specs MUST describe user value, acceptance scenarios, accessibility,
  degraded states, scope boundaries, affected runtime contracts, and
  independently testable user journeys before planning.
- Plans MUST identify touched runtime and feature owners, privileged
  boundaries, external-data normalization, styling ownership, and any shared
  module or adapter being introduced. Plans MUST also define the test-first
  sequence, selected test layers, changed coverage scope, coverage command,
  and critical journeys requiring E2E or live-canary proof.
- New shared abstractions MUST state their real consumers or point of
  variation. Migration wrappers MUST state their removal condition.
- Task lists MUST be grouped by independently testable user stories and include
  exact paths, red test tasks before implementation tasks, green verification,
  refactor checkpoints, coverage verification, and required graph or impact
  analysis.
- Refactors MUST preserve observable behavior unless the specification
  explicitly changes it. Behavior-preserving refactors SHOULD avoid
  unnecessary test rewrites.
- Playwright coverage MUST remain focused on browser behavior and critical
  journeys; broad rule matrices SHOULD move to faster test layers.
- Runtime claims, pushed branches, and PR handoffs MUST include the evidence
  required by `AGENTS.md`.

## Governance

This constitution supersedes generic Spec Kit template defaults for this
repository. `AGENTS.md` remains the operational agent guidance file. When the
two drift, contributors MUST reconcile them before using Spec Kit for new
feature planning.

The constitution contains durable project law: architecture boundaries,
ownership rules, contract discipline, quality expectations, and verification
policy. Current hotspots, named-file refactors, migration sequences, temporary
wrappers, and completion tasks MUST remain in specs, plans, task lists, issues,
or architecture findings rather than becoming permanent constitutional rules.
A rule belongs here only when it should still govern a substantially rewritten
implementation in the future.

Amendments MUST update this file, include a Sync Impact Report, and review all
dependent Spec Kit templates for alignment. Changes that redefine or remove a
principle require a MAJOR version bump. Changes that add a principle, add a
mandatory section, or materially expand governance require a MINOR version
bump. Clarifications and non-semantic refinements require a PATCH version
bump.

Every generated plan MUST include a Constitution Check, and every generated
task list MUST carry applicable governance into actionable work. Reviewers
MUST treat unresolved violations as blocking unless the plan documents the
violation, why it is necessary, and why a simpler compliant alternative is
insufficient.

**Version**: 2.0.0 | **Ratified**: 2026-06-05 | **Last Amended**: 2026-06-06
