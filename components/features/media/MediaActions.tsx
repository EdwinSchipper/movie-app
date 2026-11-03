import { Suspense } from 'react'
import Link from 'next/link'
import { getAppUser } from '@/lib/auth'
import { getWatchlistStatus } from '@/lib/watchlist'
import { isInRecommendations } from '@/lib/recommendations'
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
      <div className="h-9 w-44 rounded-lg bg-gray-200/10" />
      <div className="h-9 w-28 rounded-lg bg-gray-200/10" />
    </div>
  )
}

async function MediaActionsContent({ media, className = '' }: MediaActionsProps) {
  const user = await getAppUser()

  if (!user) {
    const destinationPath =
      media.media_type === 'tv' ? `/tv/${media.tmdb_id}` : `/movies/${media.tmdb_id}`

    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <Link
          href={`/login?next=${destinationPath}`}
          className="inline-flex items-center justify-center font-medium rounded-lg transition-colors cursor-pointer bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 px-4 py-2 text-sm"
          aria-label={`Inloggen om ${media.title} te bewaren of aan te bevelen`}
        >
          Inloggen om te bewaren of aan te bevelen
        </Link>
      </div>
    )
  }

  const [initialWatchlistStatus, initialInRecommendations] = await Promise.all([
    getWatchlistStatus(media.tmdb_id, media.media_type),
    isInRecommendations(media.tmdb_id, media.media_type),
  ])

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <WatchlistButton
        media={media}
        initialStatus={initialWatchlistStatus}
      />
      <RecommendationButton
        media={media}
        initialInRecommendations={initialInRecommendations}
      />
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
