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
  backdrop_path?: string | null
  overview?: string | null
  release_date?: string | null
  vote_average?: number | null
}

export interface Genre {
  id: number
  name: string
}

export interface MovieDetails extends Movie {
  runtime?: number | null
  tagline?: string | null
  genres?: Genre[]
}

export interface TvShowDetails extends TvShow {
  overview?: string | null
  first_air_date?: string | null
  number_of_seasons?: number | null
  number_of_episodes?: number | null
  vote_average?: number | null
  tagline?: string | null
  genres?: Genre[]
}

export interface SearchMovieItem {
  id: number
  media_type: 'movie'
  title: string
  poster_path?: string | null
  release_date?: string | null
  vote_average?: number | null
}

export interface SearchTvItem {
  id: number
  media_type: 'tv'
  name: string
  poster_path?: string | null
  first_air_date?: string | null
  vote_average?: number | null
}

export type SearchItem = SearchMovieItem | SearchTvItem

export function isMovie(item: SearchItem): item is SearchMovieItem {
  return item.media_type === 'movie'
}

export function isTvShow(item: SearchItem): item is SearchTvItem {
  return item.media_type === 'tv'
}
