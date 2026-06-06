# Spec Kit Cheat Sheet

This repo is initialized for **Spec Kit + Codex**.

## First Run on This Machine

If `specify` is not recognized in PowerShell, add the local `uv` tool bin folder to your current session:

```powershell
$env:Path = "$env:USERPROFILE\.local\bin;$env:Path"
```

Then verify:

```powershell
specify version
specify --help
specify integration list
```

Repo-local setup lives in:

- `.specify/`
- `.agents/skills/speckit-*`

## Fast CLI Commands

```powershell
specify --help
specify version
specify check
specify integration list
```

If needed, run the binary directly:

```powershell
& "$env:USERPROFILE\.local\bin\specify.exe" --help
```

## Main Workflow

Use these in order for a normal feature workflow:

1. `$speckit-constitution`
2. `$speckit-specify`
3. `$speckit-clarify`
4. `$speckit-checklist`
5. `$speckit-plan`
6. `$speckit-tasks`
7. `$speckit-analyze`
8. `$speckit-implement`

## What Each Skill Does

`$speckit-constitution`

- Sets or updates the project principles in `.specify/memory/constitution.md`.

`$speckit-specify`

- Turns a feature idea into a structured spec.

`$speckit-clarify`

- Finds missing decisions and asks targeted follow-up questions.

`$speckit-checklist`

- Generates a review checklist for the feature.

`$speckit-plan`

- Produces the implementation plan and supporting design artifacts.

`$speckit-tasks`

- Breaks the plan into ordered implementation tasks.

`$speckit-analyze`

- Checks consistency across `spec.md`, `plan.md`, and `tasks.md`.

`$speckit-implement`

- Executes the work described in `tasks.md`.

## Typical Codex Prompts

```text
$speckit-constitution Create principles for a Vite + React + TypeScript app with accessible UI, typed contracts, and strong test coverage.
```

```text
$speckit-specify Add a searchable document explorer with filters, keyboard navigation, and clear empty states.
```

```text
$speckit-clarify
```

```text
$speckit-plan Use Vite, React, TypeScript, and existing project patterns.
```

```text
$speckit-tasks
```

```text
$speckit-analyze
```

```text
$speckit-implement
```

## Expected Output Shape

Spec Kit usually creates or updates feature artifacts like:

```text
specs/001-feature-name/spec.md
specs/001-feature-name/plan.md
specs/001-feature-name/tasks.md
```

It may also add supporting files such as:

- `research.md`
- `data-model.md`
- `quickstart.md`
- `contracts/`

## Recommended Habit for This Repo

- Use Spec Kit for feature definition, planning, and task shaping.
- Keep implementation aligned with this repo's existing `AGENTS.md` rules.
- If `specify` stops working in a new shell, re-add `C:\Users\Nakko\.local\bin` to `PATH` or restart after adding it permanently.

## Good Starter Flow

```powershell
$env:Path = "$env:USERPROFILE\.local\bin;$env:Path"
specify version
specify integration list
```

Then in Codex:

```text
$speckit-specify <your feature idea>
$speckit-clarify
$speckit-plan
$speckit-tasks
$speckit-analyze
```
