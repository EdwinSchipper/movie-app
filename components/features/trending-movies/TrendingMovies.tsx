import { Suspense } from 'react'
import { getTrendingMovies } from '@/lib/tmdb'
import TrendingMoviesClient from './TrendingMoviesClient'

export interface TrendingMoviesProps {
  title: string
}

function TrendingMoviesSkeleton({ title }: TrendingMoviesProps) {
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

async function TrendingMoviesContent({ title }: TrendingMoviesProps) {
  const initialMovies = await getTrendingMovies('day')

  return <TrendingMoviesClient title={title} initialMovies={initialMovies} />
}

export default function TrendingMovies({ title }: TrendingMoviesProps) {
  return (
    <Suspense fallback={<TrendingMoviesSkeleton title={title} />}>
      <TrendingMoviesContent title={title} />
    </Suspense>
  )
}