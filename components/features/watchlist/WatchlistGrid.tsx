import { Suspense } from 'react'
import { getWatchlist } from '@/lib/watchlist'
import type { WatchlistStatus } from '@/types'
import WatchlistCard from './WatchlistCard'

export interface WatchlistGridProps {
  title: string
  subtitle?: string
  watchlistStatus?: WatchlistStatus
}

interface WatchlistFilterProps {
  watchlistStatus: WatchlistStatus
}

function WatchlistGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="aspect-2/3 rounded-xl bg-gray-200/10" />
      ))}
    </div>
  )
}

async function WatchlistGridContent({ watchlistStatus }: WatchlistFilterProps) {
  const watchlist = await getWatchlist()
  const filteredWatchlist = watchlist.filter((item) => item.status === watchlistStatus)

  if (filteredWatchlist.length === 0) {
    return (
      <p className="text-gray-500">
        Er staan nog geen items in je watchlist.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
      {filteredWatchlist.map((item) => (
        <WatchlistCard key={item.id} item={item} />
      ))}
    </div>
  )
}

export default function WatchlistGrid({
  title,
  subtitle,
  watchlistStatus = 'want_to_watch',
}: WatchlistGridProps) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-300 mb-2">
          {title}
        </h1>
        {subtitle && <p className="text-gray-500">{subtitle}</p>}
      </div>

      <Suspense fallback={<WatchlistGridSkeleton />}>
        <WatchlistGridContent watchlistStatus={watchlistStatus} />
      </Suspense>
    </section>
  )
}
