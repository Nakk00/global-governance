export type SupabaseSession = {
  accessToken: string
  refreshToken?: string
  expiresAt?: number
  user?: {
    id: string
    email?: string
  }
}

type SupabasePasswordResponse = {
  access_token: string
  refresh_token?: string
  expires_in?: number
  user?: {
    id: string
    email?: string
  }
}

const sessionStorageKey = "global-governance-maintainer-session"

export function getSupabaseSession(): SupabaseSession | null {
  const stored = window.localStorage.getItem(sessionStorageKey)
  if (!stored) {
    return null
  }

  try {
    const session = JSON.parse(stored) as SupabaseSession
    if (!session.accessToken) {
      clearSupabaseSession()
      return null
    }
    return session
  } catch {
    clearSupabaseSession()
    return null
  }
}

export function isSupabaseSessionExpired(session: SupabaseSession): boolean {
  return Boolean(
    session.expiresAt && session.expiresAt <= Math.floor(Date.now() / 1000)
  )
}

export async function signInWithPassword(params: {
  email: string
  password: string
}): Promise<SupabaseSession> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!supabaseUrl || !anonKey) {
    throw new Error("supabase_auth_unconfigured")
  }

  const response = await fetch(
    `${supabaseUrl.replace(/\/$/, "")}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        apikey: anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }
  )

  if (!response.ok) {
    throw new Error("supabase_auth_failed")
  }

  const payload = (await response.json()) as SupabasePasswordResponse
  const session: SupabaseSession = {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    expiresAt: payload.expires_in
      ? Math.floor(Date.now() / 1000) + payload.expires_in
      : undefined,
    user: payload.user,
  }
  window.localStorage.setItem(sessionStorageKey, JSON.stringify(session))
  return session
}

export function clearSupabaseSession() {
  window.localStorage.removeItem(sessionStorageKey)
}
