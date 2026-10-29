import { Suspense } from 'react'
import { getTrendingMovies } from '@/lib/tmdb'
import DashboardCard, { type DashboardCardProps } from './DashboardCard'
import DashboardHero from './DashboardHero'

export interface DashboardProps {
  title: string
  subtitle?: string
}

const DASHBOARD_ITEMS: DashboardCardProps[] = [
  {
    title: 'Trending',
    description: 'Ontdek welke films en series vandaag en deze week het populairst zijn.',
    href: '/trending',
    buttonText: 'Bekijk Trending',
  },
  {
    title: 'Aanbevelingen',
    description: 'Bekijk de gedeelde lijst met film- en serie-aanraders voor vrienden.',
    href: '/recommendations',
    buttonText: 'Bekijk Aanbevelingen',
  },
  {
    title: 'Watchlist',
    description: 'Beheer jouw persoonlijke lijst met films en series die je nog wilt zien.',
    href: '/watchlist',
    buttonText: 'Open Watchlist',
  },
]

function DashboardHeroSkeleton() {
  return (
    <div className="w-full rounded-2xl bg-gray-200 animate-pulse mb-10 min-h-80 md:min-h-96" />
  )
}

async function DashboardHeroContent() {
  const movies = await getTrendingMovies('day')
  const featuredMovie = movies.find((movie) => movie.backdrop_path) ?? movies[0]

  if (!featuredMovie) {
    return null
  }

  return (
    <DashboardHero
      title={featuredMovie.title}
      description={featuredMovie.overview || 'Bekijk nu de populairste film van vandaag.'}
      href={`/movies/${featuredMovie.id}`}
      buttonText="Bekijk film"
      backdropPath={featuredMovie.backdrop_path}
      voteAverage={featuredMovie.vote_average}
      releaseDate={featuredMovie.release_date}
    />
  )
}

export default function Dashboard({
  title,
  subtitle,
}: DashboardProps) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <Suspense fallback={<DashboardHeroSkeleton />}>
        <DashboardHeroContent />
      </Suspense>

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-300 mb-2">
          {title}
        </h1>
        {subtitle && <p className="text-gray-500">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DASHBOARD_ITEMS.map((item) => (
          <DashboardCard
            key={item.href}
            title={item.title}
            description={item.description}
            href={item.href}
            buttonText={item.buttonText}
          />
        ))}
      </div>
    </section>
  )
}
