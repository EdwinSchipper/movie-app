'use server'

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth'
import { normalizeUserProfile, normalizeUserRole } from '@/lib/utils'
import type { AdminUserSummary, UserProfile } from '@/types'

export const getAdminUsers = cache(async (): Promise<AdminUserSummary[]> => {
  const isAuthorized = await isAdmin()
  if (!isAuthorized) {
    return []
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, role, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fout bij ophalen gebruikerslijst voor admin:', error.message)
    return []
  }

  return ((data as AdminUserSummary[]) || []).map((user) => ({
    id: user.id,
    email: user.email || '',
    role: normalizeUserRole(user.role),
    created_at: user.created_at || '',
  }))
})

export const getAdminUserById = cache(async (id: string): Promise<UserProfile | null> => {
  const isAuthorized = await isAdmin()
  if (!isAuthorized || !id) {
    return null
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, role, tile_count_preference, tile_display_mode, created_at, updated_at')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('Fout bij ophalen gebruikerdetails voor admin:', error.message)
    return null
  }

  if (!data) {
    return null
  }

  return normalizeUserProfile(data)
})
