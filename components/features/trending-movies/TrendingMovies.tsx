import { Suspense } from 'react'
import { getTrendingMovies } from '@/lib/tmdb'
import TrendingMoviesClient from './TrendingMoviesClient'

export interface TrendingMoviesProps {
  heading: string
}

function TrendingMoviesSkeleton({ heading }: TrendingMoviesProps) {
  return (
    <div className="w-full animate-pulse motion-reduce:animate-none">
      <div className="flex items-center justify-between gap-5 pb-6">
        <h2 className="h2">{heading}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-2/3 w-full rounded-tile bg-surface border border-border-subtle" />
            <div className="h-4 w-3/4 rounded-control bg-surface-hover" />
          </div>
        ))}
      </div>
    </div>
  )
}

async function TrendingMoviesContent({ heading }: TrendingMoviesProps) {
  const initialMovies = await getTrendingMovies('day')

  return <TrendingMoviesClient heading={heading} initialMovies={initialMovies} />
}

export default function TrendingMovies({ heading }: TrendingMoviesProps) {
  return (
    <Suspense fallback={<TrendingMoviesSkeleton heading={heading} />}>
      <TrendingMoviesContent heading={heading} />
    </Suspense>
  )
}
