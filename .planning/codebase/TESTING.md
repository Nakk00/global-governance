# Testing Patterns

**Analysis Date:** 2026-05-06

## Test Framework

**Frontend Runner:**
- Vitest 4 for frontend unit and component coverage.
- Config lives in `vite.config.ts`.
- Environment: `jsdom`

**Supabase Function Runner:**
- Vitest with dedicated config in `supabase/functions/vitest.config.ts`.

**Backend Runner:**
- Pytest 9 with `pytest-django`.
- Config lives in `backend/pyproject.toml`.

**Browser Runner:**
- Playwright 1.59 with config in `playwright.config.ts`.

**Run Commands:**
```bash
pnpm test:unit         # Frontend unit/component tests under src/
pnpm test:functions    # Supabase Edge Function tests
pnpm backend:test      # Django / pytest coverage
pnpm test:e2e          # Fast mocked Playwright smoke lane
pnpm test:chat:live    # Live local chat backend browser canary
pnpm test:e2e:all      # Full Playwright run
```

## Test File Organization

**Location:**
- Frontend unit and component tests are co-located under `src/` as `*.test.ts` or `*.test.tsx`.
- Supabase function tests live in `supabase/functions/tests/`.
- Backend tests live in `backend/tests/`.
- Playwright specs live in `tests/e2e/`.
- Shared browser/test support lives in `tests/playwright/`, `tests/support/`, and `tests/setup/`.

**Naming:**
- Frontend examples: `src/components/chat/SourceAwareChat.test.tsx`, `src/lib/maintainer/api.test.ts`
- Supabase examples: `supabase/functions/tests/chat.test.ts`, `ingestion.test.ts`
- Backend examples: `backend/tests/test_admin_auth.py`, `test_route_guards.py`
- E2E examples: `home-smoke.spec.ts`, `home-layout.spec.ts`, `chat-live.spec.ts`

**Structure:**
```text
src/
  components/chat/SourceAwareChat.tsx
  components/chat/SourceAwareChat.test.tsx
  lib/chat/api-client.ts
  lib/chat/api-client.test.ts
supabase/functions/tests/
  chat.test.ts
  chat-boundary-validation.test.ts
backend/tests/
  test_admin_auth.py
  test_admin_stewardship.py
tests/e2e/
  home-smoke.spec.ts
  chat-live.spec.ts
```

## Test Structure

**Patterns:**
- Vitest suites use `describe`/`it` with explicit arrange-act-assert flow.
- React Testing Library tests assert visible text, roles, and interaction states instead of implementation details.
- Backend pytest modules often use Django `SimpleTestCase` or `Client` plus fake repositories/verifiers to keep contract tests fast.
- Playwright specs focus on user-visible navigation, interaction, and live/mock boundary behavior.

## Mocking

**Frameworks and Tools:**
- `vi.mock(...)` and inline stub injection for frontend unit seams.
- MSW for request/response integration in frontend tests, configured through `tests/support/msw/`.
- Backend tests use fake repository and verifier classes rather than external service calls.
- Playwright uses route mocking selectively in mocked browser lanes and real network in `@chat-live`.

**Patterns:**
- Global Vitest setup in `tests/setup/vitest.setup.ts` starts MSW, resets handlers after each test, and patches browser APIs like `matchMedia` and `scrollIntoView`.
- MSW helpers centralize common chat and maintainer responses in `tests/support/msw/handlers.ts` and `fixtures.ts`.
- Supabase function tests import helpers directly and exercise typed response packaging without a browser.

## Coverage Strategy

**Fastest Valid Layer Wins:**
- Frontend rendering/state logic: `pnpm test:unit`
- Public chat server contracts: `pnpm test:functions`
- Protected Django APIs and auth rules: `pnpm backend:test`
- Browser-only confidence: `pnpm test:e2e`
- Live local chat wiring: `pnpm test:chat:live`

**Playwright Intent Tags:**
- `@smoke` for default fast lane
- `@journey` for slower multi-step mocked flows
- `@layout` for responsive/layout/accessibility sweeps
- `@chat-live` for real local chat backend coverage

## Common Patterns

**Frontend Chat and Envelope Testing:**
- Chat logic is tested at multiple levels:
  - parser/client units in `src/lib/chat/*.test.ts`
  - component behavior in `src/components/chat/*.test.tsx`
  - mocked browser flows in `tests/e2e/home-smoke.spec.ts`
  - live backend canary in `tests/e2e/chat-live.spec.ts`

**Protected API Testing:**
- Django tests assert stable HTTP codes and envelope payloads for auth, route guards, source stewardship, and validation runs.
- Fake repository classes in `backend/tests/test_admin_auth.py` and similar files keep these tests deterministic.

**Snapshot Testing:**
- No snapshot-heavy workflow is evident in the checked-in tests.
- The suite prefers explicit DOM/content assertions and contract-level response checks.

## Residual Notes

- `vite.config.ts` explicitly excludes `tests/e2e/**` and `tests/playwright/**` from plain Vitest runs.
- Browser test support is intentionally separated from non-browser fixtures.
- The test taxonomy mirrors the architecture split: SPA, Supabase functions, Django boundary, and browser journeys each have their own lane.

---

*Testing analysis: 2026-05-06*
*Update when test commands, locations, or lane strategy change*
