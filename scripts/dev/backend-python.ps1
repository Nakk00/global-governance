$ErrorActionPreference = "Stop"

$python = Join-Path $PSScriptRoot "..\..\backend\.venv\Scripts\python.exe"
$python = [System.IO.Path]::GetFullPath($python)

if (-not (Test-Path $python)) {
  throw "Missing backend/.venv/Scripts/python.exe. Create backend/.venv and install backend/requirements.txt before running backend commands."
}

& $python @args

if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}
