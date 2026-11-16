import { Suspense } from 'react'
import { getAppUser } from '@/lib/auth'
import { getWatchlistStatus } from '@/lib/watchlist'
import { isInRecommendations } from '@/lib/recommendations'
import { getMediaDetailHref } from '@/lib/utils'
import { UIButton } from '@/components/ui'
import { WatchlistButton } from '@/components/features/watchlist'
import { RecommendationButton } from '@/components/features/recommendations'
import type { MediaActionPayload } from '@/types'

export interface MediaActionsProps {
  media: MediaActionPayload
  className?: string
}

function MediaActionsSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 animate-pulse ${className}`}>
      <div className="h-9 w-44 rounded-control bg-surface-hover" />
      <div className="h-9 w-28 rounded-control bg-surface-hover" />
    </div>
  )
}

async function MediaActionsContent({ media, className = '' }: MediaActionsProps) {
  const user = await getAppUser()

  if (!user) {
    const destinationPath = getMediaDetailHref(media.media_type, media.tmdb_id)

    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <UIButton
          href={`/login?next=${destinationPath}`}
          variant="primary"
          size="md"
          aria-label={`Inloggen om ${media.title} te bewaren op je watchlist`}
        >
          Inloggen om te bewaren
        </UIButton>
      </div>
    )
  }

  const isUserAdmin = user.role === 'admin'

  const [initialWatchlistStatus, initialInRecommendations] = await Promise.all([
    getWatchlistStatus(media.tmdb_id, media.media_type),
    isUserAdmin
      ? isInRecommendations(media.tmdb_id, media.media_type)
      : Promise.resolve(false),
  ])

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <WatchlistButton
        media={media}
        initialStatus={initialWatchlistStatus}
      />

      {isUserAdmin && (
        <RecommendationButton
          media={media}
          initialInRecommendations={initialInRecommendations}
        />
      )}
    </div>
  )
}

export default function MediaActions({ media, className = '' }: MediaActionsProps) {
  return (
    <Suspense fallback={<MediaActionsSkeleton className={className} />}>
      <MediaActionsContent media={media} className={className} />
    </Suspense>
  )
}
