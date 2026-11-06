import Image from 'next/image'
import Link from 'next/link'
import { TrashIcon } from '@heroicons/react/24/outline'
import { UIButton, UISelect, type UISelectOption } from '@/components/ui'
import {
  getTmdbImageUrl,
  getMediaDetailHref,
  formatRating,
  formatReleaseYear,
  formatMediaType,
} from '@/lib/utils'
import type { WatchlistItem, WatchlistStatus } from '@/types'

export interface AccountWatchlistCardProps {
  item: WatchlistItem
  isRow: boolean
  isBusy: boolean
  onStatusChange: (newStatus: WatchlistStatus) => void
  onRemove: () => void
}

const statusOptions: UISelectOption<WatchlistStatus>[] = [
  { value: 'want_to_watch', label: 'Nog te bekijken' },
  { value: 'watching', label: 'Aan het kijken' },
  { value: 'watched', label: 'Bekeken' },
]

export default function AccountWatchlistCard({
  item,
  isRow,
  isBusy,
  onStatusChange,
  onRemove,
}: AccountWatchlistCardProps) {
  const detailHref = getMediaDetailHref(item.media_type, item.tmdb_id)
  const posterUrl = getTmdbImageUrl(item.poster_path, isRow ? 'w200' : 'w500')
  const formattedYear = formatReleaseYear(item.release_date)
  const formattedVote = formatRating(item.vote_average)
  const mediaLabel = formatMediaType(item.media_type)

  return (
    <article
      className={`group bg-surface border border-border-subtle rounded-card overflow-hidden transition-all hover:border-border-default ${
        isRow
          ? 'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4'
          : 'flex flex-col p-2'
      } ${isBusy ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className={isRow ? 'flex items-center gap-4 min-w-0' : 'contents'}>
        <Link
          href={detailHref}
          className={
            isRow
              ? 'relative w-12 h-18 shrink-0 rounded-control overflow-hidden bg-surface-hover'
              : 'relative aspect-2/3 w-full overflow-hidden rounded-tile bg-surface-hover'
          }
        >
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={item.title}
              fill
              sizes={isRow ? '48px' : '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw'}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-fg-muted">
              {isRow ? '—' : 'Geen poster'}
            </div>
          )}
          {!isRow ? (
            <span className="badge-surface absolute top-2.5 right-2.5 backdrop-blur-md">
              {mediaLabel}
            </span>
          ) : null}
        </Link>

        <div
          className={
            isRow
              ? 'min-w-0'
              : 'p-2.5 pb-1 flex-1 flex flex-col justify-between'
          }
        >
          <h3
            className={`h5 hover:text-brand transition-colors ${
              isRow ? 'truncate' : 'line-clamp-1'
            }`}
          >
            <Link href={detailHref} title={item.title}>
              {item.title}
            </Link>
          </h3>
          <div className="flex items-center gap-2 mt-1 label-meta">
            {isRow ? (
              <>
                <span>{mediaLabel}</span>
                <span>•</span>
              </>
            ) : null}
            <span>{formattedYear}</span>
            {formattedVote !== '—' ? (
              <>
                {isRow ? <span>•</span> : null}
                <span className="text-brand font-semibold">
                  ★ {formattedVote}
                </span>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div
        className={
          isRow
            ? 'flex items-center gap-3 w-full sm:w-auto justify-end'
            : 'p-2.5 pt-2 mt-1 border-t border-border-subtle flex flex-col gap-1.5'
        }
      >
        <UISelect<WatchlistStatus>
          value={item.status}
          options={statusOptions}
          onChange={onStatusChange}
          disabled={isBusy}
          size="sm"
          className={isRow ? 'w-44' : 'w-full'}
        />

        <UIButton
          type="button"
          variant="danger"
          size={isRow ? 'sm' : 'xs'}
          onClick={onRemove}
          disabled={isBusy}
          title="Verwijder uit watchlist"
          className={isRow ? 'p-2' : 'w-full py-1 text-2xs'}
        >
          {isRow ? <TrashIcon className="icon-sm" /> : 'Verwijderen'}
        </UIButton>
      </div>
    </article>
  )
}
