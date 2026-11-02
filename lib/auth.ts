'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { registerSchema } from '@/types'
import type { ActionResult, LoginInput } from '@/types'

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '')
  const headerList = await headers()
  const forwardedHost = headerList.get('x-forwarded-host')
  const forwardedProto = headerList.get('x-forwarded-proto') || 'https'
  const origin =
    siteUrl ||
    (forwardedHost ? `${forwardedProto}://${forwardedHost}` : headerList.get('origin')) ||
    'http://localhost:3000'

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
