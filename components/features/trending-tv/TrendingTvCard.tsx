import Image from 'next/image'
import Link from 'next/link'
import { getTmdbImageUrl, getMediaDetailHref } from '@/lib/utils'
import type { TvShow } from '@/types'

export interface TrendingTvCardProps {
  show: TvShow
}

export default function TrendingTvCard({ show }: TrendingTvCardProps) {
  const detailHref = getMediaDetailHref('tv', show.id)
  const posterUrl = getTmdbImageUrl(show.poster_path, 'w500')

  return (
    <Link href={detailHref} className="group block">
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-tile bg-surface-hover shadow-xs">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={show.name}
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

      <h3 className="mt-2 h5 line-clamp-1 group-hover:text-brand transition-colors">
        {show.name}
      </h3>
    </Link>
  )
}
