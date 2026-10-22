'use client'

import { useState, useEffect, useRef } from 'react'
import { searchMulti, type SearchItem } from '@/lib/tmdb'
import SearchResults from './SearchResults'

export default function HeaderSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // 1. Zoekfunctie: haalt asynchroon data op en vult de array in de state (identiek aan handleToggle)
  const handleSearch = async (searchTerm: string) => {
    const trimmed = searchTerm.trim()
    if (!trimmed) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const data = await searchMulti(trimmed)
      setResults(data) // 3. Update de weergavelijst in de state
      setIsOpen(true)
    } catch (err) {
      console.error('Zoekfout:', err)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // 2. Input change handler: live typen met 300ms debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextQuery = e.target.value
    setQuery(nextQuery)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      handleSearch(nextQuery)
    }, 300)
  }

  // Timer opruimen bij unmount van component
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  // Sluit de resultaten-dropdown wanneer buiten het zoekveld wordt geklikt
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectResult = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setIsOpen(false)
    setQuery('')
  }

  const handleClear = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  return (
    <div className="relative w-full max-w-xs sm:max-w-sm" ref={searchContainerRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.trim() && results.length > 0) setIsOpen(true)
          }}
          placeholder="Zoek films en series..."
          className="w-full px-3 py-1.5 pl-9 text-sm bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400"
        />
        {/* Zoek-icoon */}
        <span className="absolute left-2.5 top-2 text-gray-400 pointer-events-none text-xs">
          🔍
        </span>

        {/* Laad-indicator of wis-knop */}
        {isLoading ? (
          <span className="absolute right-2.5 top-2 text-xs text-gray-400 animate-pulse">
            ...
          </span>
        ) : query ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1.5 text-xs text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
          >
            ✕
          </button>
        ) : null}
      </div>

      {/* Onderliggende zoekresultaten laag */}
      <SearchResults
        results={results}
        isLoading={isLoading}
        query={query}
        isOpen={isOpen}
        onSelect={handleSelectResult}
      />
    </div>
  )
}
