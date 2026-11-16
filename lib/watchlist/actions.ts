'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import {
  normalizeMediaActionPayload,
  validateMediaTarget,
} from '@/lib/utils'
import {
  addWatchlistInputSchema,
  watchlistStatusSchema,
  type ActionResult,
  type AddWatchlistInput,
  type MediaType,
  type WatchlistStatus,
} from '@/types'

export async function addToWatchlist(
  item: AddWatchlistInput,
  pathToRevalidate: string = '/watchlist'
): Promise<ActionResult> {
  const user = await getCurrentUser()
  if (!user) {
    return {
      success: false,
      error: 'Je moet ingelogd zijn om een item aan je watchlist toe te voegen.',
    }
  }

  const parseResult = addWatchlistInputSchema.safeParse(item)
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message || 'Ongeldige media-gegevens.',
    }
  }

  const supabase = await createClient()

  const payload = {
    user_id: user.id,
    ...normalizeMediaActionPayload(parseResult.data),
    status: parseResult.data.status ?? 'want_to_watch',
  }

  const { error } = await supabase
    .from('watchlist')
    .upsert(payload, { onConflict: 'user_id,tmdb_id,media_type' })

  if (error) {
    console.error('Database fout bij toevoegen:', error.message)
    return { success: false, error: error.message }
  }

  revalidatePath(pathToRevalidate)
  return { success: true }
}

export async function updateWatchlistStatus(
  target: string | { tmdbId: number; mediaType: MediaType },
  status: WatchlistStatus,
  pathToRevalidate: string = '/watchlist'
): Promise<ActionResult> {
  const user = await getCurrentUser()
  if (!user) {
    return {
      success: false,
      error: 'Je moet ingelogd zijn om je watchlist bij te werken.',
    }
  }

  const statusResult = watchlistStatusSchema.safeParse(status)
  if (!statusResult.success) {
    return {
      success: false,
      error: statusResult.error.issues[0]?.message || 'Ongeldige watchlist status.',
    }
  }

  const targetError = validateMediaTarget(target, 'Ontbrekend ID voor status update.')
  if (targetError) {
    return { success: false, error: targetError }
  }

  const supabase = await createClient()

  let query = supabase
    .from('watchlist')
    .update({ status: statusResult.data })
    .eq('user_id', user.id)

  if (typeof target === 'string') {
    query = query.eq('id', target)
  } else {
    query = query.eq('tmdb_id', target.tmdbId).eq('media_type', target.mediaType)
  }

  const { error } = await query

  if (error) {
    console.error('Database fout bij status update:', error.message)
    return { success: false, error: error.message }
  }

  revalidatePath(pathToRevalidate)
  return { success: true }
}

export async function removeFromWatchlist(
  target: string | { tmdbId: number; mediaType: MediaType },
  pathToRevalidate: string = '/watchlist'
): Promise<ActionResult> {
  const user = await getCurrentUser()
  if (!user) {
    return {
      success: false,
      error: 'Je moet ingelogd zijn om een item uit je watchlist te verwijderen.',
    }
  }

  const targetError = validateMediaTarget(target, 'Ontbrekend ID om te verwijderen.')
  if (targetError) {
    return { success: false, error: targetError }
  }

  const supabase = await createClient()

  let query = supabase.from('watchlist').delete().eq('user_id', user.id)

  if (typeof target === 'string') {
    query = query.eq('id', target)
  } else {
    query = query.eq('tmdb_id', target.tmdbId).eq('media_type', target.mediaType)
  }

  const { error } = await query

  if (error) {
    console.error('Database fout bij verwijderen:', error.message)
    return { success: false, error: error.message }
  }

  revalidatePath(pathToRevalidate)
  return { success: true }
}
