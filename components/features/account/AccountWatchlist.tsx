'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  Squares2X2Icon,
  Bars3Icon,
  BookmarkSlashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { UIButton } from '@/components/ui'
import { updateWatchlistStatus, removeFromWatchlist } from '@/lib/watchlist'
import type {
  WatchlistItem,
  WatchlistStatus,
  TileDisplayMode,
} from '@/types'
import AccountWatchlistCard from './AccountWatchlistCard'

export type WatchlistSegment = 'all' | 'not_watched' | 'watched'

export interface AccountWatchlistProps {
  initialItems: WatchlistItem[]
  defaultDisplayMode?: TileDisplayMode
  defaultTileLimit?: number
}

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
          {visibleItems.map((item) => (
            <AccountWatchlistCard
              key={item.id}
              item={item}
              isRow={isRow}
              isBusy={isPending && actionItemId === item.id}
              onStatusChange={(newStatus) => handleStatusChange(item, newStatus)}
              onRemove={() => handleRemove(item)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
