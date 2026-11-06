import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMovieDetails } from '@/lib/tmdb'
import { getTmdbImageUrl, formatDate, formatRating, formatRuntime } from '@/lib/utils'
import MediaActions from './MediaActions'

export interface MovieDetailProps {
  params: Promise<{ id: string }>
}

function MovieDetailSkeleton() {
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

async function MovieDetailContent({ params }: MovieDetailProps) {
  const { id } = await params

  let movie
  try {
    movie = await getMovieDetails(id)
  } catch {
    notFound()
  }

  const posterUrl = getTmdbImageUrl(movie.poster_path, 'w500')
  const releaseFormatted = formatDate(movie.release_date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const ratingFormatted = formatRating(movie.vote_average)
  const runtimeFormatted = formatRuntime(movie.runtime)

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
              alt={movie.title}
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
            {movie.title}
          </h1>

          {movie.tagline && (
            <p className="text-lg italic text-fg-muted mb-4">&ldquo;{movie.tagline}&rdquo;</p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm text-fg-muted mb-6">
            {releaseFormatted !== 'Niet beschikbaar' && (
              <span>
                📅 {releaseFormatted}
              </span>
            )}
            {runtimeFormatted && (
              <span>
                ⏱️ {runtimeFormatted}
              </span>
            )}
            {ratingFormatted !== '—' ? (
              <span className="font-semibold text-brand">
                ★ {ratingFormatted} / 10
              </span>
            ) : null}
          </div>

          <MediaActions
            media={{
              tmdb_id: movie.id,
              media_type: 'movie',
              title: movie.title,
              poster_path: movie.poster_path,
              release_date: movie.release_date,
              vote_average: movie.vote_average,
              overview: movie.overview,
            }}
            className="mb-6"
          />

          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((genre) => (
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
              {movie.overview || 'Geen samenvatting beschikbaar.'}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function MovieDetail({ params }: MovieDetailProps) {
  return (
    <Suspense fallback={<MovieDetailSkeleton />}>
      <MovieDetailContent params={params} />
    </Suspense>
  )
}
