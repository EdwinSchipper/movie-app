import { Suspense } from 'react'
import { getTrendingMovies } from '@/lib/tmdb'
import { getAppUser } from '@/lib/auth'
import DashboardCard, { type DashboardCardProps } from './DashboardCard'
import DashboardHero from './DashboardHero'

export interface DashboardProps {
  heading: string
  subheading?: string
}

function DashboardHeroSkeleton() {
  return (
    <div className="w-full rounded-2xl bg-gray-200 animate-pulse mb-10 min-h-80 md:min-h-96" />
  )
}

function DashboardCardsSkeleton() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-52 rounded-xl bg-gray-200/10" />
      ))}
    </div>
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

async function DashboardCardsContent() {
  const user = await getAppUser()

  const dashboardItems: DashboardCardProps[] = [
    {
      heading: 'Trending',
      description: 'Ontdek welke films en series vandaag en deze week het populairst zijn.',
      href: '/trending',
      buttonText: 'Bekijk Trending',
    },
    {
      heading: 'Aanbevelingen',
      description: 'Bekijk de gedeelde lijst met film- en serie-aanraders voor vrienden.',
      href: '/recommendations',
      buttonText: 'Bekijk Aanbevelingen',
    },
    {
      heading: 'Watchlist',
      description: 'Beheer jouw persoonlijke lijst met films en series die je nog wilt zien.',
      href: user ? '/watchlist' : '/login?next=/watchlist',
      buttonText: user ? 'Open Watchlist' : 'Inloggen voor Watchlist',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {dashboardItems.map((item) => (
        <DashboardCard
          key={item.href}
          heading={item.heading}
          description={item.description}
          href={item.href}
          buttonText={item.buttonText}
        />
      ))}
    </div>
  )
}

export default function Dashboard({
  heading,
  subheading,
}: DashboardProps) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-20">
      <Suspense fallback={<DashboardHeroSkeleton />}>
        <DashboardHeroContent />
      </Suspense>

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-300 mb-2">
          {heading}
        </h1>
        {subheading && <p className="text-gray-500">{subheading}</p>}
      </div>

      <Suspense fallback={<DashboardCardsSkeleton />}>
        <DashboardCardsContent />
      </Suspense>
    </section>
  )
}
