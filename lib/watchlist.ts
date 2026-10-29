'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type {
  MediaType,
  WatchlistStatus,
  WatchlistItem,
  AddWatchlistInput,
  ActionResult,
} from '@/types'

/**
 * Haal items uit watchlist
 */
export async function getWatchlist(): Promise<WatchlistItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('watchlist')
    .select('id, user_id, tmdb_id, media_type, title, poster_path, release_date, vote_average, overview, status, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fout bij ophalen watchlist:', error.message)
    return []
  }

  const items = (data as WatchlistItem[]) || []
  return items
}

/**
 * Geeft true terug als de film of serie al in de watchlist staat, anders false
 */
export async function isInWatchlist(tmdbId: number, mediaType: MediaType): Promise<boolean> {
  if (!tmdbId || (mediaType !== 'movie' && mediaType !== 'tv')) {
    return false
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('watchlist')
    .select('id')
    .eq('tmdb_id', tmdbId)
    .eq('media_type', mediaType)
    .maybeSingle()

  if (error) {
    console.error('Fout bij controleren isInWatchlist:', error.message)
    return false
  }

  return Boolean(data?.id)
}

/**
 * Voeg een film of serie toe aan de watchlist met runtime type-validatie
 */
export async function addToWatchlist(item: AddWatchlistInput): Promise<ActionResult> {
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
  return { success: true }
}

/**
 * Wijzig de status (bijv. 'want_to_watch' -> 'watched')
 */
export async function updateWatchlistStatus(
  id: string,
  status: WatchlistStatus
): Promise<ActionResult> {
  const validStatuses: WatchlistStatus[] = ['want_to_watch', 'watching', 'watched']
  if (!validStatuses.includes(status)) {
    return { success: false, error: 'Ongeldige watchlist status.' }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('watchlist')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Database fout bij status update:', error.message)
    return { success: false, error: error.message }
  }

  revalidatePath('/watchlist')
  return { success: true }
}

/**
 * Verwijder een film of serie uit de watchlist.
 * Accepteert een Supabase UUID (string) of een TMDB-doel { tmdbId, mediaType }.
 */
export async function removeFromWatchlist(
  target: string | { tmdbId: number; mediaType: MediaType }
): Promise<ActionResult> {
  const supabase = await createClient()

  let query = supabase.from('watchlist').delete()

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
  return { success: true }
}
