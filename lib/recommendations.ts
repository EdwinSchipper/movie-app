'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type {
  MediaType,
  RecommendationItem,
  AddRecommendationInput,
  ActionResult,
} from '@/types'

/**
 * Haal alle publieke aanbevelingen op uit de database.
 * Let op: we gebruiken ALTIJD expliciete kolomselectie, nooit select('*').
 */
export async function getRecommendations(): Promise<RecommendationItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('recommendations')
    .select(
      'id, user_id, sender_name, receiver_name, tmdb_id, media_type, title, poster_path, release_date, vote_average, overview, created_at'
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fout bij ophalen aanbevelingen:', error.message)
    return []
  }

  return (data as RecommendationItem[]) || []
}

/**
 * Geeft true terug als de film of serie al in de aanbevelingen staat, anders false
 */
export async function isInRecommendations(
  tmdbId: number,
  mediaType: MediaType
): Promise<boolean> {
  if (!tmdbId || (mediaType !== 'movie' && mediaType !== 'tv')) {
    return false
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('recommendations')
    .select('id')
    .eq('tmdb_id', tmdbId)
    .eq('media_type', mediaType)
    .maybeSingle()

  if (error) {
    console.error('Fout bij controleren isInRecommendations:', error.message)
    return false
  }

  return Boolean(data?.id)
}

/**
 * Voeg een film of serie toe aan aanbevelingen
 */
export async function addToRecommendations(
  item: AddRecommendationInput
): Promise<ActionResult> {
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
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const payload = {
    user_id: user?.id ?? null,
    sender_name: item.sender_name?.trim() || 'Aanbeveling',
    receiver_name: item.receiver_name?.trim() || 'Iedereen',
    tmdb_id: item.tmdb_id,
    media_type: item.media_type,
    title: item.title.trim(),
    poster_path: item.poster_path ?? null,
    release_date: item.release_date ?? null,
    vote_average: typeof item.vote_average === 'number' ? item.vote_average : null,
    overview: item.overview ?? null,
  }

  const { error } = await supabase.from('recommendations').insert(payload)

  if (error) {
    console.error('Database fout bij toevoegen aanbeveling:', error.message)
    return { success: false, error: error.message }
  }

  revalidatePath('/recommendations')
  return { success: true }
}

/**
 * Verwijder een film of serie uit de aanbevelingen.
 * Accepteert een Supabase UUID (string) of een TMDB-doel { tmdbId, mediaType }.
 */
export async function removeFromRecommendations(
  target: string | { tmdbId: number; mediaType: MediaType }
): Promise<ActionResult> {
  const supabase = await createClient()

  let query = supabase.from('recommendations').delete()

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
    console.error('Database fout bij verwijderen aanbeveling:', error.message)
    return { success: false, error: error.message }
  }

  revalidatePath('/recommendations')
  return { success: true }
}
