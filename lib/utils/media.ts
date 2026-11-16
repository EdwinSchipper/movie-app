import {
  mediaActionPayloadSchema,
  mediaTargetSchema,
  type MediaActionPayload,
  type MediaType,
} from '@/types'

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

export function normalizeMediaActionPayload(
  item: MediaActionPayload
): MediaActionPayload {
  return {
    tmdb_id: item.tmdb_id,
    media_type: item.media_type,
    title: item.title.trim(),
    poster_path: item.poster_path ?? null,
    release_date: item.release_date ?? null,
    vote_average: typeof item.vote_average === 'number' ? item.vote_average : null,
    overview: item.overview ?? null,
  }
}

export function validateMediaActionPayload(item: MediaActionPayload): string | null {
  const parseResult = mediaActionPayloadSchema.safeParse(item)
  if (!parseResult.success) {
    return parseResult.error.issues[0]?.message || 'Ongeldige media-gegevens.'
  }

  return null
}

export function validateMediaTarget(
  target: string | { tmdbId: number; mediaType: MediaType },
  missingIdMessage: string = 'Ontbrekend ID.'
): string | null {
  const parseResult = mediaTargetSchema.safeParse(target)
  if (!parseResult.success) {
    return typeof target === 'string'
      ? missingIdMessage
      : 'Ongeldig TMDB ID of mediatype.'
  }

  return null
}
