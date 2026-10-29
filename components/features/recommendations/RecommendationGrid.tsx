import { Suspense } from 'react'
import { getRecommendations } from '@/lib/recommendations'
import { filterAndSortMedia, parseMediaFilters } from '@/lib/filters'
import { FilterBar } from '@/components/features/filtering'
import type { MediaSearchParams } from '@/types'
import RecommendationCard from './RecommendationCard'

export interface RecommendationGridProps {
  title: string
  subtitle?: string
  searchParams?: MediaSearchParams
}

interface RecommendationContentProps {
  searchParams?: MediaSearchParams
}

function RecommendationGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="aspect-2/3 rounded-xl bg-gray-200/10" />
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
  title,
  subtitle,
  searchParams,
}: RecommendationGridProps) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-300 mb-2">
          {title}
        </h1>
        {subtitle && <p className="text-gray-500">{subtitle}</p>}
      </div>

      <FilterBar className="mb-8" />

      <Suspense fallback={<RecommendationGridSkeleton />}>
        <RecommendationGridContent searchParams={searchParams} />
      </Suspense>
    </section>
  )
}
