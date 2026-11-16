import { TrendingTv, TrendingMovies } from '@/components'

export default function Page() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-20">
      <div className="mb-10">
        <h1 className="h1 mb-2">
          Trending
        </h1>
        <p className="text-fg-secondary">
          Ontdek de populairste films en series van vandaag en deze week.
        </p>
      </div>

      <div className="flex flex-col space-y-20">
        <TrendingMovies heading="Trending Movies" />
        <TrendingTv heading="Trending TV Series" />
      </div>
    </section>
  )
}
