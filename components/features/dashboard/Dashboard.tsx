import { Suspense } from 'react'
import { getTrendingMovies, getTrendingTv } from '@/lib/tmdb'
import { getAppUser } from '@/lib/auth'
import { getMediaDetailHref, getTmdbImageUrl } from '@/lib/utils'
import DashboardCard, { type DashboardCardProps } from './DashboardCard'
import DashboardHero from './DashboardHero'
import DashboardShowcase, { type DashboardShowcaseItem } from './DashboardShowcase'
import DashboardText from './DashboardText'

export interface DashboardProps {
  heading: string
  subheading?: string
}

function DashboardHeroSkeleton() {
  return (
    <div className="w-full rounded-hero bg-surface border border-border-subtle animate-pulse motion-reduce:animate-none mb-10 min-h-80 md:min-h-96" />
  )
}

function DashboardCardsSkeleton() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse motion-reduce:animate-none">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-52 rounded-card bg-surface border border-border-subtle"
        />
      ))}
    </div>
  )
}

function DashboardShowcaseSkeleton() {
  return (
    <div className="mt-16 w-full space-y-6 animate-pulse motion-reduce:animate-none">
      <div className="aspect-16/9 w-full rounded-card bg-surface" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-20 rounded-control bg-surface-hover" />
        <div className="h-20 rounded-control bg-surface-hover" />
        <div className="h-20 rounded-control bg-surface-hover" />
      </div>
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
      href={getMediaDetailHref('movie', featuredMovie.id)}
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

async function DashboardShowcaseContent() {
  const [movies, tvShows, user] = await Promise.all([
    getTrendingMovies('day'),
    getTrendingTv('day'),
    getAppUser(),
  ])

  const moviesWithBackdrop = movies.filter((movie) => movie.backdrop_path)
  const spotlightFilm = moviesWithBackdrop[1] ?? moviesWithBackdrop[0] ?? movies[0]
  const spotlightSeries = tvShows.find((show) => show.backdrop_path) ?? tvShows[0]
  const spotlightWatchlist =
    moviesWithBackdrop[2] ?? moviesWithBackdrop[0] ?? movies[1] ?? movies[0]

  const showcaseItems: DashboardShowcaseItem[] = [
    {
      id: 'trending-movies',
      tabTitle: 'Trending Films',
      tabDescription:
        'Live overzicht van de best bekeken films van vandaag en deze week via TMDB API v3.',
      imageUrl: getTmdbImageUrl(spotlightFilm?.backdrop_path, 'w1280'),
      imageAlt: spotlightFilm?.title ?? 'Trending films in Movie App',
      badgeLabel: spotlightFilm?.title,
      href: spotlightFilm ? getMediaDetailHref('movie', spotlightFilm.id) : '/trending',
      linkLabel: 'Bekijk film',
    },
    {
      id: 'trending-series',
      tabTitle: 'Populaire Series',
      tabDescription:
        'Ontdek series per seizoen en aflevering met automatische caching en razendsnelle navigatie.',
      imageUrl: getTmdbImageUrl(spotlightSeries?.backdrop_path, 'w1280'),
      imageAlt: spotlightSeries?.name ?? 'Populaire series in Movie App',
      badgeLabel: spotlightSeries?.name,
      href: spotlightSeries ? getMediaDetailHref('tv', spotlightSeries.id) : '/trending',
      linkLabel: 'Bekijk serie',
    },
    {
      id: 'watchlist-recommendations',
      tabTitle: 'Watchlist & Aanraders',
      tabDescription:
        'Bewaar jouw kijktips met persoonlijke status en deel gecureerde aanraders met vrienden.',
      imageUrl: getTmdbImageUrl(spotlightWatchlist?.backdrop_path, 'w1280'),
      imageAlt: spotlightWatchlist?.title ?? 'Persoonlijke watchlist en aanraders',
      badgeLabel: user ? 'Persoonlijke kijklijst' : 'Direct opslaan',
      href: user ? '/watchlist' : '/recommendations',
      linkLabel: user ? 'Open Watchlist' : 'Bekijk Aanbevelingen',
    },
  ]

  return (
    <DashboardShowcase
      className="mt-16"
      variant="plain"
      ariaLabel="Uitgelichte onderdelen van Movie App"
      items={showcaseItems}
    />
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
        <h1 className="h1 mb-2">
          {heading}
        </h1>
        {subheading && <p className="text-fg-secondary">{subheading}</p>}
      </div>

      <Suspense fallback={<DashboardCardsSkeleton />}>
        <DashboardCardsContent />
      </Suspense>

      <DashboardText
        heading="Front-end Ontwikkeling & Next.js"
        description="Ik bouw deze app met veel plezier in Next.js en gebruik hem op dit moment voor presentaties rondom Front-end Ontwikkeling. Het project is nog volop in ontwikkeling, met als doel om de app later ook via Google Play uit te brengen. Het idee is simpel: geen eindeloos scrollen of verloren kijktips in groepschats meer, maar één overzichtelijke plek voor trending films en series, je eigen watchlist en aanraders voor vrienden. Onder de motorkap werkt alles samen via de Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Supabase en de TMDB API."
      />

      <Suspense fallback={<DashboardShowcaseSkeleton />}>
        <DashboardShowcaseContent />
      </Suspense>
    </section>
  )
}
