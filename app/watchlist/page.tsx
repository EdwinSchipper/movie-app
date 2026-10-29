import { WatchlistGrid } from '@/components'
import type { MediaSearchParams } from '@/types'

interface PageProps {
  searchParams: MediaSearchParams
}

export default function Page({ searchParams }: PageProps) {
  return (
    <WatchlistGrid
      title="Watchlist"
      subtitle="Ontdek de beste films en series die bij jouw smaak passen."
      searchParams={searchParams}
    />
  )
}
