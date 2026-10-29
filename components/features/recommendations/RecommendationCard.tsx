import Image from 'next/image'
import Link from 'next/link'
import type { RecommendationItem } from '@/types'

export interface RecommendationCardProps {
  item: RecommendationItem
}

export default function RecommendationCard({ item }: RecommendationCardProps) {
  const detailHref =
    item.media_type === 'movie'
      ? `/movies/${item.tmdb_id}`
      : `/tv/${item.tmdb_id}`

  return (
    <Link href={detailHref} className="group block">
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-xl bg-gray-200/10 shadow-xs">
        {item.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            loading="eager"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-500">
            Geen afbeelding
          </div>
        )}
      </div>

      <h2 className="mt-2 text-sm font-semibold text-gray-200 line-clamp-1 group-hover:text-blue-500 transition-colors">
        {item.title}
      </h2>
    </Link>
  )
}
