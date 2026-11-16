'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import { userSettingsSchema, type ActionResult, type UserSettings } from '@/types'

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

  const parseResult = userSettingsSchema.partial().safeParse(settings)

  if (!parseResult.success) {
    return {
      success: false,
      error:
        parseResult.error.issues[0]?.message ||
        'Geen geldige instellingen opgegeven om bij te werken.',
    }
  }

  const updates: Partial<UserSettings> = parseResult.data

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
