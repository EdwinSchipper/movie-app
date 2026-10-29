'use client'

import { useState, useTransition } from 'react'
import { UIButton } from '@/components/ui'
import {
  addToWatchlist,
  updateWatchlistStatus,
  removeFromWatchlist,
} from '@/lib/watchlist'
import type { AddWatchlistInput, WatchlistStatus } from '@/types'

export interface WatchlistActionsProps {
  item: AddWatchlistInput
  initialStatus?: WatchlistStatus | null
  className?: string
}

export default function WatchlistActions({
  item,
  initialStatus = null,
  className = '',
}: WatchlistActionsProps) {
  const [status, setStatus] = useState<WatchlistStatus | null>(initialStatus)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const isWatched = status === 'watched'

  const handleAdd = () => {
    setError(null)
    startTransition(async () => {
      const nextStatus: WatchlistStatus = 'want_to_watch'
      const res = await addToWatchlist({ ...item, status: nextStatus })
      if (res.success) {
        setStatus(nextStatus)
      } else {
        setError(res.error || 'Kon niet toevoegen aan watchlist.')
      }
    })
  }

  const handleToggleWatched = () => {
    setError(null)
    const nextStatus: WatchlistStatus =
      status === 'watched' ? 'want_to_watch' : 'watched'

    startTransition(async () => {
      const res = await updateWatchlistStatus(
        { tmdbId: item.tmdb_id, mediaType: item.media_type },
        nextStatus
      )
      if (res.success) {
        setStatus(nextStatus)
      } else {
        setError(res.error || 'Kon watchlist status niet bijwerken.')
      }
    })
  }

  const handleRemove = () => {
    setError(null)
    startTransition(async () => {
      const res = await removeFromWatchlist({
        tmdbId: item.tmdb_id,
        mediaType: item.media_type,
      })
      if (res.success) {
        setStatus(null)
      } else {
        setError(res.error || 'Kon niet verwijderen uit watchlist.')
      }
    })
  }

  return (
    <div className={`inline-flex flex-col items-start gap-1 ${className}`}>
      {status === null ? (
        <UIButton
          variant="primary"
          disabled={isPending}
          onClick={handleAdd}
          className="transition-all duration-200"
          aria-label={`${item.title} toevoegen aan watchlist`}
        >
          {isPending ? 'Bezig met toevoegen...' : 'Toevoegen aan Watchlist'}
        </UIButton>
      ) : (
        <div className="inline-flex flex-wrap items-center gap-2">
          <UIButton
            variant={isWatched ? 'primary' : 'secondary'}
            disabled={isPending}
            onClick={handleToggleWatched}
            className="transition-all duration-200"
            aria-label={
              isWatched
                ? `${item.title} markeren als nog niet gezien`
                : `${item.title} markeren als gezien`
            }
          >
            {isWatched ? '✓ Gezien' : 'Markeer als gezien'}
          </UIButton>

          <UIButton
            variant="outline"
            disabled={isPending}
            onClick={handleRemove}
            className="transition-all duration-200"
            aria-label={`${item.title} verwijderen uit watchlist`}
          >
            Uit Watchlist
          </UIButton>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 font-medium mt-1 animate-fadeIn" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
