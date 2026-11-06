'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { searchMulti } from '@/lib/tmdb'
import {
  getTmdbImageUrl,
  getMediaDetailHref,
  formatRating,
  formatReleaseYear,
  formatMediaType,
} from '@/lib/utils'
import type { SearchItem, SearchMovieItem } from '@/types'

export interface SearchResultsProps {
  query: string
  onSelect: (item: SearchItem) => void
}

interface SearchResultItemProps {
  item: SearchItem
  onSelect: (item: SearchItem) => void
}

function isMovie(item: SearchItem): item is SearchMovieItem {
  return item.media_type === 'movie'
}

function SearchResultItem({ item, onSelect }: SearchResultItemProps) {
  const isFilm = isMovie(item)
  const title = isFilm ? item.title : item.name
  const date = isFilm ? item.release_date : item.first_air_date
  const year = formatReleaseYear(date, '')
  const detailHref = getMediaDetailHref(item.media_type, item.id)
  const mediaLabel = formatMediaType(item.media_type)
  const posterUrl = getTmdbImageUrl(item.poster_path, 'w200')
  const rating = formatRating(item.vote_average, '')

  return (
    <li>
      <Link
        href={detailHref}
        onClick={() => onSelect(item)}
        className="flex items-center gap-3 p-2.5 hover:bg-surface-hover transition-colors group"
      >
        <div className="relative w-10 h-14 bg-canvas rounded-control overflow-hidden shrink-0 border border-border-subtle">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={title || 'Poster'}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-fg-muted">
              Geen
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-fg-primary truncate group-hover:text-brand transition-colors">
            {title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={isFilm ? 'badge-brand text-2xs' : 'badge-violet text-2xs'}>
              {mediaLabel}
            </span>
            {year && (
              <span className="label-meta">
                {year}
              </span>
            )}
            {rating && (
              <span className="text-xs text-brand font-medium">
                ★ {rating}
              </span>
            )}
          </div>
        </div>
      </Link>
    </li>
  )
}

export default function SearchResults({
  query,
  onSelect,
}: SearchResultsProps) {
  const [results, setResults] = useState<SearchItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false
    const trimmed = query.trim()
    if (!trimmed) {
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await searchMulti(trimmed)
        if (!isCancelled) {
          setResults(data)
        }
      } catch {
        if (!isCancelled) {
          setError('Er is een fout opgetreden bij het ophalen van resultaten.')
          setResults([])
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }, 300)

    return () => {
      isCancelled = true
      clearTimeout(timeoutId)
    }
  }, [query])

  if (!query.trim()) {
    return null
  }

  return (
    <div className="absolute left-0 right-0 mt-2 bg-surface rounded-card shadow-xl border border-border-subtle max-h-96 overflow-y-auto z-50">
      {isLoading && results.length > 0 && (
        <div className="px-3 py-1 bg-canvas text-[11px] text-fg-muted border-b border-border-subtle flex items-center justify-between">
          <span>Zoeken wordt bijgewerkt...</span>
          <span className="animate-spin text-xs">⏳</span>
        </div>
      )}

      {error ? (
        <div className="p-4 text-center text-sm text-accent-coral">
          {error}
        </div>
      ) : isLoading && results.length === 0 ? (
        <div className="p-4 text-center text-sm text-fg-muted animate-pulse">
          Zoeken naar &ldquo;{query}&rdquo;...
        </div>
      ) : results.length > 0 ? (
        <ul className={`divide-y divide-border-subtle transition-opacity ${isLoading ? 'opacity-60' : 'opacity-100'}`}>
          {results.map((item) => (
            <SearchResultItem
              key={`${item.media_type}-${item.id}`}
              item={item}
              onSelect={onSelect}
            />
          ))}
        </ul>
      ) : !isLoading ? (
        <div className="p-4 text-center text-sm text-fg-muted">
          Geen films of series gevonden voor &ldquo;{query}&rdquo;
        </div>
      ) : null}
    </div>
  )
}
