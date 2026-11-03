export type MediaType = 'movie' | 'tv'

export interface MediaActionPayload {
  tmdb_id: number
  media_type: MediaType
  title: string
  poster_path?: string | null
  release_date?: string | null
  vote_average?: number | null
  overview?: string | null
}

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string }
