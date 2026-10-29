'use client'

import { useState, useTransition } from 'react'
import { UISwitch } from '@/components/ui'
import { getTrendingTv } from '@/lib/tmdb'
import type { TimeWindow, TvShow } from '@/types'
import TrendingTvCard from './TrendingTvCard'

export interface TrendingTvClientProps {
  title: string
  initialShows?: TvShow[]
}

export default function TrendingTvClient({
  title,
  initialShows = [],
}: TrendingTvClientProps) {
  const [range, setRange] = useState<TimeWindow>('day')
  const [shows, setShows] = useState<TvShow[]>(initialShows)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (nextRange: TimeWindow) => {
    setRange(nextRange)
    startTransition(async () => {
      const data = await getTrendingTv(nextRange)
      setShows(data)
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
        {shows.map((show) => (
          <TrendingTvCard key={show.id} show={show} />
        ))}
      </div>
    </div>
  )
}
