import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTvDetails } from '@/lib/tmdb'
import { getTmdbImageUrl, formatDate, formatRating } from '@/lib/utils'
import MediaActions from './MediaActions'

export interface TvDetailProps {
  params: Promise<{ id: string }>
}

function TvDetailSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 md:p-12 animate-pulse">
      <div className="h-4 w-32 bg-surface-hover rounded-control mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="aspect-2/3 w-full bg-surface-hover rounded-tile" />
        <div className="md:col-span-2 space-y-4">
          <div className="h-8 w-2/3 bg-surface-hover rounded-control" />
          <div className="h-4 w-1/3 bg-surface-hover rounded-control" />
          <div className="h-24 w-full bg-surface-hover rounded-control" />
        </div>
      </div>
    </div>
  )
}

async function TvDetailContent({ params }: TvDetailProps) {
  const { id } = await params

  let show
  try {
    show = await getTvDetails(id)
  } catch {
    notFound()
  }

  const posterUrl = getTmdbImageUrl(show.poster_path, 'w500')
  const airDateFormatted = formatDate(show.first_air_date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const ratingFormatted = formatRating(show.vote_average)

  return (
    <article className="w-full max-w-6xl mx-auto p-6 md:p-12">
      <Link
        href="/trending"
        className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-brand mb-6 transition-colors"
      >
        ← Terug naar overzicht
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="relative aspect-2/3 w-full rounded-tile overflow-hidden shadow-lg bg-surface border border-border-subtle">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={show.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full text-fg-muted">
              Geen afbeelding
            </div>
          )}
        </div>

        <div className="md:col-span-2 flex flex-col justify-start">
          <h1 className="h1 mb-2">
            {show.name}
          </h1>

          {show.tagline && (
            <p className="text-lg italic text-fg-muted mb-4">&ldquo;{show.tagline}&rdquo;</p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm text-fg-muted mb-6">
            {airDateFormatted !== 'Niet beschikbaar' && (
              <span>
                📅 {airDateFormatted}
              </span>
            )}
            {show.number_of_seasons && (
              <span>
                📺 {show.number_of_seasons}{' '}
                {show.number_of_seasons === 1 ? 'seizoen' : 'seizoenen'}
              </span>
            )}
            {show.number_of_episodes && (
              <span>🎬 {show.number_of_episodes} afleveringen</span>
            )}
            {ratingFormatted !== '—' ? (
              <span className="font-semibold text-brand">
                ★ {ratingFormatted} / 10
              </span>
            ) : null}
          </div>

          <MediaActions
            media={{
              tmdb_id: show.id,
              media_type: 'tv',
              title: show.name,
              poster_path: show.poster_path,
              release_date: show.first_air_date,
              vote_average: show.vote_average,
              overview: show.overview,
            }}
            className="mb-6"
          />

          {show.genres && show.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {show.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="badge-surface"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-2">
            <h2 className="h3 mb-2">Synopsis</h2>
            <p className="text-fg-secondary leading-relaxed">
              {show.overview || 'Geen samenvatting beschikbaar.'}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function TvDetail({ params }: TvDetailProps) {
  return (
    <Suspense fallback={<TvDetailSkeleton />}>
      <TvDetailContent params={params} />
    </Suspense>
  )
}
