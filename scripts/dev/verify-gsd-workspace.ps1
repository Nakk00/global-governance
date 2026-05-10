$ErrorActionPreference = "Stop"

$requiredPaths = @(
  ".codex/skills/gsd-execute-phase/SKILL.md",
  ".codex/skills/gsd-plan-phase/SKILL.md",
  ".codex/skills/gsd-ship/SKILL.md",
  ".codex/get-shit-done/workflows/execute-phase.md",
  ".planning/STATE.md",
  ".planning/PROJECT.md",
  ".planning/REQUIREMENTS.md",
  ".planning/codebase/ARCHITECTURE.md"
)

$missing = @()
foreach ($path in $requiredPaths) {
  if (-not (Test-Path -LiteralPath $path)) {
    $missing += $path
  }
}

if ($missing.Count -gt 0) {
  Write-Error ("Missing GSD workspace paths:`n" + ($missing -join "`n"))
  exit 1
}

Write-Host "GSD workspace verified."
