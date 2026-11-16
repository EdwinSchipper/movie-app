'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth'
import { updateUserRoleSchema, type ActionResult, type UserRole } from '@/types'

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

  const parseResult = updateUserRoleSchema.safeParse({ userId, newRole })
  if (!parseResult.success) {
    return {
      success: false,
      error:
        parseResult.error.issues[0]?.message ||
        'Ongeldige gebruiker-ID of rol opgegeven.',
    }
  }

  const { userId: targetUserId, newRole: validatedRole } = parseResult.data
  const supabase = await createClient()

  const { error: rpcError } = await supabase.rpc('set_user_role', {
    target_user_id: targetUserId,
    new_role: validatedRole,
  })

  if (rpcError) {
    const { data: updatedRow, error: updateError } = await supabase
      .from('profiles')
      .update({ role: validatedRole, updated_at: new Date().toISOString() })
      .eq('id', targetUserId)
      .select('id')
      .maybeSingle()

    if (updateError) {
      console.error('Fout bij bijwerken gebruikersrol:', updateError.message)
      return {
        success: false,
        error: updateError.message,
      }
    }

    if (!updatedRow) {
      return {
        success: false,
        error: 'Gebruikersprofiel kon niet worden bijgewerkt.',
      }
    }
  }

  revalidatePath('/admin', 'layout')

  return {
    success: true,
  }
}
