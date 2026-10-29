'use client'

import { useState, useTransition } from 'react'
import { UISwitch } from '@/components/ui'
import { getTrendingMovies } from '@/lib/tmdb'
import type { TimeWindow, Movie } from '@/types'
import TrendingMovieCard from './TrendingMovieCard'

export interface TrendingMoviesClientProps {
  title: string
  initialMovies?: Movie[]
}

export default function TrendingMoviesClient({
  title,
  initialMovies = [],
}: TrendingMoviesClientProps) {
  const [range, setRange] = useState<TimeWindow>('day')
  const [movies, setMovies] = useState<Movie[]>(initialMovies)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (nextRange: TimeWindow) => {
    setRange(nextRange)
    startTransition(async () => {
      const data = await getTrendingMovies(nextRange)
      setMovies(data)
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-5 pb-6">
        <h2 className="text-2xl font-bold text-gray-200">{title}</h2>
        <UISwitch
          value={range}
          onChange={handleToggle}
        />
      </div>

      <div
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 transition-opacity ${
          isPending ? 'opacity-60' : 'opacity-100'
        }`}
      >
        {movies.map((movie) => (
          <TrendingMovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
}
