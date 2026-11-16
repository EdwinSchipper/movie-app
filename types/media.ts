import { z } from 'zod'

export const mediaTypeSchema = z.enum(['movie', 'tv'], {
  error: 'Ongeldig mediatype. Moet movie of tv zijn.',
})

export type MediaType = z.infer<typeof mediaTypeSchema>

export const mediaActionPayloadSchema = z.object({
  tmdb_id: z
    .int('Ongeldig of ontbrekend TMDB ID.')
    .positive('Ongeldig of ontbrekend TMDB ID.'),
  media_type: mediaTypeSchema,
  title: z
    .string('Titel mag niet leeg zijn.')
    .trim()
    .min(1, 'Titel mag niet leeg zijn.'),
  poster_path: z.string().nullable().optional(),
  release_date: z.string().nullable().optional(),
  vote_average: z.number().nullable().optional(),
  overview: z.string().nullable().optional(),
})

export interface MediaActionPayload {
  tmdb_id: number
  media_type: MediaType
  title: string
  poster_path?: string | null
  release_date?: string | null
  vote_average?: number | null
  overview?: string | null
}

export const mediaTargetSchema = z.union([
  z.string('Ontbrekend ID.').trim().min(1, 'Ontbrekend ID.'),
  z.object({
    tmdbId: z
      .int('Ongeldig TMDB ID of mediatype.')
      .positive('Ongeldig TMDB ID of mediatype.'),
    mediaType: z.enum(['movie', 'tv'], {
      error: 'Ongeldig TMDB ID of mediatype.',
    }),
  }),
])

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string }
