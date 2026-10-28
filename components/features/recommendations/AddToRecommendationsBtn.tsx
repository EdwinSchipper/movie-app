'use client'

import { useState, useTransition } from 'react'
import UIButton from '@/components/ui/Button'
import { addToRecommendations, removeFromRecommendations } from '@/lib/recommendations'
import type { AddRecommendationInput } from '@/types'

interface AddToRecommendationsBtnProps {
  item: AddRecommendationInput
  initialInRecommendations?: boolean
  className?: string
}

export default function AddToRecommendationsBtn({
  item,
  initialInRecommendations = false,
  className = '',
}: AddToRecommendationsBtnProps) {
  const [inRecommendations, setInRecommendations] = useState(initialInRecommendations)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleToggle = () => {
    setError(null)
    startTransition(async () => {
      if (inRecommendations) {
        const res = await removeFromRecommendations({
          tmdbId: item.tmdb_id,
          mediaType: item.media_type,
        })
        if (res.success) {
          setInRecommendations(false)
        } else {
          setError(res.error || 'Kon niet verwijderen uit aanbevelingen.')
        }
      } else {
        const res = await addToRecommendations(item)
        if (res.success) {
          setInRecommendations(true)
        } else {
          setError(res.error || 'Kon niet toevoegen aan aanbevelingen.')
        }
      }
    })
  }

  const getButtonText = () => {
    if (isPending) {
      return inRecommendations ? 'Bezig met verwijderen...' : 'Bezig met toevoegen...'
    }
    return inRecommendations ? 'Aanbevolen' : 'Aanbevelen'
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
            ? `${item.title} verwijderen uit aanbevelingen`
            : `${item.title} toevoegen aan aanbevelingen`
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

