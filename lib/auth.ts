'use server'

import { cache } from 'react'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getSiteUrl } from '@/lib/env'
import { normalizeUserRole } from '@/lib/utils'
import { registerSchema } from '@/types'
import type { ActionResult, AppUser, LoginInput } from '@/types'

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

export async function login(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email')
  const password = formData.get('password')

  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    return {
      success: false,
      error: 'Vul zowel een geldig e-mailadres als wachtwoord in.',
    }
  }

  const credentials: LoginInput = {
    email: email.trim(),
    password,
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword(credentials)

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return {
        success: false,
        error: 'Onjuist e-mailadres of wachtwoord.',
      }
    }

    if (error.message.includes('Email not confirmed')) {
      return {
        success: false,
        error: 'Je e-mailadres is nog niet bevestigd. Controleer je inbox.',
      }
    }

    return {
      success: false,
      error: error.message,
    }
  }

  revalidatePath('/', 'layout')

  return {
    success: true,
  }
}

export async function signup(
  formData: FormData
): Promise<ActionResult<{ needsEmailConfirmation?: boolean }>> {
  const email = formData.get('email')
  const password = formData.get('password')
  const confirmPassword = formData.get('confirmPassword')

  const parseResult = registerSchema.safeParse({
    email,
    password,
    confirmPassword,
  })

  if (!parseResult.success) {
    const firstIssue = parseResult.error.issues[0]
    return {
      success: false,
      error: firstIssue?.message || 'Controleer de ingevoerde gegevens.',
    }
  }

  const headerList = await headers()
  const origin = getSiteUrl(
    headerList.get('x-forwarded-host'),
    headerList.get('x-forwarded-proto')
  )

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email: parseResult.data.email,
    password: parseResult.data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/`,
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return {
        success: false,
        error: 'Er bestaat al een account met dit e-mailadres.',
      }
    }

    return {
      success: false,
      error: error.message,
    }
  }

  const needsEmailConfirmation = !data.session

  if (!needsEmailConfirmation) {
    revalidatePath('/', 'layout')
  }

  return {
    success: true,
    data: {
      needsEmailConfirmation,
    },
  }
}

export async function logout(): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  revalidatePath('/', 'layout')

  return {
    success: true,
  }
}
