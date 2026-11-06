import { Suspense } from 'react'
import { getRecommendations } from '@/lib/recommendations'
import { filterAndSortMedia, parseMediaFilters } from '@/lib/utils'
import { FilterBar } from '@/components/features/filtering'
import type { MediaSearchParams } from '@/types'
import RecommendationCard from './RecommendationCard'

export interface RecommendationGridProps {
  heading: string
  subheading?: string
  searchParams?: MediaSearchParams
}

interface RecommendationContentProps {
  searchParams?: MediaSearchParams
}

function RecommendationGridSkeleton() {
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

async function RecommendationGridContent({ searchParams }: RecommendationContentProps) {
  const [recommendations, resolvedParams] = await Promise.all([
    getRecommendations(),
    searchParams ? searchParams : Promise.resolve({}),
  ])

  if (recommendations.length === 0) {
    return (
      <p className="text-gray-500">
        Er staan nog geen aanbevelingen in de lijst.
      </p>
    )
  }

  const activeFilters = parseMediaFilters(resolvedParams)
  const displayItems = filterAndSortMedia(recommendations, activeFilters)

  if (displayItems.length === 0) {
    return (
      <p className="text-gray-500">
        Geen aanbevelingen gevonden die voldoen aan de geselecteerde filters.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
      {displayItems.map((item) => (
        <RecommendationCard key={item.id} item={item} />
      ))}
    </div>
  )
}

export default function RecommendationGrid({
  heading,
  subheading,
  searchParams,
}: RecommendationGridProps) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-20">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-300 mb-2">
          {heading}
        </h1>
        {subheading && <p className="text-gray-500">{subheading}</p>}
      </div>

      <FilterBar className="mb-8" />

      <Suspense fallback={<RecommendationGridSkeleton />}>
        <RecommendationGridContent searchParams={searchParams} />
      </Suspense>
    </section>
  )
}
