'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
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
