'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { searchMulti } from '@/lib/tmdb'
import type { SearchItem } from '@/types'

export interface SearchResultsProps {
  query: string
  onSelect: (item: SearchItem) => void
}

interface SearchResultItemProps {
  item: SearchItem
  onSelect: (item: SearchItem) => void
}

function SearchResultItem({ item, onSelect }: SearchResultItemProps) {
  const isMovie = item.media_type === 'movie'
  const title = isMovie ? item.title : item.name
  const date = isMovie ? item.release_date : item.first_air_date
  const year = date ? date.split('-')[0] : null
  const detailHref = isMovie ? `/movies/${item.id}` : `/tv/${item.id}`

  return (
    <li>
      <Link
        href={detailHref}
        onClick={() => onSelect(item)}
        className="flex items-center gap-3 p-2.5 hover:bg-gray-50 transition-colors group"
      >
        {/* Miniatuur Poster */}
        <div className="relative w-10 h-14 bg-gray-100 rounded overflow-hidden shrink-0">
          {item.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
              alt={title || 'Poster'}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
              Geen
            </div>
          )}
        </div>

        {/* Titel en Metadata */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${isMovie
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-purple-50 text-purple-700'
                }`}
            >
              {isMovie ? 'Film' : 'Serie'}
            </span>
            {year && (
              <span className="text-xs text-gray-400">
                {year}
              </span>
            )}
            {item.vote_average && item.vote_average > 0 ? (
              <span className="text-xs text-yellow-600 font-medium">
                ⭐ {item.vote_average.toFixed(1)}
              </span>
            ) : null}
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

  // Asynchroon data ophalen op basis van de query met een 300ms debounce en race-condition beveiliging
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
      } catch (err) {
        if (!isCancelled) {
          console.error('Zoekfout:', err)
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
    <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 max-h-96 overflow-y-auto z-50">
      {/* Subtiele indicator wanneer een bestaande lijst wordt bijgewerkt */}
      {isLoading && results.length > 0 && (
        <div className="px-3 py-1 bg-gray-50 text-[11px] text-gray-400 border-b border-gray-100 flex items-center justify-between">
          <span>Zoeken wordt bijgewerkt...</span>
          <span className="animate-spin text-xs">⏳</span>
        </div>
      )}

      {error ? (
        <div className="p-4 text-center text-sm text-red-500">
          {error}
        </div>
      ) : isLoading && results.length === 0 ? (
        <div className="p-4 text-center text-sm text-gray-500 animate-pulse">
          Zoeken naar &ldquo;{query}&rdquo;...
        </div>
      ) : results.length > 0 ? (
        <ul className={`divide-y divide-gray-100 transition-opacity ${isLoading ? 'opacity-60' : 'opacity-100'}`}>
          {results.map((item) => (
            <SearchResultItem
              key={`${item.media_type}-${item.id}`}
              item={item}
              onSelect={onSelect}
            />
          ))}
        </ul>
      ) : !isLoading ? (
        <div className="p-4 text-center text-sm text-gray-500">
          Geen films of series gevonden voor &ldquo;{query}&rdquo;
        </div>
      ) : null}
    </div>
  )
}
