'use client'

import { useRef, useState, useTransition } from 'react'
import { UISwitch, useToast } from '@/components/ui'
import { getTrendingTv } from '@/lib/tmdb'
import type { TimeWindow, TvShow } from '@/types'
import TrendingTvCard from './TrendingTvCard'

export interface TrendingTvClientProps {
  heading: string
  initialShows?: TvShow[]
}

export default function TrendingTvClient({
  heading,
  initialShows = [],
}: TrendingTvClientProps) {
  const [range, setRange] = useState<TimeWindow>('day')
  const [shows, setShows] = useState<TvShow[]>(initialShows)
  const [isPending, startTransition] = useTransition()
  const requestIdRef = useRef(0)
  const toast = useToast()

  const handleToggle = (nextRange: TimeWindow) => {
    if (nextRange === range) return

    const previousRange = range
    const requestId = ++requestIdRef.current
    setRange(nextRange)

    startTransition(async () => {
      try {
        const data = await getTrendingTv(nextRange)
        if (requestId === requestIdRef.current) {
          setShows(data)
        }
      } catch {
        if (requestId === requestIdRef.current) {
          setRange(previousRange)
          toast.error('Kon trending series niet bijwerken. Probeer het opnieuw.')
        }
      }
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-5 pb-6">
        <h2 className="text-2xl font-bold text-gray-200">{heading}</h2>
        <UISwitch
          value={range}
          onChange={handleToggle}
        />
      </div>

      <div
        aria-busy={isPending}
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
