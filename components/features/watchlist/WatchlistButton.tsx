'use client'

import { useState, useTransition } from 'react'
import { UIButton, useToast } from '@/components/ui'
import {
  addToWatchlist,
  updateWatchlistStatus,
  removeFromWatchlist,
} from '@/lib/watchlist'
import type { MediaActionPayload, WatchlistStatus } from '@/types'

export interface WatchlistButtonProps {
  media: MediaActionPayload
  initialStatus?: WatchlistStatus | null
  className?: string
}

export default function WatchlistButton({
  media,
  initialStatus = null,
  className = '',
}: WatchlistButtonProps) {
  const [status, setStatus] = useState<WatchlistStatus | null>(initialStatus)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()
  const isWatched = status === 'watched'

  const handleAdd = () => {
    setError(null)
    startTransition(async () => {
      const nextStatus: WatchlistStatus = 'want_to_watch'
      const res = await addToWatchlist({ ...media, status: nextStatus })
      if (res.success) {
        setStatus(nextStatus)
        toast.success(`'${media.title}' toegevoegd aan watchlist`)
      } else {
        const errorMsg = res.error || 'Kon niet toevoegen aan watchlist.'
        setError(errorMsg)
        toast.error(errorMsg)
      }
    })
  }

  const handleToggleWatched = () => {
    setError(null)
    const nextStatus: WatchlistStatus =
      status === 'watched' ? 'want_to_watch' : 'watched'

    startTransition(async () => {
      const res = await updateWatchlistStatus(
        { tmdbId: media.tmdb_id, mediaType: media.media_type },
        nextStatus
      )
      if (res.success) {
        setStatus(nextStatus)
        toast.info(
          nextStatus === 'watched'
            ? `'${media.title}' gemarkeerd als gezien`
            : `'${media.title}' gemarkeerd als nog te bekijken`
        )
      } else {
        const errorMsg = res.error || 'Kon watchlist status niet bijwerken.'
        setError(errorMsg)
        toast.error(errorMsg)
      }
    })
  }

  const handleRemove = () => {
    setError(null)
    startTransition(async () => {
      const res = await removeFromWatchlist({
        tmdbId: media.tmdb_id,
        mediaType: media.media_type,
      })
      if (res.success) {
        setStatus(null)
        toast.info(`'${media.title}' verwijderd uit watchlist`)
      } else {
        const errorMsg = res.error || 'Kon niet verwijderen uit watchlist.'
        setError(errorMsg)
        toast.error(errorMsg)
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
          aria-label={`${media.title} toevoegen aan watchlist`}
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
                ? `${media.title} markeren als nog niet gezien`
                : `${media.title} markeren als gezien`
            }
          >
            {isWatched ? '✓ Gezien' : 'Markeer als gezien'}
          </UIButton>

          <UIButton
            variant="outline"
            disabled={isPending}
            onClick={handleRemove}
            className="transition-all duration-200"
            aria-label={`${media.title} verwijderen uit watchlist`}
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
