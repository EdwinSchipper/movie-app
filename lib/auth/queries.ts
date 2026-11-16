'use server'

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { normalizeUserRole } from '@/lib/utils'
import type { AppUser } from '@/types'

export const getCurrentUser = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

export const getAppUser = cache(async (): Promise<AppUser | null> => {
  const user = await getCurrentUser()
  if (!user) {
    return null
  }

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .maybeSingle()

  const role = normalizeUserRole(profile?.role ?? user.app_metadata?.role)

  return {
    id: user.id,
    email:
      profile?.email ||
      user.email ||
      (typeof user.user_metadata?.email === 'string' ? user.user_metadata.email : '') ||
      '',
    role,
  }
})

export const isAdmin = cache(async (): Promise<boolean> => {
  const appUser = await getAppUser()
  return appUser?.role === 'admin'
})
