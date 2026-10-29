'use server'

export type TimeWindow = 'day' | 'week'

export interface TvShow {
  id: number
  name: string
  poster_path: string
}

export interface Movie {
  id: number
  title: string
  poster_path: string
}

export interface Genre {
  id: number
  name: string
}

export interface MovieDetails {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  runtime: number | null
  vote_average: number
  tagline: string
  genres: Genre[]
}

export interface TvShowDetails {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  number_of_seasons: number
  number_of_episodes: number
  vote_average: number
  tagline: string
  genres: Genre[]
}

export interface SearchItem {
  id: number
  media_type: 'movie' | 'tv'
  title?: string
  name?: string
  poster_path: string | null
  release_date?: string
  first_air_date?: string
  vote_average?: number
}

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

  // 1. Als de zoekopdracht een geldig IMDb-ID is (bijv. "tt1375666"), gebruik /find/{external_id}
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

  // 2. Anders: reguliere tekst-zoekopdracht via /search/multi
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
