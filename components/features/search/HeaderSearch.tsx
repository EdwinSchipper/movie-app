'use client'

import { useState } from 'react'
import { UIInput } from '@/components/ui'
import SearchResults from './SearchResults'

export default function HeaderSearch() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState<boolean>(false)

  // Search Input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[<>]/g, '')
    setQuery(value)
    setIsOpen(value.trim().length > 0)
  }

  // OnClick Behaviour
  const handleSelectResult = () => {
    setQuery('')
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
