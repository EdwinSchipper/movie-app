'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Squares2X2Icon,
  Bars3Icon,
  TrashIcon,
  BookmarkSlashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { UIButton, UISelect, type UISelectOption } from '@/components/ui'
import { updateWatchlistStatus, removeFromWatchlist } from '@/lib/watchlist'
import type {
  WatchlistItem,
  WatchlistStatus,
  TileDisplayMode,
} from '@/types'

export type WatchlistSegment = 'all' | 'not_watched' | 'watched'

export interface AccountWatchlistProps {
  initialItems: WatchlistItem[]
  defaultDisplayMode?: TileDisplayMode
  defaultTileLimit?: number
}

const statusOptions: UISelectOption<WatchlistStatus>[] = [
  { value: 'want_to_watch', label: 'Nog te bekijken' },
  { value: 'watching', label: 'Aan het kijken' },
  { value: 'watched', label: 'Bekeken' },
]

export default function AccountWatchlist({
  initialItems,
  defaultDisplayMode = 'grid',
  defaultTileLimit = 20,
}: AccountWatchlistProps) {
  const [items, setItems] = useState<WatchlistItem[]>(initialItems)
  const [segment, setSegment] = useState<WatchlistSegment>('all')
  const [displayMode, setDisplayMode] = useState<TileDisplayMode>(defaultDisplayMode)
  const [actionItemId, setActionItemId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const allCount = items.length
  const notWatchedCount = items.filter(
    (item) => item.status === 'want_to_watch' || item.status === 'watching'
  ).length
  const watchedCount = items.filter((item) => item.status === 'watched').length

  const segmentTabs: { value: WatchlistSegment; label: string; count: number }[] = [
    { value: 'all', label: 'Overzicht (Alle)', count: allCount },
    { value: 'not_watched', label: 'Nog te bekijken', count: notWatchedCount },
    { value: 'watched', label: 'Reeds bekeken', count: watchedCount },
  ]

  const filteredItems = items.filter((item) => {
    if (segment === 'watched') {
      return item.status === 'watched'
    }
    if (segment === 'not_watched') {
      return item.status === 'want_to_watch' || item.status === 'watching'
    }
    return true
  })

  const isRow = displayMode === 'row'
  const visibleItems = filteredItems.slice(0, defaultTileLimit)

  function handleStatusChange(item: WatchlistItem, newStatus: WatchlistStatus) {
    if (item.status === newStatus) return

    setErrorMessage(null)
    setActionItemId(item.id)
    startTransition(async () => {
      const result = await updateWatchlistStatus(item.id, newStatus, '/account/watchlist')
      if (result.success) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i))
        )
      } else {
        setErrorMessage(result.error || 'Kon de status niet bijwerken.')
      }
      setActionItemId(null)
    })
  }

  function handleRemove(item: WatchlistItem) {
    setErrorMessage(null)
    setActionItemId(item.id)
    startTransition(async () => {
      const result = await removeFromWatchlist(item.id, '/account/watchlist')
      if (result.success) {
        setItems((prev) => prev.filter((i) => i.id !== item.id))
      } else {
        setErrorMessage(result.error || 'Kon het item niet verwijderen.')
      }
      setActionItemId(null)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div>
          <h2 className="text-xl font-bold text-gray-100">
            Mijn Watchlist
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Beheer en filter jouw persoonlijke kijklijst.
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <UIButton
            type="button"
            variant={displayMode === 'grid' ? 'primary' : 'outline'}
            size="xs"
            onClick={() => setDisplayMode('grid')}
            title="Rasterweergave"
            className="p-1.5"
          >
            <Squares2X2Icon className="w-4 h-4" />
          </UIButton>
          <UIButton
            type="button"
            variant={displayMode === 'row' ? 'primary' : 'outline'}
            size="xs"
            onClick={() => setDisplayMode('row')}
            title="Lijstweergave"
            className="p-1.5"
          >
            <Bars3Icon className="w-4 h-4" />
          </UIButton>
        </div>
      </div>

      {errorMessage ? (
        <div className="p-4 rounded-lg text-sm border flex items-center gap-3 bg-red-950/60 border-red-800/80 text-red-300">
          <XMarkIcon className="w-5 h-5 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {segmentTabs.map((tab) => (
          <UIButton
            key={tab.value}
            type="button"
            variant={segment === tab.value ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSegment(tab.value)}
            className="gap-1.5"
          >
            <span>{tab.label}</span>
            <span className="px-1.5 py-0.5 rounded-full text-2xs bg-gray-950/40 text-gray-200">
              {tab.count}
            </span>
          </UIButton>
        ))}

        <span className="ml-auto text-xs text-gray-500">
          {visibleItems.length} van {filteredItems.length} getoond (max. {defaultTileLimit})
        </span>
      </div>

      {visibleItems.length === 0 ? (
        <div className="text-center py-16 px-4 bg-gray-900/30 border border-gray-800/80 rounded-xl">
          <BookmarkSlashIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-300">
            Geen titels gevonden
          </h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            {segment === 'all'
              ? 'Je watchlist is momenteel leeg. Verken trending films en series om titels toe te voegen!'
              : segment === 'watched'
                ? 'Je hebt nog geen titels gemarkeerd als reeds bekeken.'
                : 'Er staan geen titels klaar om nog te bekijken.'}
          </p>
          <Link href="/trending" className="inline-block mt-4">
            <UIButton variant="primary" size="sm">
              Trending bekijken
            </UIButton>
          </Link>
        </div>
      ) : (
        <div
          className={
            isRow
              ? 'space-y-3'
              : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6'
          }
        >
          {visibleItems.map((item) => {
            const detailHref =
              item.media_type === 'movie'
                ? `/movies/${item.tmdb_id}`
                : `/tv/${item.tmdb_id}`
            const isItemBusy = isPending && actionItemId === item.id

            return (
              <div
                key={item.id}
                className={`group bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden transition-all hover:border-gray-700 ${isRow
                  ? 'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4'
                  : 'flex flex-col'
                  } ${isItemBusy ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className={isRow ? 'flex items-center gap-4 min-w-0' : 'contents'}>
                  <Link
                    href={detailHref}
                    className={
                      isRow
                        ? 'relative w-12 h-18 shrink-0 rounded overflow-hidden bg-gray-800'
                        : 'relative aspect-2/3 w-full overflow-hidden bg-gray-800'
                    }
                  >
                    {item.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/${isRow ? 'w200' : 'w500'}${item.poster_path}`}
                        alt={item.title}
                        fill
                        sizes={isRow ? '48px' : '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw'}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-500">
                        {isRow ? '—' : 'Geen poster'}
                      </div>
                    )}
                    {!isRow ? (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-2xs font-semibold bg-gray-950/80 backdrop-blur-xs text-gray-300 border border-gray-800">
                        {item.media_type === 'movie' ? 'Film' : 'Serie'}
                      </span>
                    ) : null}
                  </Link>

                  <div
                    className={
                      isRow
                        ? 'min-w-0'
                        : 'p-3 pb-0 flex-1 flex flex-col justify-between'
                    }
                  >
                    <Link
                      href={detailHref}
                      className={`font-semibold text-gray-200 hover:text-blue-400 transition-colors ${isRow ? 'text-sm truncate block' : 'text-xs sm:text-sm line-clamp-1'
                        }`}
                      title={item.title}
                    >
                      {item.title}
                    </Link>
                    <div
                      className={`flex items-center gap-2 mt-1 text-gray-400 ${isRow ? 'text-xs' : 'text-2xs'
                        }`}
                    >
                      {isRow ? (
                        <>
                          <span>{item.media_type === 'movie' ? 'Film' : 'Serie'}</span>
                          <span>•</span>
                        </>
                      ) : null}
                      <span>{item.release_date?.substring(0, 4) || '—'}</span>
                      {typeof item.vote_average === 'number' && item.vote_average > 0 ? (
                        <>
                          {isRow ? <span>•</span> : null}
                          <span className="text-amber-400 font-medium">
                            ★ {item.vote_average.toFixed(1)}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div
                  className={
                    isRow
                      ? 'flex items-center gap-3 w-full sm:w-auto justify-end'
                      : 'p-3 pt-2 mt-2 border-t border-gray-800/80 flex flex-col gap-1.5'
                  }
                >
                  <UISelect<WatchlistStatus>
                    value={item.status}
                    options={statusOptions}
                    onChange={(newStatus) => handleStatusChange(item, newStatus)}
                    disabled={isItemBusy}
                    size="sm"
                    className={isRow ? 'w-44' : 'w-full'}
                  />

                  <UIButton
                    type="button"
                    variant="danger"
                    size={isRow ? 'sm' : 'xs'}
                    onClick={() => handleRemove(item)}
                    disabled={isItemBusy}
                    title="Verwijder uit watchlist"
                    className={isRow ? 'p-2' : 'w-full py-1 text-2xs'}
                  >
                    {isRow ? <TrashIcon className="w-4 h-4" /> : 'Verwijderen'}
                  </UIButton>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
