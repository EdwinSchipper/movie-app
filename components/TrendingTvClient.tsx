'use client'

import { useState } from 'react'
import Image from 'next/image'
import { UIswitch } from '@/components/ui'
import { getTrendingTv, type TvShow } from '@/lib/tmdb'

export default function TrendingTvClient({ initialShows = [] }: { initialShows?: TvShow[] }) {
  const [range, setRange] = useState<'day' | 'week'>('day')
  const [shows, setShows] = useState<TvShow[]>(initialShows)

  const handleToggle = async (isWeek: boolean) => {
    const nextRange = isWeek ? 'week' : 'day'
    setRange(nextRange)
    const data = await getTrendingTv(nextRange)
    setShows(data)
  }

  return (
    <div className="p-10">
      <div className="flex items-center justify-start gap-5 pb-6">
        <h2 className="text-2xl font-bold">Trending TV Series</h2>
        <UIswitch
          checked={range === 'week'}
          onChange={handleToggle}
        />
      </div>

      <ul className="grid grid-cols-10 gap-4 container">
        {shows.map((tv) => (
          <li key={tv.id}>
            {tv.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                alt={tv.name}
                width={300}
                height={450}
                className="w-full h-auto rounded-md"
                loading="eager"
              />
            ) : (
              <div className="w-full aspect-2/3 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                Geen afbeelding
              </div>
            )}
            <p className="mt-2 text-sm font-medium line-clamp-1">{tv.name}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
