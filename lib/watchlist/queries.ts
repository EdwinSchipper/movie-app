'use server'

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import type { MediaType, WatchlistItem, WatchlistStatus } from '@/types'

export const getWatchlist = cache(async (): Promise<WatchlistItem[]> => {
  const user = await getCurrentUser()
  if (!user) {
    return []
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('watchlist')
    .select('id, user_id, tmdb_id, media_type, title, poster_path, release_date, vote_average, overview, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fout bij ophalen watchlist:', error.message)
    return []
  }

  return (data as WatchlistItem[]) || []
})

export const getWatchlistStatus = cache(async (
  tmdbId: number,
  mediaType: MediaType
): Promise<WatchlistStatus | null> => {
  if (!tmdbId || (mediaType !== 'movie' && mediaType !== 'tv')) {
    return null
  }

  const user = await getCurrentUser()
  if (!user) {
    return null
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('watchlist')
    .select('status')
    .eq('user_id', user.id)
    .eq('tmdb_id', tmdbId)
    .eq('media_type', mediaType)
    .maybeSingle()

  if (error) {
    console.error('Fout bij ophalen getWatchlistStatus:', error.message)
    return null
  }

  return (data?.status as WatchlistStatus) ?? null
})

export const isInWatchlist = cache(async (
  tmdbId: number,
  mediaType: MediaType
): Promise<boolean> => {
  const status = await getWatchlistStatus(tmdbId, mediaType)
  return status !== null
})
