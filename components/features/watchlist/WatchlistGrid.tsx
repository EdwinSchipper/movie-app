import { Suspense } from 'react'
import { getWatchlist } from '@/lib/watchlist'
import { filterAndSortMedia, parseMediaFilters } from '@/lib/filters'
import { FilterBar } from '@/components/features/filtering'
import type { MediaSearchParams, WatchlistStatus } from '@/types'
import WatchlistCard from './WatchlistCard'

export interface WatchlistGridProps {
  heading: string
  subheading?: string
  watchlistStatus?: WatchlistStatus
  searchParams?: MediaSearchParams
}

interface WatchlistContentProps {
  watchlistStatus: WatchlistStatus
  searchParams?: MediaSearchParams
}

function WatchlistGridSkeleton() {
  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 animate-pulse">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="aspect-2/3 w-full rounded-xl bg-gray-200/10" />
          <div className="h-4 w-3/4 rounded bg-gray-200/10" />
        </div>
      ))}
    </div>
  )
}

async function WatchlistGridContent({ watchlistStatus, searchParams }: WatchlistContentProps) {
  const [watchlist, resolvedParams] = await Promise.all([
    getWatchlist(),
    searchParams ? searchParams : Promise.resolve({}),
  ])

  const statusFiltered = watchlist.filter((item) => item.status === watchlistStatus)

  if (statusFiltered.length === 0) {
    return (
      <p className="text-gray-500">
        Er staan nog geen items in je watchlist.
      </p>
    )
  }

  const activeFilters = parseMediaFilters(resolvedParams)
  const displayItems = filterAndSortMedia(statusFiltered, activeFilters)

  if (displayItems.length === 0) {
    return (
      <p className="text-gray-500">
        Geen items gevonden die voldoen aan de geselecteerde filters.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
      {displayItems.map((item) => (
        <WatchlistCard key={item.id} item={item} />
      ))}
    </div>
  )
}

export default function WatchlistGrid({
  heading,
  subheading,
  watchlistStatus = 'want_to_watch',
  searchParams,
}: WatchlistGridProps) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-20">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-300 mb-2">
          {heading}
        </h1>
        {subheading && <p className="text-gray-500">{subheading}</p>}
      </div>

      <FilterBar className="mb-8" />

      <Suspense fallback={<WatchlistGridSkeleton />}>
        <WatchlistGridContent watchlistStatus={watchlistStatus} searchParams={searchParams} />
      </Suspense>
    </section>
  )
}
