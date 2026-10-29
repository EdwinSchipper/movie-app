import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMovieDetails } from '@/lib/tmdb'
import { isInWatchlist } from '@/lib/watchlist'
import { isInRecommendations } from '@/lib/recommendations'
import { AddToWatchlistBtn, AddToRecommendationsBtn } from '@/components'

interface MoviePageProps {
  params: Promise<{ id: string }>
}

export default function MoviePage({ params }: MoviePageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto animate-pulse">
        <div className="h-4 w-32 bg-gray-200 rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="aspect-2/3 bg-gray-200 rounded-xl" />
          <div className="md:col-span-2 space-y-4">
            <div className="h-8 w-2/3 bg-gray-200 rounded" />
            <div className="h-4 w-1/3 bg-gray-200 rounded" />
            <div className="h-24 w-full bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    }>
      <MovieContent params={params} />
    </Suspense>
  )
}

async function MovieContent({ params }: MoviePageProps) {
  const { id } = await params

  let movie
  try {
    movie = await getMovieDetails(id)
  } catch {
    notFound()
  }

  const [initialInWatchlist, initialInRecommendations] = await Promise.all([
    isInWatchlist(movie.id, 'movie'),
    isInRecommendations(movie.id, 'movie'),
  ])

  return (
    <article className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto">
      <Link
        href="/trending"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors"
      >
        ← Terug naar overzicht
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="relative aspect-2/3 w-full rounded-xl overflow-hidden shadow-lg bg-gray-100">
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Geen afbeelding
            </div>
          )}
        </div>

        <div className="md:col-span-2 flex flex-col justify-start">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            {movie.title}
          </h1>

          {movie.tagline && (
            <p className="text-lg italic text-gray-500 mb-4">&ldquo;{movie.tagline}&rdquo;</p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-6">
            {movie.release_date && (
              <span>📅 {new Date(movie.release_date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            )}
            {movie.runtime && (
              <span>⏱️ {Math.floor(movie.runtime / 60)}u {movie.runtime % 60}m</span>
            )}
            {movie.vote_average && movie.vote_average > 0 ? (
              <span className="font-semibold text-yellow-600">⭐ {movie.vote_average.toFixed(1)} / 10</span>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <AddToWatchlistBtn
              item={{
                tmdb_id: movie.id,
                media_type: 'movie',
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
                vote_average: movie.vote_average,
                overview: movie.overview,
              }}
              initialInWatchlist={initialInWatchlist}
            />
            <AddToRecommendationsBtn
              item={{
                tmdb_id: movie.id,
                media_type: 'movie',
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
                vote_average: movie.vote_average,
                overview: movie.overview,
              }}
              initialInRecommendations={initialInRecommendations}
            />
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-2">
            <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
            <p className="text-gray-700 leading-relaxed">
              {movie.overview || 'Geen samenvatting beschikbaar.'}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
