# Coding Conventions

**Analysis Date:** 2026-05-06

## Naming Patterns

**Files:**
- React component files use `PascalCase.tsx`, especially in `src/components/layout/`, `src/components/sections/`, and `src/components/modules/`.
- Non-component frontend modules commonly use lowercase or kebab-style names such as `source-aware-chat.ts`, `grounded-answer.ts`, and `approved-source-bundle.ts`.
- Tests use `*.test.ts` or `*.test.tsx`; Edge Function tests live in `supabase/functions/tests/`; backend tests use `test_*.py`.
- Edge Function handlers use `index.ts` inside `supabase/functions/<function-name>/`.

**Functions:**
- Frontend and server helpers use `camelCase`.
- Event handlers in React use `handle*` naming (`handleSubmit`, `handleShellKeyDown`, `handleQuestionKeyDown`).
- Factory/reader helpers often use verb phrases such as `create*`, `get*`, `resolve*`, `parse*`, `read*`, and `fetch*`.

**Variables and Constants:**
- Local variables use `camelCase`.
- Module constants use `SCREAMING_SNAKE_CASE` when they represent stable limits or keys, for example `MAX_EXTERNAL_JSON_BODY_BYTES` and `PROGRAMMATIC_NAVIGATION_HOLD_MS`.
- Django private/internal helpers often use a leading underscore (`_has_unexpected_body`, `_request`, `_source_records`).

**Types:**
- Type aliases and interfaces use `PascalCase`.
- Union-style UI state modeling is common, especially in `SourceAwareChat.tsx`, `MaintainerDashboard.tsx`, and `src/types/chat.ts`.
- Backend DTOs and domain models use `PascalCase` class names such as `AdminProfile`, `SourceDetailDto`, and `ValidationRunDetailDto`.

## Code Style

**Formatting:**
- Prettier config lives in `.prettierrc`.
- Double quotes are the repo-preferred string style for TS/TSX.
- Semicolons are omitted in TS/TSX.
- `printWidth` is 80 and `tabWidth` is 2.
- Tailwind classes are formatted with `prettier-plugin-tailwindcss`.

**Linting:**
- ESLint flat config lives in `eslint.config.js`.
- TypeScript code uses the recommended JS/TS, React Hooks, and Vite React Refresh rule sets.
- Supabase function files declare `Deno` globals explicitly.
- Backend style is enforced separately through Ruff and MyPy from `backend/pyproject.toml`.

## Import Organization

**Order:**
1. framework and third-party packages
2. aliased internal modules from `@/`
3. relative imports for nearby helpers or sibling modules

**Grouping:**
- Blank lines are used between external and internal groups in most frontend files.
- The `@` alias is the dominant internal import path and resolves to `src/`.
- Type imports are sometimes grouped inline and sometimes split; consistency matters more than strict dogma in existing files.

## Error Handling

**Patterns:**
- Expected boundary failures return typed envelopes instead of leaking transport details.
- Frontend chat wraps failures into a user-safe fallback error via `toUserSafeChatError()`.
- Maintainer API helpers throw `MaintainerApiError` with code, status, and field-level detail.
- Django returns stable `error_response(...)` payloads and validates request shape before repository work.
- Edge Functions return explicit 4xx/5xx `Response.json(...)` payloads instead of relying on uncaught exceptions.

**Error Types:**
- Domain-specific errors are named `*Error`, for example `MaintainerApiError`, `AdminAuthError`, and `SourceMutationError`.
- Union states are preferred for expected UI outcomes like loading, success, refusal, cooldown, and outage conditions.

## Logging

**Framework:**
- No dedicated logging library is wired into the checked-in app layers.
- Browser and server code generally favor safe envelopes and tests over verbose runtime logging.

**Patterns:**
- Important operational context is expressed through API codes, structured DTOs, and tests.
- Local orchestration scripts write directly to terminal output (`scripts/dev/backend-stack.ps1`).

## Comments

**When to Comment:**
- Comments are rare and usually explain why a boundary exists or why a side effect is delayed.
- Good examples appear in `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx`, where comments explain auth/bootstrap sequencing rather than obvious control flow.

**JSDoc / TSDoc:**
- Not heavily used in frontend source.
- Readability comes more from descriptive type aliases, unions, and helper names than from docblock-heavy style.

## Function Design

**Patterns:**
- Guard clauses are common, especially in request handlers and React submit handlers.
- Parsing and normalization helpers are extracted into `lib/` or `_shared/` modules.
- Typed state unions are preferred over many loosely related booleans.
- Large UI orchestration files do exist, with `MaintainerDashboard.tsx` as the clearest example of a state-heavy composite.

## Module Design

**Exports:**
- Named exports are the default across most TS/TSX modules.
- Default exports are limited and mainly appear at app-boundary files such as `src/App.tsx`.

**Boundaries:**
- Browser-facing code stays in `src/`.
- Service-role logic, persistence helpers, and protected orchestration stay in `supabase/functions/` or `backend/`.
- Static educational content is kept separate from rendering code under `src/data/`.

---

*Convention analysis: 2026-05-06*
*Update when formatting, naming, or boundary conventions change*
