import type { MediaType } from '@/types'

export function formatDate(
  dateString?: string | null,
  options?: Intl.DateTimeFormatOptions,
  fallback: string = 'Niet beschikbaar'
): string {
  if (!dateString) return fallback
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return fallback
  return new Intl.DateTimeFormat('nl-NL', options).format(date)
}

export function formatReleaseYear(
  dateString?: string | null,
  fallback: string = '—'
): string {
  if (!dateString || typeof dateString !== 'string') return fallback
  const trimmed = dateString.trim()
  if (trimmed.length < 4) return fallback
  const year = trimmed.substring(0, 4)
  return isNaN(Number(year)) ? fallback : year
}

export function formatRating(
  voteAverage?: number | null,
  fallback: string = '—'
): string {
  if (typeof voteAverage !== 'number' || isNaN(voteAverage) || voteAverage <= 0) {
    return fallback
  }
  return voteAverage.toFixed(1)
}

export function formatMediaType(
  mediaType?: MediaType | string | null,
  fallback: string = '—'
): string {
  if (!mediaType) return fallback
  if (mediaType === 'movie') return 'Film'
  if (mediaType === 'tv') return 'Serie'
  return fallback
}

export function formatRuntime(minutes?: number | null): string {
  if (typeof minutes !== 'number' || isNaN(minutes) || minutes <= 0) {
    return ''
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}u ${remainingMinutes}m`
}

export function getUserInitial(email?: string | null, fallback: string = '?'): string {
  if (!email || typeof email !== 'string' || !email.trim()) {
    return fallback
  }
  return email.trim().charAt(0).toUpperCase()
}
