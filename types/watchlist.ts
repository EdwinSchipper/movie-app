import type { MediaActionPayload } from './media'

export type WatchlistStatus = 'want_to_watch' | 'watching' | 'watched'

export interface WatchlistItem extends MediaActionPayload {
  id: string
  user_id?: string | null
  status: WatchlistStatus
  created_at: string
}

export interface AddWatchlistInput extends MediaActionPayload {
  status?: WatchlistStatus
}
