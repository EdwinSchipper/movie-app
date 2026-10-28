export type MediaType = 'movie' | 'tv'

export type WatchlistStatus = 'want_to_watch' | 'watching' | 'watched'

export interface WatchlistItem {
  id: string
  user_id?: string | null
  tmdb_id: number
  media_type: MediaType
  title: string
  poster_path?: string | null
  release_date?: string | null
  vote_average?: number | null
  overview?: string | null
  status: WatchlistStatus
  created_at: string
}

export type AddWatchlistInput = {
  tmdb_id: number
  media_type: MediaType
  title: string
  poster_path?: string | null
  release_date?: string | null
  vote_average?: number | null
  overview?: string | null
  status?: WatchlistStatus
}

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string }

