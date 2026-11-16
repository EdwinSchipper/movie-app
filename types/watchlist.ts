import { z } from 'zod'
import { mediaActionPayloadSchema, type MediaActionPayload } from './media'

export const watchlistStatusSchema = z.enum(['want_to_watch', 'watching', 'watched'], {
  error: 'Ongeldige watchlist status.',
})

export type WatchlistStatus = z.infer<typeof watchlistStatusSchema>

export const addWatchlistInputSchema = mediaActionPayloadSchema.extend({
  status: watchlistStatusSchema.optional(),
})

export interface WatchlistItem extends MediaActionPayload {
  id: string
  user_id?: string | null
  status: WatchlistStatus
  created_at: string
}

export interface AddWatchlistInput extends MediaActionPayload {
  status?: WatchlistStatus
}
