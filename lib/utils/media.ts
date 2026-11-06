import type { MediaActionPayload, MediaType } from '@/types'

export type TmdbImageSize = 'w200' | 'w300' | 'w500' | 'w780' | 'w1280' | 'original'

export function getTmdbImageUrl(
  path?: string | null,
  size: TmdbImageSize = 'w500'
): string {
  if (!path || typeof path !== 'string' || !path.trim()) {
    return ''
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `https://image.tmdb.org/t/p/${size}${cleanPath}`
}

export function getMediaDetailHref(
  mediaType?: MediaType | string | null,
  id?: number | string | null
): string {
  if (id === undefined || id === null || id === '') {
    return '/'
  }
  return mediaType === 'tv' ? `/tv/${id}` : `/movies/${id}`
}

export function validateMediaActionPayload(item: MediaActionPayload): string | null {
  if (!item.tmdb_id || typeof item.tmdb_id !== 'number') {
    return 'Ongeldig of ontbrekend TMDB ID.'
  }

  if (item.media_type !== 'movie' && item.media_type !== 'tv') {
    return 'Ongeldig mediatype. Moet movie of tv zijn.'
  }

  if (!item.title || typeof item.title !== 'string' || item.title.trim() === '') {
    return 'Titel mag niet leeg zijn.'
  }

  return null
}

export function validateMediaTarget(
  target: string | { tmdbId: number; mediaType: MediaType },
  missingIdMessage: string = 'Ontbrekend ID.'
): string | null {
  if (typeof target === 'string') {
    if (!target.trim()) {
      return missingIdMessage
    }
    return null
  }

  if (!target.tmdbId || (target.mediaType !== 'movie' && target.mediaType !== 'tv')) {
    return 'Ongeldig TMDB ID of mediatype.'
  }

  return null
}
