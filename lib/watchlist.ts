'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import type {
  MediaType,
  WatchlistStatus,
  WatchlistItem,
  AddWatchlistInput,
  ActionResult,
} from '@/types'

export async function getWatchlist(): Promise<WatchlistItem[]> {
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
}

export async function getWatchlistStatus(
  tmdbId: number,
  mediaType: MediaType
): Promise<WatchlistStatus | null> {
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
}

export async function isInWatchlist(tmdbId: number, mediaType: MediaType): Promise<boolean> {
  const status = await getWatchlistStatus(tmdbId, mediaType)
  return status !== null
}

export async function addToWatchlist(item: AddWatchlistInput): Promise<ActionResult> {
  const user = await getCurrentUser()
  if (!user) {
    return { success: false, error: 'Je moet ingelogd zijn om een item aan je watchlist toe te voegen.' }
  }

  if (!item.tmdb_id || typeof item.tmdb_id !== 'number') {
    return { success: false, error: 'Ongeldig of ontbrekend TMDB ID.' }
  }

  if (item.media_type !== 'movie' && item.media_type !== 'tv') {
    return { success: false, error: 'Ongeldig mediatype. Moet movie of tv zijn.' }
  }

  if (!item.title || typeof item.title !== 'string' || item.title.trim() === '') {
    return { success: false, error: 'Titel mag niet leeg zijn.' }
  }

  const supabase = await createClient()

  const payload = {
    user_id: user.id,
    tmdb_id: item.tmdb_id,
    media_type: item.media_type,
    title: item.title.trim(),
    poster_path: item.poster_path ?? null,
    release_date: item.release_date ?? null,
    vote_average: typeof item.vote_average === 'number' ? item.vote_average : null,
    overview: item.overview ?? null,
    status: item.status ?? 'want_to_watch',
  }

  const { error } = await supabase
    .from('watchlist')
    .upsert(payload, { onConflict: 'user_id,tmdb_id,media_type' })

  if (error) {
    console.error('Database fout bij toevoegen:', error.message)
    return { success: false, error: error.message }
  }

  revalidatePath('/watchlist')
  revalidatePath('/account/watchlist')
  return { success: true }
}

export async function updateWatchlistStatus(
  target: string | { tmdbId: number; mediaType: MediaType },
  status: WatchlistStatus
): Promise<ActionResult> {
  const user = await getCurrentUser()
  if (!user) {
    return { success: false, error: 'Je moet ingelogd zijn om je watchlist bij te werken.' }
  }

  const validStatuses: WatchlistStatus[] = ['want_to_watch', 'watching', 'watched']
  if (!validStatuses.includes(status)) {
    return { success: false, error: 'Ongeldige watchlist status.' }
  }

  const supabase = await createClient()

  let query = supabase.from('watchlist').update({ status }).eq('user_id', user.id)

  if (typeof target === 'string') {
    if (!target.trim()) {
      return { success: false, error: 'Ontbrekend ID voor status update.' }
    }
    query = query.eq('id', target)
  } else {
    if (!target.tmdbId || (target.mediaType !== 'movie' && target.mediaType !== 'tv')) {
      return { success: false, error: 'Ongeldig TMDB ID of mediatype.' }
    }
    query = query.eq('tmdb_id', target.tmdbId).eq('media_type', target.mediaType)
  }

  const { error } = await query

  if (error) {
    console.error('Database fout bij status update:', error.message)
    return { success: false, error: error.message }
  }

  revalidatePath('/watchlist')
  revalidatePath('/account/watchlist')
  return { success: true }
}

export async function removeFromWatchlist(
  target: string | { tmdbId: number; mediaType: MediaType }
): Promise<ActionResult> {
  const user = await getCurrentUser()
  if (!user) {
    return { success: false, error: 'Je moet ingelogd zijn om een item uit je watchlist te verwijderen.' }
  }

  const supabase = await createClient()

  let query = supabase.from('watchlist').delete().eq('user_id', user.id)

  if (typeof target === 'string') {
    if (!target.trim()) {
      return { success: false, error: 'Ontbrekend ID om te verwijderen.' }
    }
    query = query.eq('id', target)
  } else {
    if (!target.tmdbId || (target.mediaType !== 'movie' && target.mediaType !== 'tv')) {
      return { success: false, error: 'Ongeldig TMDB ID of mediatype.' }
    }
    query = query.eq('tmdb_id', target.tmdbId).eq('media_type', target.mediaType)
  }

  const { error } = await query

  if (error) {
    console.error('Database fout bij verwijderen:', error.message)
    return { success: false, error: error.message }
  }

  revalidatePath('/watchlist')
  revalidatePath('/account/watchlist')
  return { success: true }
}
