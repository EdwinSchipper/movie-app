import { Suspense } from 'react'
import { getTrendingTv } from '@/lib/tmdb'
import TrendingTvClient from './TrendingTvClient'

export interface TrendingTvProps {
  title: string
}

function TrendingTvSkeleton({ title }: TrendingTvProps) {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between gap-5 pb-6">
        <h2 className="text-2xl font-bold text-gray-200">{title}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="aspect-2/3 rounded-xl bg-gray-200/10" />
        ))}
      </div>
    </div>
  )
}

async function TrendingTvContent({ title }: TrendingTvProps) {
  const initialShows = await getTrendingTv('day')

  return <TrendingTvClient title={title} initialShows={initialShows} />
}

export default function TrendingTv({ title }: TrendingTvProps) {
  return (
    <Suspense fallback={<TrendingTvSkeleton title={title} />}>
      <TrendingTvContent title={title} />
    </Suspense>
  )
}
