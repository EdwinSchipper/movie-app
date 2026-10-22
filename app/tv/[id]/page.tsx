import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTvDetails } from '@/lib/tmdb'

interface TvPageProps {
  params: Promise<{ id: string }>
}

export default function TvDetailPage({ params }: TvPageProps) {
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
      <TvContent params={params} />
    </Suspense>
  )
}

async function TvContent({ params }: TvPageProps) {
  const { id: tvId } = await params

  let show
  try {
    show = await getTvDetails(tvId)
  } catch {
    notFound()
  }

  return (
    <article className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors"
      >
        ← Terug naar overzicht
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="relative aspect-2/3 w-full rounded-xl overflow-hidden shadow-lg bg-gray-100">
          {show.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
              alt={show.name}
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
            {show.name}
          </h1>

          {show.tagline && (
            <p className="text-lg italic text-gray-500 mb-4">&ldquo;{show.tagline}&rdquo;</p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-6">
            {show.first_air_date && (
              <span>📅 {new Date(show.first_air_date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            )}
            {show.number_of_seasons && (
              <span>📺 {show.number_of_seasons} {show.number_of_seasons === 1 ? 'seizoen' : 'seizoenen'}</span>
            )}
            {show.number_of_episodes && (
              <span>🎬 {show.number_of_episodes} afleveringen</span>
            )}
            {show.vote_average > 0 && (
              <span className="font-semibold text-yellow-600">⭐ {show.vote_average.toFixed(1)} / 10</span>
            )}
          </div>

          {show.genres?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {show.genres.map((g) => (
                <span
                  key={g.id}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                >
                  {g.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-2">
            <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
            <p className="text-gray-700 leading-relaxed">
              {show.overview || 'Geen samenvatting beschikbaar.'}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
