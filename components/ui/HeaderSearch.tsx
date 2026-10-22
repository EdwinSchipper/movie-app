'use client'

import { useState } from 'react'
import type { SearchItem } from '@/lib/tmdb'
import UIInput from './Input'
import SearchResults from './SearchResults'

export default function HeaderSearch() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState<boolean>(false)

  // Register Search Input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '')
    setQuery(sanitized)
    setIsOpen(sanitized.trim().length > 0)
  }

  // Send selected item to SearchResults
  const handleSelectResult = (item: SearchItem) => {
    const selectedTitle = item.title || item.name || ''
    setQuery(selectedTitle)
    setIsOpen(false)
  }

  return (
    <div className="relative w-full max-w-xs sm:max-w-sm">
      <div className="relative">
        <UIInput
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Zoek films en series..."
        />
      </div>

      {isOpen && (
        <SearchResults
          query={query}
          onSelect={handleSelectResult}
        />
      )}
    </div>
  )
}