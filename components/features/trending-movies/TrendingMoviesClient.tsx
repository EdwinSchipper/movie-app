'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { UISwitch } from '@/components/ui'
import { getTrendingMovies } from '@/lib/tmdb'
import type { TimeWindow, Movie } from '@/types'

export interface TrendingMoviesClientProps {
  initialMovies?: Movie[]
}

export default function TrendingMoviesClient({
  initialMovies = [],
}: TrendingMoviesClientProps) {
  const [range, setRange] = useState<TimeWindow>('day')
  const [movies, setMovies] = useState<Movie[]>(initialMovies)

  const handleToggle = async (nextRange: TimeWindow) => {
    setRange(nextRange)
    const data = await getTrendingMovies(nextRange)
    setMovies(data)
  }

  return (
    <div className="p-10">
      <div className="flex items-center justify-start gap-5 pb-6">
        <h2 className="text-2xl font-bold">Trending Movies</h2>
        <UISwitch
          value={range}
          onChange={handleToggle}
        />
      </div>

      <ul className="grid grid-cols-10 gap-4 container">
        {movies.map((movie) => (
          <li key={movie.id}>
            <Link href={`/movies/${movie.id}`} className="group block">
              {movie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={300}
                  height={450}
                  className="w-full h-auto rounded-md transition-transform duration-200 group-hover:scale-105"
                  loading="eager"
                />
              ) : (
                <div className="w-full aspect-2/3 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                  Geen afbeelding
                </div>
              )}
              <p className="mt-2 text-sm font-medium line-clamp-1 group-hover:text-blue-600 transition-colors">
                {movie.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
