import Image from 'next/image'
import Link from 'next/link'
import { UIButton } from '@/components/ui'
import { getTmdbImageUrl, formatReleaseYear, formatRating } from '@/lib/utils'

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
  const backdropUrl = getTmdbImageUrl(backdropPath, 'w1280')
  const releaseYear = formatReleaseYear(releaseDate, '')
  const formattedVote = formatRating(voteAverage, '')

  return (
    <div className="relative w-full overflow-hidden rounded-hero bg-surface text-fg-primary shadow-lg mb-10 min-h-80 md:min-h-96 flex items-end border border-border-subtle">
      {backdropUrl && (
        <Image
          src={backdropUrl}
          alt={title}
          fill
          sizes="(max-width: 1200px) 100vw, 1152px"
          className="object-cover object-center"
          priority
        />
      )}

      <div className="absolute inset-0 bg-linear-to-t from-canvas/95 via-canvas/60 to-transparent" />

      <div className="relative z-10 p-6 md:p-10 max-w-2xl">
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium mb-3">
          <span className="badge-brand">
            🔥 #1 Trending Vandaag
          </span>
          {releaseYear && (
            <span className="label-meta">{releaseYear}</span>
          )}
          {formattedVote && (
            <span className="text-brand font-semibold">
              ★ {formattedVote}
            </span>
          )}
        </div>

        <h2 className="h1 mb-3">
          {title}
        </h2>

        <p className="text-sm md:text-base text-fg-secondary leading-relaxed line-clamp-3 mb-6">
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
