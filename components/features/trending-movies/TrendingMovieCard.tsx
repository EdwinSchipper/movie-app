import Image from 'next/image'
import Link from 'next/link'
import type { Movie } from '@/types'

export interface TrendingMovieCardProps {
  movie: Movie
}

export default function TrendingMovieCard({ movie }: TrendingMovieCardProps) {
  return (
    <Link href={`/movies/${movie.id}`} className="group block">
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-xl bg-gray-200/10 shadow-xs">
        {movie.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
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

      <h3 className="mt-2 text-sm font-semibold text-gray-200 line-clamp-1 group-hover:text-blue-500 transition-colors">
        {movie.title}
      </h3>
    </Link>
  )
}

