'use client'

import { useState, useTransition } from 'react'
import { UIButton, useToast } from '@/components/ui'
import {
  addToRecommendations,
  removeFromRecommendations,
} from '@/lib/recommendations'
import type { MediaActionPayload } from '@/types'

export interface RecommendationButtonProps {
  media: MediaActionPayload
  initialInRecommendations?: boolean
  className?: string
}

export default function RecommendationButton({
  media,
  initialInRecommendations = false,
  className = '',
}: RecommendationButtonProps) {
  const [inRecommendations, setInRecommendations] = useState(initialInRecommendations)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()

  const handleToggle = () => {
    setError(null)
    startTransition(async () => {
      if (inRecommendations) {
        const res = await removeFromRecommendations({
          tmdbId: media.tmdb_id,
          mediaType: media.media_type,
        })
        if (res.success) {
          setInRecommendations(false)
          toast.info(`'${media.title}' verwijderd uit aanbevelingen`)
        } else {
          const errorMsg = res.error || 'Kon niet verwijderen uit aanbevelingen.'
          setError(errorMsg)
          toast.error(errorMsg)
        }
      } else {
        const res = await addToRecommendations(media)
        if (res.success) {
          setInRecommendations(true)
          toast.success(`'${media.title}' toegevoegd aan aanbevelingen`)
        } else {
          const errorMsg = res.error || 'Kon niet toevoegen aan aanbevelingen.'
          setError(errorMsg)
          toast.error(errorMsg)
        }
      }
    })
  }

  const getButtonText = () => {
    if (isPending) {
      return inRecommendations ? 'Bezig met verwijderen...' : 'Bezig met toevoegen...'
    }
    return inRecommendations ? '✓ Aanbevolen' : 'Aanbevelen'
  }

  return (
    <div className={`inline-flex flex-col items-start gap-1 ${className}`}>
      <UIButton
        variant={inRecommendations ? 'outline' : 'secondary'}
        disabled={isPending}
        onClick={handleToggle}
        className="transition-all duration-200"
        aria-label={
          inRecommendations
            ? `${media.title} verwijderen uit aanbevelingen`
            : `${media.title} toevoegen aan aanbevelingen`
        }
      >
        {getButtonText()}
      </UIButton>

      {error && (
        <p className="text-xs text-red-600 font-medium mt-1 animate-fadeIn" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
