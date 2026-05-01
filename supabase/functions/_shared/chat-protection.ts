type ProtectionRecord = {
  submissions: number[]
  consecutiveAbuseCount: number
  cooldownUntil: number
}

export interface ProtectionStore {
  get(
    sessionId: string
  ): Promise<ProtectionRecord | undefined> | ProtectionRecord | undefined
  set(sessionId: string, record: ProtectionRecord): Promise<void> | void
  delete?(sessionId: string): Promise<void> | void
  clear?(): Promise<void> | void
}

export type ChatProtectionDecision =
  | {
      state: "allowed"
    }
  | {
      state: "refused"
      consecutiveAbuseCount: number
    }
  | {
      state: "cooldown"
      code: "rate_limited" | "abuse_cooldown"
      retryAfterSeconds: number
    }

const windowMs = 60_000
const maxSubmissionsPerWindow = 10
const abuseThreshold = 3
const abuseCooldownMs = 60_000
const maxTrackedSessions = 500
const followUpQuestionPattern =
  /\b(this|that|these|those|it|they|them|there|here|more|again|why|how|what about|which one|explain)\b/i
const courseBoundaryKeywords = [
  "global governance",
  "governance",
  "world government",
  "united nations",
  "un system",
  "security council",
  "institution",
  "institutions",
  "charter",
  "sovereignty",
  "west philippine sea",
  "wps",
  "arbitral",
  "ruling",
  "maritime",
]
const sourceInspectionPattern =
  /\b(approved|course|chapter|reference|references|citation|citations)\b.*\b(source|sources|material|materials|document|documents)\b|\b(source|sources|material|materials|document|documents)\b.*\b(approved|course|chapter|reference|references|citation|citations)\b/i
const sectionBoundaryKeywords: Record<string, string[]> = {
  "journey-start": ["global governance", "world government", "course"],
  "hero-narrative-frame": [
    "global governance",
    "institution",
    "institutions",
    "world government",
  ],
  "global-governance-overview": [
    "global governance",
    "institution",
    "institutions",
    "coordination",
  ],
  "un-command-center": [
    "un",
    "united nations",
    "security council",
    "general assembly",
    "international court of justice",
    "ecosoc",
    "secretariat",
    "trusteeship council",
  ],
  "governance-limits": [
    "security council",
    "enforcement",
    "veto",
    "sovereignty",
    "compliance",
  ],
  "west-philippine-sea-dossier": [
    "west philippine sea",
    "wps",
    "arbitral",
    "ruling",
    "maritime",
    "south china sea",
  ],
  "conclusion-references": ["source", "sources", "reference", "references"],
}

let cachedProtectionStore: ProtectionStore | undefined
let cachedRedisStoreUrl: string | undefined

export function createMemoryProtectionStore(): ProtectionStore {
  const records = new Map<string, ProtectionRecord>()

  return {
    get(sessionId) {
      return records.get(sessionId)
    },
    set(sessionId, record) {
      records.set(sessionId, record)
      enforceTrackedSessionLimit(records)
    },
    delete(sessionId) {
      records.delete(sessionId)
    },
    clear() {
      records.clear()
    },
  }
}

export function resetProtectionStore(
  store: ProtectionStore
): Promise<void> | void {
  return store.clear?.()
}

export async function resolveAnonymousSessionId(
  request: Request
): Promise<string> {
  const explicitSession = request.headers.get("x-anonymous-session-id")?.trim()

  if (explicitSession) {
    return await hashSessionKey(`local:${explicitSession.slice(0, 120)}`)
  }

  const forwardedFor = request.headers.get("x-forwarded-for")?.trim()
  const userAgent = request.headers.get("user-agent")?.trim()
  const firstForwardedAddress = forwardedFor?.split(",")[0]?.trim()
  const networkFingerprint =
    firstForwardedAddress && firstForwardedAddress.length > 0
      ? `${firstForwardedAddress}:${userAgent ?? "unknown"}`
      : undefined

  if (networkFingerprint) {
    return await hashSessionKey(networkFingerprint)
  }

  return await hashSessionKey(`local:${userAgent ?? "unknown"}`)
}

export async function evaluateChatProtection({
  sessionId,
  question,
  currentSectionId,
  now = Date.now(),
  store,
}: {
  sessionId: string
  question: string
  currentSectionId?: string
  now?: number
  store?: ProtectionStore
}): Promise<ChatProtectionDecision> {
  const resolvedStore = store ?? (await getProtectionStore())
  const record = await getProtectionRecord(resolvedStore, sessionId)

  record.submissions = record.submissions.filter(
    (submissionTime) => now - submissionTime < windowMs
  )

  if (record.cooldownUntil > now) {
    return {
      state: "cooldown",
      code: "abuse_cooldown",
      retryAfterSeconds: secondsUntil(record.cooldownUntil, now),
    }
  }

  if (record.submissions.length >= maxSubmissionsPerWindow) {
    const oldestSubmission = record.submissions[0]

    return {
      state: "cooldown",
      code: "rate_limited",
      retryAfterSeconds: secondsUntil(oldestSubmission + windowMs, now),
    }
  }

  if (!isCourseBoundaryQuestion(question, currentSectionId)) {
    record.submissions.push(now)
    record.consecutiveAbuseCount += 1
    await saveProtectionRecord(resolvedStore, sessionId, record)

    if (record.consecutiveAbuseCount >= abuseThreshold) {
      record.cooldownUntil = now + abuseCooldownMs
      await saveProtectionRecord(resolvedStore, sessionId, record)

      return {
        state: "cooldown",
        code: "abuse_cooldown",
        retryAfterSeconds: secondsUntil(record.cooldownUntil, now),
      }
    }

    return {
      state: "refused",
      consecutiveAbuseCount: record.consecutiveAbuseCount,
    }
  }

  record.submissions.push(now)
  record.consecutiveAbuseCount = 0
  await saveProtectionRecord(resolvedStore, sessionId, record)

  return {
    state: "allowed",
  }
}

async function getProtectionRecord(
  store: ProtectionStore,
  sessionId: string
): Promise<ProtectionRecord> {
  const existing = await store.get(sessionId)

  if (existing) {
    return existing
  }

  const nextRecord = {
    submissions: [],
    consecutiveAbuseCount: 0,
    cooldownUntil: 0,
  }

  await store.set(sessionId, nextRecord)

  return nextRecord
}

async function saveProtectionRecord(
  store: ProtectionStore,
  sessionId: string,
  record: ProtectionRecord
): Promise<void> {
  if (
    record.submissions.length === 0 &&
    record.consecutiveAbuseCount === 0 &&
    record.cooldownUntil === 0
  ) {
    await store.delete?.(sessionId)
    return
  }

  await store.set(sessionId, record)
}

function secondsUntil(targetTime: number, now: number): number {
  return Math.max(1, Math.ceil((targetTime - now) / 1_000))
}

function isCourseBoundaryQuestion(
  question: string,
  currentSectionId?: string
): boolean {
  const normalizedQuestion = question.toLowerCase()
  const sectionKeywords = currentSectionId
    ? (sectionBoundaryKeywords[currentSectionId] ?? [])
    : []
  const boundaryKeywords = [...courseBoundaryKeywords, ...sectionKeywords]

  if (
    boundaryKeywords.some((keyword) =>
      matchesKeywordBoundary(normalizedQuestion, keyword)
    )
  ) {
    return true
  }

  if (sourceInspectionPattern.test(question)) {
    return true
  }

  return Boolean(
    currentSectionId &&
    question.trim().split(/\s+/).length <= 8 &&
    followUpQuestionPattern.test(question)
  )
}

function matchesKeywordBoundary(question: string, keyword: string): boolean {
  return new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "i").test(question)
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

async function getProtectionStore(): Promise<ProtectionStore> {
  const configuredRedisUrl = getRedisUrl()

  if (cachedProtectionStore && cachedRedisStoreUrl === configuredRedisUrl) {
    return cachedProtectionStore
  }

  cachedProtectionStore = configuredRedisUrl
    ? await createRedisProtectionStore(configuredRedisUrl)
    : createMemoryProtectionStore()
  cachedRedisStoreUrl = configuredRedisUrl

  return cachedProtectionStore
}

function getRedisUrl(): string | undefined {
  const maybeDeno = globalThis as {
    Deno?: { env?: { get(name: string): string | undefined } }
  }
  const redisUrl = maybeDeno.Deno?.env?.get("REDIS_URL")?.trim()

  return redisUrl && redisUrl.length > 0 ? redisUrl : undefined
}

async function createRedisProtectionStore(
  redisUrl: string
): Promise<ProtectionStore> {
  const { createClient } = await import("npm:redis")
  const client = createClient({ url: redisUrl })

  client.on("error", () => {
    // Allow the caller to fall back via thrown operations instead of crashing startup.
  })

  if (!client.isOpen) {
    await client.connect()
  }

  return {
    async get(sessionId) {
      const value = await client.get(toRedisKey(sessionId))
      return value ? parseProtectionRecord(value) : undefined
    },
    async set(sessionId, record) {
      await client.set(toRedisKey(sessionId), JSON.stringify(record), {
        PX: protectionRecordTtlMs(record),
      })
    },
    async delete(sessionId) {
      await client.del(toRedisKey(sessionId))
    },
  }
}

function parseProtectionRecord(value: string): ProtectionRecord {
  const parsed = JSON.parse(value) as Partial<ProtectionRecord>

  return {
    submissions: Array.isArray(parsed.submissions)
      ? parsed.submissions.filter((entry) => typeof entry === "number")
      : [],
    consecutiveAbuseCount:
      typeof parsed.consecutiveAbuseCount === "number"
        ? parsed.consecutiveAbuseCount
        : 0,
    cooldownUntil:
      typeof parsed.cooldownUntil === "number" ? parsed.cooldownUntil : 0,
  }
}

function protectionRecordTtlMs(record: ProtectionRecord): number {
  const now = Date.now()
  const cooldownTtl = Math.max(0, record.cooldownUntil - now)

  return Math.max(windowMs, cooldownTtl, 1_000)
}

function toRedisKey(sessionId: string): string {
  return `chat-protection:${sessionId}`
}

function enforceTrackedSessionLimit(
  records: Map<string, ProtectionRecord>
): void {
  if (records.size <= maxTrackedSessions) {
    return
  }

  const sessionsByFreshness = [...records.entries()].sort((left, right) => {
    const leftFreshness = Math.max(
      left[1].cooldownUntil,
      left[1].submissions[left[1].submissions.length - 1] ?? 0
    )
    const rightFreshness = Math.max(
      right[1].cooldownUntil,
      right[1].submissions[right[1].submissions.length - 1] ?? 0
    )

    return leftFreshness - rightFreshness
  })

  for (const [sessionId] of sessionsByFreshness.slice(
    0,
    records.size - maxTrackedSessions
  )) {
    records.delete(sessionId)
  }
}

async function hashSessionKey(value: string): Promise<string> {
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value)
  )

  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}
