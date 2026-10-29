'use server'

import type {
  TimeWindow,
  TvShow,
  Movie,
  MovieDetails,
  TvShowDetails,
  SearchItem,
} from '@/types'

interface FindByIdResponse {
  movie_results?: SearchItem[]
  tv_results?: SearchItem[]
}

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

/**
 * Centrale helper voor alle TMDB v3 API-aanroepen volgens de officiële TMDB specificatie
 */
async function fetchFromTmdb<T>(
  endpoint: string,
  params: Record<string, string> = {},
  revalidate = 3600
): Promise<T> {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    throw new Error('TMDB_API_KEY is niet ingesteld in de environment variabelen.')
  }

  const searchParams = new URLSearchParams({
    api_key: apiKey,
    language: 'nl-NL',
    ...params,
  })

  const res = await fetch(`${TMDB_BASE_URL}${endpoint}?${searchParams.toString()}`, {
    headers: {
      accept: 'application/json',
    },
    next: { revalidate },
  })

  if (!res.ok) {
    throw new Error(`TMDB API fout (${endpoint}): ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function getTrendingTv(range: TimeWindow = 'day'): Promise<TvShow[]> {
  const data = await fetchFromTmdb<{ results?: TvShow[] }>(`/trending/tv/${range}`)
  return data.results || []
}

export async function getTrendingMovies(range: TimeWindow = 'day'): Promise<Movie[]> {
  const data = await fetchFromTmdb<{ results?: Movie[] }>(`/trending/movie/${range}`)
  return data.results || []
}

export async function getMovieDetails(id: string | number): Promise<MovieDetails> {
  return fetchFromTmdb<MovieDetails>(`/movie/${id}`)
}

export async function getTvDetails(id: string | number): Promise<TvShowDetails> {
  return fetchFromTmdb<TvShowDetails>(`/tv/${id}`)
}

export async function searchMulti(query: string): Promise<SearchItem[]> {
  const trimmed = query?.trim()
  if (!trimmed) {
    return []
  }

  if (/^tt\d{7,10}$/i.test(trimmed)) {
    const data = await fetchFromTmdb<FindByIdResponse>(
      `/find/${trimmed}`,
      { external_source: 'imdb_id' },
      3600
    )

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
    60
  )

  return (data.results || []).filter(
    (item) => item.media_type === 'movie' || item.media_type === 'tv'
  )
}
