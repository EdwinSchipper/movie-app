import { RecommendationGrid } from '@/components'
import type { MediaSearchParams } from '@/types'

interface PageProps {
  searchParams: MediaSearchParams
}

export default function Page({ searchParams }: PageProps) {
  return (
    <RecommendationGrid
      heading="Aanbevolen voor jou"
      subheading="Ontdek de beste films en series die bij jouw smaak passen."
      searchParams={searchParams}
    />
  )
}
