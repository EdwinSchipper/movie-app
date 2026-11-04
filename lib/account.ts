'use server'

import { cache } from 'react'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import type { ActionResult, UserProfile, UserSettings } from '@/types'

export const getUserProfile = cache(async (): Promise<UserProfile | null> => {
  const user = await getCurrentUser()
  if (!user) {
    return null
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, role, tile_count_preference, tile_display_mode, created_at, updated_at')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    console.error('Fout bij ophalen gebruikersprofiel:', error.message)
    return null
  }

  if (!data) {
    const fallbackProfile: UserProfile = {
      id: user.id,
      email: user.email || '',
      role: user.app_metadata?.role === 'admin' ? 'admin' : 'user',
      tile_count_preference: 20,
      tile_display_mode: 'grid',
      created_at: user.created_at,
      updated_at: user.created_at,
    }
    return fallbackProfile
  }

  return data as UserProfile
})

export async function updateUserSettings(
  settings: Partial<UserSettings>
): Promise<ActionResult> {
  const user = await getCurrentUser()
  if (!user) {
    return {
      success: false,
      error: 'Niet geautoriseerd: je moet ingelogd zijn.',
    }
  }

  const updates: Partial<UserSettings> = {}

  if (typeof settings.tile_count_preference === 'number') {
    const preference = Math.min(Math.max(settings.tile_count_preference, 5), 100)
    updates.tile_count_preference = preference
  }

  if (settings.tile_display_mode === 'grid' || settings.tile_display_mode === 'row') {
    updates.tile_display_mode = settings.tile_display_mode
  }

  if (Object.keys(updates).length === 0) {
    return {
      success: false,
      error: 'Geen geldige instellingen opgegeven om bij te werken.',
    }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      email: user.email || '',
      ...updates,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Fout bij bijwerken gebruikersinstellingen:', error.message)
    return {
      success: false,
      error: error.message,
    }
  }

  revalidatePath('/account', 'layout')

  return {
    success: true,
  }
}
