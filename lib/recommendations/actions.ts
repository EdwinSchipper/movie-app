'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, isAdmin } from '@/lib/auth'
import {
  normalizeMediaActionPayload,
  validateMediaActionPayload,
  validateMediaTarget,
} from '@/lib/utils'
import type {
  ActionResult,
  AddRecommendationInput,
  MediaType,
} from '@/types'

export async function addToRecommendations(
  item: AddRecommendationInput
): Promise<ActionResult> {
  const user = await getCurrentUser()
  if (!user) {
    return {
      success: false,
      error: 'Toegang geweigerd: je moet ingelogd zijn.',
    }
  }

  const admin = await isAdmin()
  if (!admin) {
    return {
      success: false,
      error: 'Toegang geweigerd: alleen administrators kunnen aanbevelingen toevoegen.',
    }
  }

  const validationError = validateMediaActionPayload(item)
  if (validationError) {
    return { success: false, error: validationError }
  }

  const supabase = await createClient()

  const payload = {
    user_id: user.id,
    sender_name: item.sender_name?.trim() || 'Aanbeveling',
    receiver_name: item.receiver_name?.trim() || 'Iedereen',
    ...normalizeMediaActionPayload(item),
  }

  const { error } = await supabase
    .from('recommendations')
    .upsert(payload, { onConflict: 'user_id,tmdb_id,media_type' })

  if (error) {
    console.error('Database fout bij toevoegen aanbeveling:', error.message)
    return { success: false, error: error.message }
  }

  revalidatePath('/recommendations')
  revalidatePath('/admin/recommendations')
  return { success: true }
}

export async function removeFromRecommendations(
  target: string | { tmdbId: number; mediaType: MediaType }
): Promise<ActionResult> {
  const admin = await isAdmin()
  if (!admin) {
    return {
      success: false,
      error: 'Toegang geweigerd: alleen administrators kunnen aanbevelingen verwijderen.',
    }
  }

  const targetError = validateMediaTarget(target, 'Ontbrekend ID om te verwijderen.')
  if (targetError) {
    return { success: false, error: targetError }
  }

  const supabase = await createClient()

  let query = supabase.from('recommendations').delete()

  if (typeof target === 'string') {
    query = query.eq('id', target)
  } else {
    query = query.eq('tmdb_id', target.tmdbId).eq('media_type', target.mediaType)
  }

  const { error } = await query

  if (error) {
    console.error('Database fout bij verwijderen aanbeveling:', error.message)
    return { success: false, error: error.message }
  }

  revalidatePath('/recommendations')
  revalidatePath('/admin/recommendations')
  return { success: true }
}
