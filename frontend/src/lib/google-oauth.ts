const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://blccdafrhdgyejaogckz.supabase.co'

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsY2NkYWZyaGRneWVqYW9nY2t6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NjIwNzIsImV4cCI6MjA4ODUzODA3Mn0.bbvjRDz3ZyehqfNSrVmvCShH2zxk9-Sc3a5SDaPDq7Q'

const GOOGLE_PKCE_VERIFIER_KEY = 'neuroprep_google_pkce_verifier'

function encodeBase64Url(bytes: Uint8Array) {
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function createCodeVerifier(length = 64) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const random = new Uint8Array(length)
  crypto.getRandomValues(random)
  return Array.from(random, (value) => charset[value % charset.length]).join('')
}

async function createCodeChallenge(verifier: string) {
  const encoder = new TextEncoder()
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(verifier))
  return encodeBase64Url(new Uint8Array(digest))
}

export async function startGoogleOAuth(redirectTo: string) {
  const verifier = createCodeVerifier()
  const challenge = await createCodeChallenge(verifier)
  localStorage.setItem(GOOGLE_PKCE_VERIFIER_KEY, verifier)

  const url = new URL(`${SUPABASE_URL}/auth/v1/authorize`)
  url.searchParams.set('provider', 'google')
  url.searchParams.set('redirect_to', redirectTo)
  url.searchParams.set('code_challenge', challenge)
  url.searchParams.set('code_challenge_method', 'S256')
  url.searchParams.set('access_type', 'offline')
  url.searchParams.set('prompt', 'consent')

  window.location.assign(url.toString())
}

export async function exchangeGoogleCodeForAccessToken(code: string) {
  const verifier = localStorage.getItem(GOOGLE_PKCE_VERIFIER_KEY)
  if (!verifier) {
    throw new Error('Google sign-in session expired. Start Google sign-in again.')
  }

  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=pkce`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      auth_code: code,
      code_verifier: verifier,
    }),
  })

  let payload: unknown = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    const detail =
      payload && typeof payload === 'object' && 'msg' in payload
        ? String((payload as { msg?: unknown }).msg)
        : 'Unable to exchange Google sign-in code.'
    throw new Error(detail)
  }

  const accessToken =
    payload && typeof payload === 'object' && 'access_token' in payload
      ? String((payload as { access_token?: unknown }).access_token || '')
      : ''

  if (!accessToken) {
    throw new Error('Supabase did not return a Google access token.')
  }

  localStorage.removeItem(GOOGLE_PKCE_VERIFIER_KEY)
  return accessToken
}

export function clearGooglePkceState() {
  localStorage.removeItem(GOOGLE_PKCE_VERIFIER_KEY)
}
