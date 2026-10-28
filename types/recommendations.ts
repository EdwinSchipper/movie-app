import type { MediaType } from './watchlist'

export interface RecommendationItem {
  id: string
  user_id?: string | null
  sender_name?: string | null
  receiver_name?: string | null
  tmdb_id: number
  media_type: MediaType
  title: string
  poster_path?: string | null
  release_date?: string | null
  vote_average?: number | null
  overview?: string | null
  created_at: string
}

export type AddRecommendationInput = {
  tmdb_id: number
  media_type: MediaType
  title: string
  poster_path?: string | null
  release_date?: string | null
  vote_average?: number | null
  overview?: string | null
  sender_name?: string | null
  receiver_name?: string | null
}
