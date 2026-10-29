import { TrendingTv, TrendingMovies } from '@/components'

export default function Page() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-300 mb-2">
          Trending
        </h1>
        <p className="text-gray-500">
          Ontdek de populairste films en series van vandaag en deze week.
        </p>
      </div>

      <div className="flex flex-col space-y-20">
        <TrendingMovies title="Trending Movies" />
        <TrendingTv title="Trending TV Series" />
      </div>
    </section>
  )
}
