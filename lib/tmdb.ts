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
