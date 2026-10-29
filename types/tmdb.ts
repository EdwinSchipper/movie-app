import type { MediaType } from './watchlist'

export type TimeWindow = 'day' | 'week'

export interface TvShow {
  id: number
  name: string
  poster_path?: string | null
}

export interface Movie {
  id: number
  title: string
  poster_path?: string | null
}

export interface Genre {
  id: number
  name: string
}

export interface MovieDetails {
  id: number
  title: string
  overview?: string | null
  poster_path?: string | null
  release_date?: string | null
  runtime?: number | null
  vote_average?: number | null
  tagline?: string | null
  genres?: Genre[]
}

export interface TvShowDetails {
  id: number
  name: string
  overview?: string | null
  poster_path?: string | null
  first_air_date?: string | null
  number_of_seasons?: number | null
  number_of_episodes?: number | null
  vote_average?: number | null
  tagline?: string | null
  genres?: Genre[]
}

export interface SearchItem {
  id: number
  media_type: MediaType
  title?: string
  name?: string
  poster_path?: string | null
  release_date?: string | null
  first_air_date?: string | null
  vote_average?: number | null
}

