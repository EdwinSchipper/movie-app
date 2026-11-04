import Image from 'next/image'
import Link from 'next/link'
import { TrashIcon } from '@heroicons/react/24/outline'
import { UIButton, UISelect, type UISelectOption } from '@/components/ui'
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
  const detailHref =
    item.media_type === 'movie'
      ? `/movies/${item.tmdb_id}`
      : `/tv/${item.tmdb_id}`

  return (
    <article
      className={`group bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden transition-all hover:border-gray-700 ${isRow
          ? 'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4'
          : 'flex flex-col'
        } ${isBusy ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className={isRow ? 'flex items-center gap-4 min-w-0' : 'contents'}>
        <Link
          href={detailHref}
          className={
            isRow
              ? 'relative w-12 h-18 shrink-0 rounded overflow-hidden bg-gray-800'
              : 'relative aspect-2/3 w-full overflow-hidden bg-gray-800'
          }
        >
          {item.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/${isRow ? 'w200' : 'w500'}${item.poster_path}`}
              alt={item.title}
              fill
              sizes={isRow ? '48px' : '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw'}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-gray-500">
              {isRow ? '—' : 'Geen poster'}
            </div>
          )}
          {!isRow ? (
            <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-2xs font-semibold bg-gray-950/80 backdrop-blur-xs text-gray-300 border border-gray-800">
              {item.media_type === 'movie' ? 'Film' : 'Serie'}
            </span>
          ) : null}
        </Link>

        <div
          className={
            isRow
              ? 'min-w-0'
              : 'p-3 pb-0 flex-1 flex flex-col justify-between'
          }
        >
          <h3
            className={`font-semibold text-gray-200 hover:text-blue-400 transition-colors ${isRow ? 'text-sm truncate' : 'text-xs sm:text-sm line-clamp-1'
              }`}
          >
            <Link href={detailHref} title={item.title}>
              {item.title}
            </Link>
          </h3>
          <div
            className={`flex items-center gap-2 mt-1 text-gray-400 ${isRow ? 'text-xs' : 'text-2xs'
              }`}
          >
            {isRow ? (
              <>
                <span>{item.media_type === 'movie' ? 'Film' : 'Serie'}</span>
                <span>•</span>
              </>
            ) : null}
            <span>{item.release_date?.substring(0, 4) || '—'}</span>
            {typeof item.vote_average === 'number' && item.vote_average > 0 ? (
              <>
                {isRow ? <span>•</span> : null}
                <span className="text-amber-400 font-medium">
                  ★ {item.vote_average.toFixed(1)}
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
            : 'p-3 pt-2 mt-2 border-t border-gray-800/80 flex flex-col gap-1.5'
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
          {isRow ? <TrashIcon className="w-4 h-4" /> : 'Verwijderen'}
        </UIButton>
      </div>
    </article>
  )
}

