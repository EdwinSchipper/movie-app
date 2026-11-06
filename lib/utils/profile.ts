import type { TileDisplayMode, UserProfile, UserRole } from '@/types'

export function normalizeUserRole(role?: unknown): UserRole {
  return role === 'admin' ? 'admin' : 'user'
}

export function normalizeTileDisplayMode(mode?: unknown): TileDisplayMode {
  return mode === 'row' ? 'row' : 'grid'
}

export function normalizeUserProfile(
  raw: Partial<UserProfile> & { id: string },
  fallback?: { email?: string; role?: unknown; created_at?: string }
): UserProfile {
  const defaultCreatedAt = fallback?.created_at || ''
  return {
    id: raw.id,
    email: raw.email || fallback?.email || '',
    role: normalizeUserRole(raw.role ?? fallback?.role),
    tile_count_preference: raw.tile_count_preference ?? 20,
    tile_display_mode: normalizeTileDisplayMode(raw.tile_display_mode),
    created_at: raw.created_at || defaultCreatedAt,
    updated_at: raw.updated_at || defaultCreatedAt,
  }
}

