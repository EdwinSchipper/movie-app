import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getWatchlist } from '@/lib/watchlist'
import { getUserProfile } from '@/lib/account'
import { AccountWatchlist } from '@/components/features/account'

function WatchlistSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 w-48 bg-gray-800 rounded" />
      <div className="flex gap-2">
        <div className="h-8 w-24 bg-gray-800/60 rounded" />
        <div className="h-8 w-24 bg-gray-800/60 rounded" />
        <div className="h-8 w-24 bg-gray-800/60 rounded" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="aspect-2/3 bg-gray-800/40 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

async function WatchlistContent() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?next=/account/watchlist')
  }

  const [watchlist, profile] = await Promise.all([
    getWatchlist(),
    getUserProfile(),
  ])

  return (
    <AccountWatchlist
      initialItems={watchlist}
      defaultDisplayMode={profile?.tile_display_mode ?? 'grid'}
      defaultTileLimit={profile?.tile_count_preference ?? 20}
    />
  )
}

export default function AccountWatchlistPage() {
  return (
    <Suspense fallback={<WatchlistSkeleton />}>
      <WatchlistContent />
    </Suspense>
  )
}

