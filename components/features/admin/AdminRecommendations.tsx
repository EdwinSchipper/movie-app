'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  MagnifyingGlassIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline'
import { UIButton, UIInput } from '@/components/ui'
import { removeFromRecommendations } from '@/lib/recommendations'
import type { RecommendationItem } from '@/types'

export interface AdminRecommendationsProps {
  initialItems: RecommendationItem[]
}

export default function AdminRecommendations({
  initialItems,
}: AdminRecommendationsProps) {
  const [items, setItems] = useState<RecommendationItem[]>(initialItems)
  const [searchQuery, setSearchQuery] = useState('')
  const [actionItemId, setActionItemId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
  )

  function handleRemove(item: RecommendationItem) {
    setActionItemId(item.id)
    startTransition(async () => {
      const result = await removeFromRecommendations(item.id)
      if (result.success) {
        setItems((prev) => prev.filter((i) => i.id !== item.id))
      }
      setActionItemId(null)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-100">
            Publieke Aanbevelingen Beheren
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Deze gecureerde titels zijn zichtbaar voor alle bezoekers op de pagina Aanbevelingen.
          </p>
        </div>

        <Link
          href="/recommendations"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-700 rounded-lg transition-colors shrink-0"
        >
          <span>Publieke weergave bekijken</span>
          <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 z-10">
            <MagnifyingGlassIcon className="w-4 h-4" />
          </span>
          <UIInput
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Zoek in aanbevelingen op titel..."
            className="pl-9 w-full"
          />
        </div>

        <span className="text-xs text-gray-400">
          {filteredItems.length} van de {items.length} aanbevelingen getoond
        </span>
      </div>

      <div className="bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            Geen aanbevelingen gevonden. Voeg titels toe via media-detailpagina&apos;s met de knop &quot;Aanbevelen&quot;.
          </div>
        ) : (
          <div className="divide-y divide-gray-800/60">
            {filteredItems.map((item) => {
              const detailHref = item.media_type === 'movie' ? `/movies/${item.tmdb_id}` : `/tv/${item.tmdb_id}`
              const isItemBusy = isPending && actionItemId === item.id

              return (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 hover:bg-gray-800/30 transition-colors ${
                    isItemBusy ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <Link href={detailHref} className="relative w-12 h-18 shrink-0 rounded overflow-hidden bg-gray-800">
                      {item.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                          alt={item.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : null}
                    </Link>
                    <div className="min-w-0">
                      <Link
                        href={detailHref}
                        className="font-semibold text-sm text-gray-200 hover:text-blue-400 truncate block transition-colors"
                      >
                        {item.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <span className="capitalize">{item.media_type === 'movie' ? 'Film' : 'Serie'}</span>
                        <span>•</span>
                        <span>{item.release_date?.substring(0, 4) || '—'}</span>
                        {typeof item.vote_average === 'number' && item.vote_average > 0 ? (
                          <>
                            <span>•</span>
                            <span className="text-amber-400 font-medium">★ {item.vote_average.toFixed(1)}</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <UIButton
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemove(item)}
                      disabled={isItemBusy}
                    >
                      Verwijderen
                    </UIButton>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
