import { Suspense } from 'react'
import { getRecommendations } from '@/lib/recommendations'
import RecommendationCard from './RecommendationCard'

export interface RecommendationGridProps {
  title: string
  subtitle?: string
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

async function RecommendationGridContent() {
  const recommendations = await getRecommendations()

  if (recommendations.length === 0) {
    return (
      <p className="text-gray-500">
        Er staan nog geen aanbevelingen in de lijst.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
      {recommendations.map((item) => (
        <RecommendationCard key={item.id} item={item} />
      ))}
    </div>
  )
}

export default function RecommendationGrid({
  title,
  subtitle,
}: RecommendationGridProps) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-300 mb-2">
          {title}
        </h1>
        {subtitle && <p className="text-gray-500">{subtitle}</p>}
      </div>

      <Suspense fallback={<RecommendationGridSkeleton />}>
        <RecommendationGridContent />
      </Suspense>
    </section>
  )
}
