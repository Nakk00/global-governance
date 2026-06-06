$ErrorActionPreference = "Stop"

function Require-Command($Name, $Hint) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "$Name is required. $Hint"
  }
}

function Get-DescendantProcessIds([int]$ParentId) {
  $children = @(Get-CimInstance Win32_Process | Where-Object { $_.ParentProcessId -eq $ParentId })
  $ids = @()

  foreach ($child in $children) {
    $ids += $child.ProcessId
    $ids += Get-DescendantProcessIds -ParentId $child.ProcessId
  }

  return $ids
}

function Stop-ProcessTree($Process) {
  if (-not $Process) {
    return
  }

  foreach ($childId in (Get-DescendantProcessIds -ParentId $Process.Id | Select-Object -Unique)) {
    try {
      Stop-Process -Id $childId -Force -ErrorAction Stop
    }
    catch {
    }
  }

  try {
    if (-not $Process.HasExited) {
      Stop-Process -Id $Process.Id -Force -ErrorAction Stop
    }
  }
  catch {
  }
}

Require-Command "pnpm" "Install pnpm before running the local stack."

if (-not (Test-Path "backend/.env")) {
  throw "Missing backend/.env. Create it from backend/.env.example before starting Django."
}

$backendPythonScript = Join-Path $PSScriptRoot "backend-python.ps1"
if (-not (Test-Path $backendPythonScript)) {
  throw "Missing scripts/dev/backend-python.ps1. Restore the backend runtime launcher before starting the stack."
}

& powershell -NoProfile -ExecutionPolicy Bypass -File $backendPythonScript backend/manage.py check --settings=config.settings.development
if ($LASTEXITCODE -ne 0) {
  throw "Django backend preflight failed."
}

pnpm supabase:start
if ($LASTEXITCODE -ne 0) {
  throw "Supabase failed to start."
}

pnpm redis:start
if ($LASTEXITCODE -ne 0) {
  throw "Redis failed to start."
}

Write-Host "Applying Django migrations for development database..."
& powershell -NoProfile -ExecutionPolicy Bypass -File $backendPythonScript backend/manage.py migrate --settings=config.settings.development
if ($LASTEXITCODE -ne 0) {
  throw "Django migrations failed."
}

$processes = @()
$processes += Start-Process -FilePath "powershell" -ArgumentList "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $backendPythonScript, "backend/manage.py", "runserver", "127.0.0.1:8000", "--settings=config.settings.development" -NoNewWindow -PassThru
$processes += Start-Process -FilePath "powershell" -ArgumentList "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", "pnpm dev -- --host 127.0.0.1" -WorkingDirectory (Get-Location).Path -NoNewWindow -PassThru

Write-Host "Started Supabase data services, Redis at redis://127.0.0.1:6379/0, Django at http://127.0.0.1:8000, and Vite."
Write-Host "Press Ctrl+C to stop this coordinator, then stop child processes if needed."

try {
  while ($true) {
    foreach ($process in $processes) {
      if ($process.HasExited) {
        if ($process.ExitCode -ne 0) {
          throw "A stack process exited with code $($process.ExitCode)."
        }

        return
      }
    }

    Start-Sleep -Milliseconds 500
    foreach ($process in $processes) {
      $null = $process.Refresh()
    }
  }
}
finally {
  foreach ($process in $processes) {
    Stop-ProcessTree -Process $process
  }
}
