import { z } from 'zod'

export type UserRole = 'admin' | 'user'

export type TileDisplayMode = 'grid' | 'row'

export interface AppUser {
  id: string
  email: string
  role: UserRole
}

export interface UserSettings {
  tile_count_preference: number
  tile_display_mode: TileDisplayMode
}

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

export interface LoginInput {
  email: string
  password: string
}
