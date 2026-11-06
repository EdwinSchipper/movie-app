import { Suspense } from 'react'
import { getTrendingTv } from '@/lib/tmdb'
import TrendingTvClient from './TrendingTvClient'

export interface TrendingTvProps {
  heading: string
}

function TrendingTvSkeleton({ heading }: TrendingTvProps) {
  return (
    <div className="w-full animate-pulse">
      <div className="flex items-center justify-between gap-5 pb-6">
        <h2 className="text-2xl font-bold text-gray-200">{heading}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-2/3 w-full rounded-xl bg-gray-200/10" />
            <div className="h-4 w-3/4 rounded bg-gray-200/10" />
          </div>
        ))}
      </div>
    </div>
  )
}

async function TrendingTvContent({ heading }: TrendingTvProps) {
  const initialShows = await getTrendingTv('day')

  return <TrendingTvClient heading={heading} initialShows={initialShows} />
}

export default function TrendingTv({ heading }: TrendingTvProps) {
  return (
    <Suspense fallback={<TrendingTvSkeleton heading={heading} />}>
      <TrendingTvContent heading={heading} />
    </Suspense>
  )
}
