'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { UIswitch } from '@/components/ui'
import { getTrendingTv } from '@/lib/tmdb'
import type { TimeWindow, TvShow } from '@/types'

export default function TrendingTvClient({ initialShows = [] }: { initialShows?: TvShow[] }) {
  const [range, setRange] = useState<TimeWindow>('day')
  const [shows, setShows] = useState<TvShow[]>(initialShows)

  const handleToggle = async (nextRange: TimeWindow) => {
    setRange(nextRange) // 1. Werk de geselecteerde tijdspanne bij in de lokale state voor de UI
    const data = await getTrendingTv(nextRange) // 2. Haal via de Server Action asynchroon de nieuwe trending series op van TMDB
    setShows(data) // 3. Update de weergavelijst in de state
  }

  return (
    <div className="p-10">
      <div className="flex items-center justify-start gap-5 pb-6">
        <h2 className="text-2xl font-bold">Trending TV Series</h2>
        <UIswitch
          value={range}
          onChange={handleToggle}
        />
      </div>

      <ul className="grid grid-cols-10 gap-4 container">
        {shows.map((tv) => (
          <li key={tv.id}>
            <Link href={`/tv/${tv.id}`} className="group block">
              {tv.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                  alt={tv.name}
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
              <p className="mt-2 text-sm font-medium line-clamp-1 group-hover:text-blue-600 transition-colors">{tv.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
