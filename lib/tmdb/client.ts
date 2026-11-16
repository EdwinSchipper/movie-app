import { env } from '@/lib/env'

export interface TmdbRequestOptions {
  revalidate?: number
  allowNotFound?: boolean
}

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_REQUEST_TIMEOUT_MS = 10_000

/**
 * Centrale server-side fetch-helper voor alle TMDB API v3 aanroepen.
 */
export async function fetchFromTmdb<T>(
  endpoint: string,
  params: Record<string, string>,
  options: TmdbRequestOptions & { allowNotFound: true }
): Promise<T | null>
export async function fetchFromTmdb<T>(
  endpoint: string,
  params?: Record<string, string>,
  options?: TmdbRequestOptions
): Promise<T>
export async function fetchFromTmdb<T>(
  endpoint: string,
  params: Record<string, string> = {},
  options: TmdbRequestOptions = {}
): Promise<T | null> {
  const { revalidate = 3600, allowNotFound = false } = options
  const searchParams = new URLSearchParams({
    api_key: env.tmdb.apiKey,
    language: 'nl-NL',
    ...params,
  })

  const res = await fetch(`${TMDB_BASE_URL}${endpoint}?${searchParams.toString()}`, {
    headers: {
      accept: 'application/json',
    },
    next: { revalidate },
    signal: AbortSignal.timeout(TMDB_REQUEST_TIMEOUT_MS),
  })

  if (allowNotFound && res.status === 404) {
    return null
  }

  if (!res.ok) {
    throw new Error(`TMDB API fout (${endpoint}): ${res.status} ${res.statusText}`)
  }

  return res.json()
}
