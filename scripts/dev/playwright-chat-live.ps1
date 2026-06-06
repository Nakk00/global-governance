param(
  [switch]$All
)

$ErrorActionPreference = "Stop"

$env:VITE_CHAT_API_URL = "http://127.0.0.1:8000/api/chat"

if ($All) {
  pnpm exec playwright test
} else {
  pnpm exec playwright test --grep "@chat-live" --workers 1
}

exit $LASTEXITCODE
