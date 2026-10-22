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

export async function getTrendingTv(range: TimeWindow = 'day'): Promise<TvShow[]> {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    throw new Error('TMDB_API_KEY is niet ingesteld in .env.local')
  }

  const res = await fetch(
    `https://api.themoviedb.org/3/trending/tv/${range}?api_key=${apiKey}&language=nl-NL`,
    { next: { revalidate: 3600 } }
  )

  if (!res.ok) {
    throw new Error(`Fout bij ophalen trending tv: ${res.statusText}`)
  }

  const data = await res.json()
  return data.results || []
}

export async function getTrendingMovies(range: TimeWindow = 'day'): Promise<Movie[]> {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    throw new Error('TMDB_API_KEY is niet ingesteld in .env.local')
  }

  const res = await fetch(
    `https://api.themoviedb.org/3/trending/movie/${range}?api_key=${apiKey}&language=nl-NL`,
    { next: { revalidate: 3600 } }
  )

  if (!res.ok) {
    throw new Error(`Fout bij ophalen trending movies: ${res.statusText}`)
  }

  const data = await res.json()
  return data.results || []
}

export async function getMovieDetails(id: string | number): Promise<MovieDetails> {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    throw new Error('TMDB_API_KEY is niet ingesteld in .env.local')
  }

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=nl-NL`,
    { next: { revalidate: 3600 } }
  )

  if (!res.ok) {
    throw new Error(`Fout bij ophalen filmdetails: ${res.statusText}`)
  }

  return res.json()
}

export async function getTvDetails(id: string | number): Promise<TvShowDetails> {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    throw new Error('TMDB_API_KEY is niet ingesteld in .env.local')
  }

  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=nl-NL`,
    { next: { revalidate: 3600 } }
  )

  if (!res.ok) {
    throw new Error(`Fout bij ophalen seriedetails: ${res.statusText}`)
  }

  return res.json()
}
