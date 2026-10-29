'use client'

import { useTransition } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { UIButton, UISelect } from '@/components/ui'
import {
  MEDIA_TYPE_OPTIONS,
  SORT_ORDER_OPTIONS,
  PERIOD_OPTIONS,
  DEFAULT_MEDIA_FILTERS,
} from '@/lib/filters'
import type {
  FilterMediaType,
  FilterPeriod,
  FilterSortOrder,
  MediaFilters,
} from '@/types'

export interface FilterBarProps {
  className?: string
}

export default function FilterBar({ className = '' }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentType =
    (searchParams.get('type') as FilterMediaType) || DEFAULT_MEDIA_FILTERS.type
  const currentSort =
    (searchParams.get('sort') as FilterSortOrder) || DEFAULT_MEDIA_FILTERS.sort
  const currentPeriod =
    (searchParams.get('period') as FilterPeriod) || DEFAULT_MEDIA_FILTERS.period

  const hasActiveFilters =
    searchParams.has('type') || searchParams.has('sort') || searchParams.has('period')

  const updateParam = (key: keyof MediaFilters, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === DEFAULT_MEDIA_FILTERS[key]) {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    const query = params.toString()
    const targetUrl = query ? `${pathname}?${query}` : pathname

    startTransition(() => {
      router.push(targetUrl, { scroll: false })
    })
  }

  const handleReset = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false })
    })
  }

  return (
    <div
      className={`flex flex-wrap items-end gap-3 sm:gap-4 py-4 ${className}`.trim()}
    >
      <UISelect<FilterMediaType>
        label="Type"
        value={currentType}
        options={MEDIA_TYPE_OPTIONS}
        onChange={(val) => updateParam('type', val)}
        disabled={isPending}
        className="w-36"
      />

      <UISelect<FilterSortOrder>
        label="Sorteer op datum"
        value={currentSort}
        options={SORT_ORDER_OPTIONS}
        onChange={(val) => updateParam('sort', val)}
        disabled={isPending}
        className="w-44"
      />

      <UISelect<FilterPeriod>
        label="Periode / Aantal"
        value={currentPeriod}
        options={PERIOD_OPTIONS}
        onChange={(val) => updateParam('period', val)}
        disabled={isPending}
        className="w-48"
      />

      {hasActiveFilters && (
        <UIButton
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={handleReset}
          className="h-9 mb-0.5 text-xs text-gray-400 hover:text-gray-200"
        >
          Filters wissen
        </UIButton>
      )}
    </div>
  )
}

