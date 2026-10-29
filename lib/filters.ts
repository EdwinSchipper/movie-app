import type {
  FilterMediaType,
  FilterOption,
  FilterPeriod,
  FilterSortOrder,
  FilterableMediaItem,
  MediaFilters,
  RawMediaFilterParams,
} from '@/types'

export const DEFAULT_MEDIA_FILTERS: MediaFilters = {
  type: 'all',
  sort: 'desc',
  period: 'all',
}

export const MEDIA_TYPE_OPTIONS: FilterOption<FilterMediaType>[] = [
  { value: 'all', label: 'Alles' },
  { value: 'movie', label: 'Films' },
  { value: 'tv', label: 'Series' },
]

export const SORT_ORDER_OPTIONS: FilterOption<FilterSortOrder>[] = [
  { value: 'desc', label: 'Nieuwste eerst' },
  { value: 'asc', label: 'Oudste eerst' },
]

export const PERIOD_OPTIONS: FilterOption<FilterPeriod>[] = [
  { value: 'all', label: 'Alle datums' },
  { value: 'last_month', label: 'Afgelopen maand' },
  { value: 'this_year', label: 'Dit jaar' },
  { value: 'last_year', label: 'Vorig jaar' },
  { value: 'last_10', label: 'Laatste 10 titels' },
]

export function parseMediaFilters(
  params?: RawMediaFilterParams | null
): MediaFilters {
  const rawType = typeof params?.type === 'string' ? params.type : ''
  const rawSort = typeof params?.sort === 'string' ? params.sort : ''
  const rawPeriod = typeof params?.period === 'string' ? params.period : ''

  const type: FilterMediaType =
    rawType === 'movie' || rawType === 'tv' ? rawType : DEFAULT_MEDIA_FILTERS.type

  const sort: FilterSortOrder =
    rawSort === 'asc' || rawSort === 'desc' ? rawSort : DEFAULT_MEDIA_FILTERS.sort

  const period: FilterPeriod =
    rawPeriod === 'last_month' ||
      rawPeriod === 'this_year' ||
      rawPeriod === 'last_year' ||
      rawPeriod === 'last_10'
      ? rawPeriod
      : DEFAULT_MEDIA_FILTERS.period

  return { type, sort, period }
}

export function filterAndSortMedia<T extends FilterableMediaItem>(
  items: T[],
  filters: Partial<MediaFilters> = {}
): T[] {
  const activeFilters: MediaFilters = {
    ...DEFAULT_MEDIA_FILTERS,
    ...filters,
  }

  const now = new Date()
  const oneMonthAgo = new Date(now)
  oneMonthAgo.setMonth(now.getMonth() - 1)
  const oneMonthAgoTime = oneMonthAgo.getTime()
  const nowTime = now.getTime()
  const currentYear = now.getFullYear()

  const result = items
    .filter((item) => {
      if (activeFilters.type !== 'all' && item.media_type !== activeFilters.type) {
        return false
      }

      if (activeFilters.period === 'last_month') {
        if (!item.release_date || !item.release_date.trim()) return false
        const releaseTime = new Date(item.release_date).getTime()
        if (isNaN(releaseTime)) return false
        return releaseTime >= oneMonthAgoTime && releaseTime <= nowTime
      }

      if (activeFilters.period === 'this_year') {
        if (!item.release_date || item.release_date.length < 4) return false
        const year = parseInt(item.release_date.slice(0, 4), 10)
        return year === currentYear
      }

      if (activeFilters.period === 'last_year') {
        if (!item.release_date || item.release_date.length < 4) return false
        const year = parseInt(item.release_date.slice(0, 4), 10)
        return year === currentYear - 1
      }

      return true
    })
    .sort((itemA, itemB) => {
      const timeA = itemA.release_date ? new Date(itemA.release_date).getTime() : NaN
      const timeB = itemB.release_date ? new Date(itemB.release_date).getTime() : NaN

      const isInvalidA = isNaN(timeA)
      const isInvalidB = isNaN(timeB)

      if (isInvalidA && isInvalidB) return 0
      if (isInvalidA) return 1
      if (isInvalidB) return -1

      return activeFilters.sort === 'asc' ? timeA - timeB : timeB - timeA
    })

  if (activeFilters.period === 'last_10') {
    return result.slice(0, 10)
  }

  return result
}
