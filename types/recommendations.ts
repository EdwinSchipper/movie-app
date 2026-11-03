import type { MediaActionPayload } from './media'

export interface RecommendationItem extends MediaActionPayload {
  id: string
  user_id?: string | null
  sender_name?: string | null
  receiver_name?: string | null
  created_at: string
}

export interface AddRecommendationInput extends MediaActionPayload {
  sender_name?: string | null
  receiver_name?: string | null
}
