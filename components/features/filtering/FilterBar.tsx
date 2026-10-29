'use client'

import { Suspense, useTransition } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { UIButton, UISelect } from '@/components/ui'
import {
  MEDIA_TYPE_OPTIONS,
  SORT_ORDER_OPTIONS,
  PERIOD_OPTIONS,
  DEFAULT_MEDIA_FILTERS,
  parseMediaFilters,
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

function FilterBarSkeleton({ className = '' }: FilterBarProps) {
  return (
    <section className={`px-4 py-2 rounded-xl bg-gray-200/5 ${className}`.trim()}>
      <div className="flex flex-wrap items-end gap-3 sm:gap-4 py-4 animate-pulse">
        <div className="w-36 h-14 bg-gray-200/10 rounded-lg" />
        <div className="w-44 h-14 bg-gray-200/10 rounded-lg" />
        <div className="w-48 h-14 bg-gray-200/10 rounded-lg" />
      </div>
    </section>
  )
}

function FilterBarContent({ className = '' }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const activeFilters = parseMediaFilters({
    type: searchParams.get('type') ?? undefined,
    sort: searchParams.get('sort') ?? undefined,
    period: searchParams.get('period') ?? undefined,
  })

  const hasActiveFilters =
    activeFilters.type !== DEFAULT_MEDIA_FILTERS.type ||
    activeFilters.sort !== DEFAULT_MEDIA_FILTERS.sort ||
    activeFilters.period !== DEFAULT_MEDIA_FILTERS.period

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
    <section className={`relative z-20 px-4 py-2 rounded-xl bg-gray-200/5 ${className}`.trim()}>
      <div className="flex flex-wrap items-end gap-3 sm:gap-4 py-4">
        <UISelect<FilterMediaType>
          label="Type"
          value={activeFilters.type}
          options={MEDIA_TYPE_OPTIONS}
          onChange={(val) => updateParam('type', val)}
          className="w-36"
        />

        <UISelect<FilterSortOrder>
          label="Sorteer op datum"
          value={activeFilters.sort}
          options={SORT_ORDER_OPTIONS}
          onChange={(val) => updateParam('sort', val)}
          className="w-44"
        />

        <UISelect<FilterPeriod>
          label="Periode / Aantal"
          value={activeFilters.period}
          options={PERIOD_OPTIONS}
          onChange={(val) => updateParam('period', val)}
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
    </section>
  )
}

export default function FilterBar(props: FilterBarProps) {
  const pathname = usePathname()

  return (
    <Suspense fallback={<FilterBarSkeleton className={props.className} />}>
      <FilterBarContent key={pathname} {...props} />
    </Suspense>
  )
}
