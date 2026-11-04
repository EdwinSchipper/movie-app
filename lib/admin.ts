'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth'
import type { ActionResult, AdminUserSummary, UserProfile, UserRole } from '@/types'

export async function getAdminUsers(): Promise<AdminUserSummary[]> {
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

  return (data as AdminUserSummary[]) || []
}

export async function getAdminUserById(id: string): Promise<UserProfile | null> {
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

  return (data as UserProfile) ?? null
}

export async function updateUserRole(
  userId: string,
  newRole: UserRole
): Promise<ActionResult> {
  const isAuthorized = await isAdmin()
  if (!isAuthorized) {
    return {
      success: false,
      error: 'Toegang geweigerd: alleen administrators kunnen rollen wijzigen.',
    }
  }

  if (!userId || (newRole !== 'admin' && newRole !== 'user')) {
    return {
      success: false,
      error: 'Ongeldige gebruiker-ID of rol opgegeven.',
    }
  }

  const supabase = await createClient()

  const { error: rpcError } = await supabase.rpc('set_user_role', {
    target_user_id: userId,
    new_role: newRole,
  })

  if (rpcError) {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (updateError) {
      console.error('Fout bij bijwerken gebruikersrol:', updateError.message)
      return {
        success: false,
        error: updateError.message,
      }
    }
  }

  revalidatePath('/admin/users')
  revalidatePath(`/admin/users/${userId}`)

  return {
    success: true,
  }
}

