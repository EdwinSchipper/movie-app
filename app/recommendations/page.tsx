import { RecommendationGrid } from '@/components'
import type { MediaSearchParams } from '@/types'

interface PageProps {
  searchParams: MediaSearchParams
}

export default function Page({ searchParams }: PageProps) {
  return (
    <RecommendationGrid
      title="Aanbevolen voor jou"
      subtitle="Ontdek de beste films en series die bij jouw smaak passen."
      searchParams={searchParams}
    />
  )
}
