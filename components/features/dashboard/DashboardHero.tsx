import Image from 'next/image'
import Link from 'next/link'
import { UIButton } from '@/components/ui'

export interface DashboardHeroProps {
  title: string
  description: string
  href: string
  buttonText: string
  backdropPath?: string | null
  voteAverage?: number | null
  releaseDate?: string | null
}

export default function DashboardHero({
  title,
  description,
  href,
  buttonText,
  backdropPath,
  voteAverage,
  releaseDate,
}: DashboardHeroProps) {
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gray-900 text-white shadow-lg mb-10 min-h-80 md:min-h-96 flex items-end">
      {backdropPath && (
        <Image
          src={`https://image.tmdb.org/t/p/w1280${backdropPath}`}
          alt={title}
          fill
          sizes="(max-width: 1200px) 100vw, 1152px"
          className="object-cover object-center"
          priority
        />
      )}

      <div className="absolute inset-0 bg-linear-to-t from-gray-950/95 via-gray-950/60 to-transparent" />

      <div className="relative z-10 p-6 md:p-10 max-w-2xl">
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium mb-3">
          <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white">
            🔥 #1 Trending Vandaag
          </span>
          {releaseYear && (
            <span className="text-gray-300">{releaseYear}</span>
          )}
          {voteAverage && voteAverage > 0 ? (
            <span className="text-yellow-400 font-semibold">
              ⭐ {voteAverage.toFixed(1)}
            </span>
          ) : null}
        </div>

        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-3">
          {title}
        </h2>

        <p className="text-sm md:text-base text-gray-200 leading-relaxed line-clamp-3 mb-6">
          {description}
        </p>

        <Link href={href}>
          <UIButton variant="primary" size="lg">
            {buttonText}
          </UIButton>
        </Link>
      </div>
    </div>
  )
}
