'use server'

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { MediaType, RecommendationItem } from '@/types'

export const getRecommendations = cache(async (): Promise<RecommendationItem[]> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('recommendations')
    .select(
      'id, user_id, sender_name, receiver_name, tmdb_id, media_type, title, poster_path, release_date, vote_average, overview, created_at'
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fout bij ophalen aanbevelingen:', error.message)
    return []
  }

  return (data as RecommendationItem[]) || []
})

export const isInRecommendations = cache(async (
  tmdbId: number,
  mediaType: MediaType
): Promise<boolean> => {
  if (!tmdbId || (mediaType !== 'movie' && mediaType !== 'tv')) {
    return false
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('recommendations')
    .select('id')
    .eq('tmdb_id', tmdbId)
    .eq('media_type', mediaType)
    .maybeSingle()

  if (error) {
    console.error('Fout bij controleren isInRecommendations:', error.message)
    return false
  }

  return Boolean(data?.id)
})
