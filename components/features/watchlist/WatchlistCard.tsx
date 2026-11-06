import Image from 'next/image'
import Link from 'next/link'
import { getTmdbImageUrl, getMediaDetailHref } from '@/lib/utils'
import type { WatchlistItem } from '@/types'

export interface WatchlistCardProps {
  item: WatchlistItem
}

export default function WatchlistCard({ item }: WatchlistCardProps) {
  const detailHref = getMediaDetailHref(item.media_type, item.tmdb_id)
  const posterUrl = getTmdbImageUrl(item.poster_path, 'w500')

  return (
    <Link href={detailHref} className="group block">
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-tile bg-surface-hover shadow-xs">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            loading="eager"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-fg-muted">
            Geen afbeelding
          </div>
        )}
      </div>

      <h2 className="mt-2 h5 line-clamp-1 group-hover:text-brand transition-colors">
        {item.title}
      </h2>
    </Link>
  )
}
