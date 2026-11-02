import { z } from 'zod'

export type UserRole = 'admin' | 'user'

export interface AppUser {
  id: string
  email: string
  role: UserRole
}

export const registerSchema = z
  .object({
    email: z.email('Vul een geldig e-mailadres in.'),
    password: z
      .string()
      .min(8, 'Wachtwoord moet minimaal 8 tekens bevatten.')
      .regex(/[A-Z]/, 'Wachtwoord moet minimaal één hoofdletter bevatten.')
      .regex(/[0-9]/, 'Wachtwoord moet minimaal één cijfer bevatten.'),
    confirmPassword: z
      .string()
      .min(1, 'Bevestig je wachtwoord.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'De wachtwoorden komen niet overeen.',
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof registerSchema>

export interface LoginInput {
  email: string
  password: string
}
