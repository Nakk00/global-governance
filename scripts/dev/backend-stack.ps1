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

function Read-EnvValue($Path, $Key) {
  if (-not (Test-Path $Path)) {
    return ""
  }

  foreach ($line in Get-Content $Path) {
    $trimmed = $line.Trim()
    if (-not $trimmed -or $trimmed.StartsWith("#") -or -not $trimmed.Contains("=")) {
      continue
    }

    $parts = $trimmed.Split("=", 2)
    if ($parts[0].Trim() -eq $Key) {
      return $parts[1].Trim().Trim("'").Trim('"')
    }
  }

  return ""
}

function Test-LocalServiceUrl($Value) {
  [System.Uri]$uri = $null
  if (-not [System.Uri]::TryCreate($Value, [System.UriKind]::Absolute, [ref]$uri)) {
    return $false
  }

  return $uri.Host -in @("127.0.0.1", "localhost", "::1")
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

$supabaseUrl = Read-EnvValue "backend/.env" "SUPABASE_URL"
$redisUrl = Read-EnvValue "backend/.env" "REDIS_URL"
$usesLocalSupabase = Test-LocalServiceUrl $supabaseUrl
$usesLocalRedis = Test-LocalServiceUrl $redisUrl

if ($usesLocalSupabase) {
  pnpm supabase:start
  if ($LASTEXITCODE -ne 0) {
    throw "Supabase failed to start."
  }
}
else {
  Write-Host "Using configured hosted Supabase; skipping local Supabase start."
}

if ($usesLocalRedis) {
  pnpm redis:start
  if ($LASTEXITCODE -ne 0) {
    throw "Redis failed to start."
  }
}
else {
  Write-Host "Using configured Redis; skipping local Redis start."
}

Write-Host "Applying Django migrations for development database..."
& powershell -NoProfile -ExecutionPolicy Bypass -File $backendPythonScript backend/manage.py migrate --settings=config.settings.development
if ($LASTEXITCODE -ne 0) {
  throw "Django migrations failed."
}

$processes = @()
$processes += Start-Process -FilePath "powershell" -ArgumentList "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $backendPythonScript, "backend/manage.py", "runserver", "127.0.0.1:8000", "--settings=config.settings.development" -NoNewWindow -PassThru
$processes += Start-Process -FilePath "powershell" -ArgumentList "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", "pnpm dev -- --host 127.0.0.1" -WorkingDirectory (Get-Location).Path -NoNewWindow -PassThru

$supabaseLabel = if ($usesLocalSupabase) { "local Supabase data services" } else { "configured hosted Supabase" }
$redisLabel = if ($usesLocalRedis) { "local Redis at redis://127.0.0.1:6379/0" } else { "configured Redis" }
Write-Host "Started $supabaseLabel, $redisLabel, Django at http://127.0.0.1:8000, and Vite."
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
