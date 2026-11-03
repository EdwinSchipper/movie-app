'use client'

import { useState } from 'react'
import { UIInput } from '@/components/ui'
import SearchResults from './SearchResults'

export interface HeaderSearchProps {
  className?: string
}

export default function HeaderSearch({ className = '' }: HeaderSearchProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[<>]/g, '')
    setQuery(value)
    setIsOpen(value.trim().length > 0)
  }

  const handleSelectResult = () => {
    setQuery('')
    setIsOpen(false)
  }

  return (
    <div className={`relative w-full ${className}`.trim()}>
      <div className="relative w-full">
        <UIInput
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Zoek films en series..."
          className="w-full"
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
