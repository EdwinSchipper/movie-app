export type FilterMediaType = 'all' | 'movie' | 'tv'

export type FilterSortOrder = 'desc' | 'asc'

export type FilterPeriod = 'all' | 'last_month' | 'this_year' | 'last_15'

export interface MediaFilters {
  type: FilterMediaType
  sort: FilterSortOrder
  period: FilterPeriod
}

export interface FilterOption<T extends string = string> {
  value: T
  label: string
}

export interface FilterableMediaItem {
  media_type: 'movie' | 'tv'
  release_date?: string | null
}

