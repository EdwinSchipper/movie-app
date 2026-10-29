'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { UIswitch } from '@/components/ui'
import { getTrendingMovies } from '@/lib/tmdb'
import type { TimeWindow, Movie } from '@/types'

export default function TrendingMoviesClient({ initialMovies = [] }: { initialMovies?: Movie[] }) {
  const [range, setRange] = useState<TimeWindow>('day')
  const [movies, setMovies] = useState<Movie[]>(initialMovies)

  const handleToggle = async (nextRange: TimeWindow) => {
    setRange(nextRange) // 1. Werk de geselecteerde tijdspanne bij in de lokale state voor de UI
    const data = await getTrendingMovies(nextRange) // 2. Haal via de Server Action asynchroon de nieuwe trending series op van TMDB
    setMovies(data) // 3. Update de weergavelijst in de state
  }

  return (
    <div className="p-10">
      <div className="flex items-center justify-start gap-5 pb-6">
        <h2 className="text-2xl font-bold">Trending Movies</h2>
        <UIswitch
          value={range}
          onChange={handleToggle}
        />
      </div>

      <ul className="grid grid-cols-10 gap-4 container">
        {movies.map((film) => (
          <li key={film.id}>
            <Link href={`/movies/${film.id}`} className="group block">
              {film.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
                  alt={film.title}
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
              <p className="mt-2 text-sm font-medium line-clamp-1 group-hover:text-blue-600 transition-colors">{film.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
