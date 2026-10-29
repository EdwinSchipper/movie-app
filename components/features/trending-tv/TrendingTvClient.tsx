'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { UISwitch } from '@/components/ui'
import { getTrendingTv } from '@/lib/tmdb'
import type { TimeWindow, TvShow } from '@/types'

export interface TrendingTvClientProps {
  initialShows?: TvShow[]
}

export default function TrendingTvClient({
  initialShows = [],
}: TrendingTvClientProps) {
  const [range, setRange] = useState<TimeWindow>('day')
  const [shows, setShows] = useState<TvShow[]>(initialShows)

  const handleToggle = async (nextRange: TimeWindow) => {
    setRange(nextRange)
    const data = await getTrendingTv(nextRange)
    setShows(data)
  }

  return (
    <div className="p-10">
      <div className="flex items-center justify-start gap-5 pb-6">
        <h2 className="text-2xl font-bold">Trending TV Series</h2>
        <UISwitch
          value={range}
          onChange={handleToggle}
        />
      </div>

      <ul className="grid grid-cols-10 gap-4 container">
        {shows.map((show) => (
          <li key={show.id}>
            <Link href={`/tv/${show.id}`} className="group block">
              {show.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                  alt={show.name}
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
                {show.name}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
