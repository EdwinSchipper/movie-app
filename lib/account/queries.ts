'use server'

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import { normalizeUserProfile } from '@/lib/utils'
import type { UserProfile } from '@/types'

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
    return normalizeUserProfile(
      { id: user.id },
      {
        email: user.email,
        role: user.app_metadata?.role,
        created_at: user.created_at,
      }
    )
  }

  return normalizeUserProfile(data, {
    email: user.email,
    created_at: user.created_at,
  })
})
