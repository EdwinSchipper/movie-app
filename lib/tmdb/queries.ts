'use server'

import { cache } from 'react'
import type {
  TimeWindow,
  TvShow,
  Movie,
  MovieDetails,
  TvShowDetails,
  SearchItem,
  SearchMovieItem,
  SearchTvItem,
} from '@/types'
import { fetchFromTmdb } from './client'

interface FindByIdResponse {
  movie_results?: SearchMovieItem[]
  tv_results?: SearchTvItem[]
}

export const getTrendingTv = cache(async (range: TimeWindow = 'day'): Promise<TvShow[]> => {
  const data = await fetchFromTmdb<{ results?: TvShow[] }>(`/trending/tv/${range}`)
  return data.results || []
})

export const getTrendingMovies = cache(async (range: TimeWindow = 'day'): Promise<Movie[]> => {
  const data = await fetchFromTmdb<{ results?: Movie[] }>(`/trending/movie/${range}`)
  return data.results || []
})

export const getMovieDetails = cache(async (
  id: string | number
): Promise<MovieDetails | null> => {
  const normalizedId = String(id).trim()
  if (!normalizedId) {
    return null
  }

  return fetchFromTmdb<MovieDetails>(
    `/movie/${encodeURIComponent(normalizedId)}`,
    {},
    { allowNotFound: true }
  )
})

export const getTvDetails = cache(async (
  id: string | number
): Promise<TvShowDetails | null> => {
  const normalizedId = String(id).trim()
  if (!normalizedId) {
    return null
  }

  return fetchFromTmdb<TvShowDetails>(
    `/tv/${encodeURIComponent(normalizedId)}`,
    {},
    { allowNotFound: true }
  )
})

export async function searchMulti(query: string): Promise<SearchItem[]> {
  const trimmed = query?.trim()
  if (!trimmed) {
    return []
  }

  if (/^tt\d{7,10}$/i.test(trimmed)) {
    const data = await fetchFromTmdb<FindByIdResponse>(
      `/find/${encodeURIComponent(trimmed)}`,
      { external_source: 'imdb_id' },
      { revalidate: 3600, allowNotFound: true }
    )

    if (!data) {
      return []
    }

    return [
      ...(data.movie_results || []),
      ...(data.tv_results || []),
    ]
  }

  const data = await fetchFromTmdb<{ results?: SearchItem[] }>(
    '/search/multi',
    {
      query: trimmed,
      include_adult: 'false',
      page: '1',
    },
    { revalidate: 60 }
  )

  return (data.results || []).filter(
    (item): item is SearchItem => item.media_type === 'movie' || item.media_type === 'tv'
  )
}
