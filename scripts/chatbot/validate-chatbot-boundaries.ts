import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, "../..")

type BoundaryCheck = {
  id: string
  description: string
  run: () => string[]
}

const browserForbiddenPatterns = [
  /VITE_NVIDIA_/,
  /VITE_REDIS_/,
  /VITE_SUPABASE_SERVICE_ROLE/,
  /SUPABASE_SERVICE_ROLE_KEY/,
  /NVIDIA_API_KEY/,
  /nvidia\/llama-/i,
  /nemotron/i,
  /nemoguard/i,
]

const supabaseForbiddenPatterns = [
  /NVIDIA_API_KEY/,
  /NVIDIA_GENERATION_MODEL/,
  /NVIDIA_EMBEDDING_MODEL/,
  /NVIDIA_RERANK_MODEL/,
  /NVIDIA_TOPIC_GUARD_MODEL/,
  /NVIDIA_SAFETY_GUARD_MODEL/,
  /nvidia\/llama-/i,
  /nemotron/i,
  /nemoguard/i,
  /chat-grounding/,
  /chat-protection/,
]

function readText(relativePath: string) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8")
}

function exists(relativePath: string) {
  return fs.existsSync(path.join(repoRoot, relativePath))
}

function walkFiles(relativeDirectory: string, extensions: string[]) {
  const directory = path.join(repoRoot, relativeDirectory)
  if (!fs.existsSync(directory)) {
    return []
  }

  const files: string[] = []
  const stack = [directory]

  while (stack.length > 0) {
    const current = stack.pop()
    if (!current) {
      continue
    }

    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolutePath = path.join(current, entry.name)
      if (entry.isDirectory()) {
        stack.push(absolutePath)
        continue
      }

      if (extensions.includes(path.extname(entry.name))) {
        files.push(path.relative(repoRoot, absolutePath))
      }
    }
  }

  return files.sort()
}

function findForbiddenPatterns(
  relativeDirectory: string,
  extensions: string[],
  patterns: RegExp[]
) {
  const violations: string[] = []

  for (const file of walkFiles(relativeDirectory, extensions)) {
    const text = readText(file)
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        violations.push(`${file} matched ${pattern}`)
      }
    }
  }

  return violations
}

function findForbiddenPatternsInFiles(
  relativePaths: string[],
  patterns: RegExp[]
) {
  const violations: string[] = []

  for (const file of relativePaths) {
    const text = readText(file)
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        violations.push(`${file} matched ${pattern}`)
      }
    }
  }

  return violations
}

function requireText(relativePath: string, snippets: string[]) {
  const text = readText(relativePath)

  return snippets
    .filter((snippet) => !text.includes(snippet))
    .map((snippet) => `${relativePath} is missing ${snippet}`)
}

function requireAbsentPaths(relativePaths: string[]) {
  return relativePaths
    .filter(exists)
    .map((relativePath) => `${relativePath} should be retired from public chat`)
}

function requireSupabaseConfigWithoutPublicChat() {
  const text = readText("supabase/config.toml")
  const forbiddenConfigTables = [
    /\[functions\.chat\]/,
    /\[functions\.chat-retrieve\]/,
  ]

  return forbiddenConfigTables
    .filter((pattern) => pattern.test(text))
    .map((pattern) => `supabase/config.toml matched ${pattern}`)
}

const checks: BoundaryCheck[] = [
  {
    id: "django-public-chat-route",
    description: "Django owns the public /api/chat route.",
    run: () => [
      ...requireText("backend/config/urls.py", [
        'path("api/", include("chatbot.urls"))',
      ]),
      ...requireText("backend/chatbot/urls.py", [
        'path("chat", public_chat, name="public-chat")',
      ]),
    ],
  },
  {
    id: "supabase-public-chat-retired",
    description: "Supabase no longer registers or ships public chat functions.",
    run: () => [
      ...requireSupabaseConfigWithoutPublicChat(),
      ...requireAbsentPaths([
        "supabase/functions/chat/index.ts",
        "supabase/functions/chat-retrieve/index.ts",
        "supabase/functions/_shared/chat-grounding.ts",
        "supabase/functions/_shared/chat-protection.ts",
        "supabase/functions/_shared/approved-source-bundle.ts",
      ]),
    ],
  },
  {
    id: "browser-secret-boundary",
    description:
      "Browser-facing code does not expose server-only model or secret routing.",
    run: () => [
      ...findForbiddenPatterns(
        "src",
        [".ts", ".tsx"],
        browserForbiddenPatterns
      ),
      ...findForbiddenPatternsInFiles(
        [".env.example"],
        [/^VITE_NVIDIA_/m, /^VITE_REDIS_/m, /^VITE_SUPABASE_SERVICE_ROLE/m]
      ),
    ],
  },
  {
    id: "supabase-secret-boundary",
    description:
      "Retained Supabase functions do not own public chat model routing.",
    run: () =>
      findForbiddenPatterns(
        "supabase/functions",
        [".ts"],
        supabaseForbiddenPatterns
      ),
  },
  {
    id: "backend-server-only-settings",
    description:
      "Django declares server-only model, Redis, policy, and request-limit settings.",
    run: () =>
      requireText("backend/.env.example", [
        "REDIS_URL=",
        "PUBLIC_CHAT_REQUEST_BODY_MAX_BYTES=8192",
        "PUBLIC_CHAT_QUESTION_MAX_CHARS=2000",
        "PUBLIC_CHAT_ANSWER_MAX_CHARS=4000",
        "PUBLIC_CHAT_VISIBLE_CITATION_LIMIT=6",
        "PUBLIC_CHAT_POLICY_VERSION=public-chat-v1",
        "PUBLIC_CHAT_SOURCE_INDEX_VERSION=approved-sources-local-v1",
        "NVIDIA_GENERATION_MODEL=nvidia/llama-3.1-nemotron-nano-8b-v1",
        "NVIDIA_EMBEDDING_MODEL=nvidia/llama-nemotron-embed-1b-v2",
        "NVIDIA_RERANK_MODEL=nvidia/llama-nemotron-rerank-1b-v2",
        "NVIDIA_TOPIC_GUARD_MODEL=nvidia/llama-3.1-nemoguard-8b-topic-control",
        "NVIDIA_SAFETY_GUARD_MODEL=nvidia/llama-3.1-nemotron-safety-guard-8b-v3",
      ]),
  },
]

function main() {
  const failures: string[] = []

  for (const check of checks) {
    const checkFailures = check.run()

    if (checkFailures.length === 0) {
      console.log(`PASS ${check.id}: ${check.description}`)
      continue
    }

    failures.push(
      `FAIL ${check.id}: ${check.description}\n${checkFailures
        .map((failure) => `  - ${failure}`)
        .join("\n")}`
    )
  }

  if (failures.length > 0) {
    console.error(failures.join("\n"))
    process.exitCode = 1
    return
  }

  console.log(`Validated ${checks.length} chatbot boundary checks.`)
}

main()
