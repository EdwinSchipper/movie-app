'use client'

import { useState, useTransition } from 'react'
import { UIButton } from '@/components/ui'
import { addToWatchlist, removeFromWatchlist } from '@/lib/watchlist'
import type { AddWatchlistInput } from '@/types'

export interface AddToWatchlistBtnProps {
  item: AddWatchlistInput
  initialInWatchlist?: boolean
  className?: string
}

export default function AddToWatchlistBtn({
  item,
  initialInWatchlist = false,
  className = '',
}: AddToWatchlistBtnProps) {
  const [inWatchlist, setInWatchlist] = useState(initialInWatchlist)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleToggle = () => {
    setError(null)
    startTransition(async () => {
      if (inWatchlist) {
        const res = await removeFromWatchlist({
          tmdbId: item.tmdb_id,
          mediaType: item.media_type,
        })
        if (res.success) {
          setInWatchlist(false)
        } else {
          setError(res.error || 'Kon niet verwijderen uit watchlist.')
        }
      } else {
        const res = await addToWatchlist(item)
        if (res.success) {
          setInWatchlist(true)
        } else {
          setError(res.error || 'Kon niet toevoegen aan watchlist.')
        }
      }
    })
  }

  const getButtonText = () => {
    if (isPending) {
      return inWatchlist ? 'Bezig met verwijderen...' : 'Bezig met toevoegen...'
    }
    return inWatchlist ? 'In Watchlist' : 'Toevoegen aan Watchlist'
  }

  return (
    <div className={`inline-flex flex-col items-start gap-1 ${className}`}>
      <UIButton
        variant={inWatchlist ? 'outline' : 'primary'}
        disabled={isPending}
        onClick={handleToggle}
        className="transition-all duration-200"
        aria-label={
          inWatchlist
            ? `${item.title} verwijderen uit watchlist`
            : `${item.title} toevoegen aan watchlist`
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
