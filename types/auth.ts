import { z } from 'zod'

export const userRoleSchema = z.enum(['admin', 'user'], {
  error: 'Ongeldige gebruikersrol opgegeven.',
})

export type UserRole = z.infer<typeof userRoleSchema>

export const tileDisplayModeSchema = z.enum(['grid', 'row'], {
  error: 'Ongeldige weergavemodus opgegeven.',
})

export type TileDisplayMode = z.infer<typeof tileDisplayModeSchema>

export interface AppUser {
  id: string
  email: string
  role: UserRole
}

export const userSettingsSchema = z.object({
  tile_count_preference: z
    .int('Aantal tiles moet een geheel getal zijn.')
    .min(5, 'Aantal tiles moet minimaal 5 zijn.')
    .max(100, 'Aantal tiles mag maximaal 100 zijn.'),
  tile_display_mode: tileDisplayModeSchema,
})

export type UserSettings = z.infer<typeof userSettingsSchema>

export interface UserProfile extends AppUser, UserSettings {
  created_at: string
  updated_at: string
}

export interface AdminUserSummary extends AppUser {
  created_at: string
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

export const loginSchema = z.object({
  email: z.email('Vul zowel een geldig e-mailadres als wachtwoord in.'),
  password: z
    .string('Vul zowel een geldig e-mailadres als wachtwoord in.')
    .min(1, 'Vul zowel een geldig e-mailadres als wachtwoord in.'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const updateUserRoleSchema = z.object({
  userId: z.uuid('Ongeldige gebruiker-ID opgegeven.'),
  newRole: userRoleSchema,
})
