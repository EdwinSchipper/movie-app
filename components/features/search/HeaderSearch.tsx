'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { UIButton, UIInput } from '@/components/ui'
import SearchResults from './SearchResults'

export interface HeaderSearchProps {
  className?: string
}

export default function HeaderSearch({ className = '' }: HeaderSearchProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[<>]/g, '')
    setQuery(value)
    setIsOpen(value.trim().length > 0)
  }

  const handleSelectResult = () => {
    setQuery('')
    setIsOpen(false)
  }

  const handleClear = () => {
    setQuery('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <div ref={containerRef} className={`relative w-full ${className}`.trim()}>
      <div className="relative w-full">
        <UIInput
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.trim().length > 0) {
              setIsOpen(true)
            }
          }}
          placeholder="Zoek films en series..."
          className="w-full pr-8"
        />
        {query.length > 0 && (
          <UIButton
            type="button"
            variant="outline"
            size="xs"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-pill"
            aria-label="Zoekopdracht wissen"
          >
            <XMarkIcon className="w-3.5 h-3.5" />
          </UIButton>
        )}
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
