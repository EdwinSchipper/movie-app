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
import {
  getTmdbImageUrl,
  getMediaDetailHref,
  formatRating,
  formatReleaseYear,
  formatMediaType,
} from '@/lib/utils'
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
          <h2 className="h2">
            Publieke Aanbevelingen Beheren
          </h2>
          <p className="text-sm text-fg-muted mt-1">
            Deze gecureerde titels zijn zichtbaar voor alle bezoekers op de pagina Aanbevelingen.
          </p>
        </div>

        <Link
          href="/recommendations"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-surface hover:bg-surface-hover text-fg-primary border border-border-default rounded-control transition-colors shrink-0"
        >
          <span>Publieke weergave bekijken</span>
          <ArrowTopRightOnSquareIcon className="icon-xs" />
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-fg-muted z-10">
            <MagnifyingGlassIcon className="icon-sm" />
          </span>
          <UIInput
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Zoek in aanbevelingen op titel..."
            className="pl-9 w-full"
          />
        </div>

        <span className="label-meta">
          {filteredItems.length} van de {items.length} aanbevelingen getoond
        </span>
      </div>

      <div className="bg-surface border border-border-subtle rounded-card overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-fg-muted text-sm">
            Geen aanbevelingen gevonden. Voeg titels toe via media-detailpagina&apos;s met de knop &quot;Aanbevelen&quot;.
          </div>
        ) : (
          <div className="divide-y divide-border-subtle">
            {filteredItems.map((item) => {
              const detailHref = getMediaDetailHref(item.media_type, item.tmdb_id)
              const posterUrl = getTmdbImageUrl(item.poster_path, 'w200')
              const formattedYear = formatReleaseYear(item.release_date)
              const formattedVote = formatRating(item.vote_average)
              const mediaLabel = formatMediaType(item.media_type)
              const isItemBusy = isPending && actionItemId === item.id

              return (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 hover:bg-surface-hover transition-colors ${
                    isItemBusy ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <Link href={detailHref} className="relative w-12 h-18 shrink-0 rounded-control overflow-hidden bg-surface-hover">
                      {posterUrl ? (
                        <Image
                          src={posterUrl}
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
                        className="h5 hover:text-brand truncate block transition-colors"
                      >
                        {item.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 label-meta">
                        <span>{mediaLabel}</span>
                        <span>•</span>
                        <span>{formattedYear}</span>
                        {formattedVote !== '—' ? (
                          <>
                            <span>•</span>
                            <span className="text-brand font-semibold">★ {formattedVote}</span>
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
