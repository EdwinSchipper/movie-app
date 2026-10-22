import { Suspense } from 'react'
import { TrendingTv, TrendingMovies } from "@/components"

function TrendingSkeleton({ title }: { title: string }) {
  return (
    <div className="p-10 animate-pulse">
      <div className="flex items-center justify-start gap-5 pb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="aspect-2/3 bg-gray-200 rounded-md" />
        ))}
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <section>
      <h1 className="p-10 pb-0 text-3xl font-bold">Trending</h1>

      <div className="flex space-y-24 flex-col">
        <Suspense fallback={<TrendingSkeleton title="Trending TV" />}>
          <TrendingTv />
        </Suspense>
        <Suspense fallback={<TrendingSkeleton title="Trending Movies" />}>
          <TrendingMovies />
        </Suspense>
      </div>
    </section>
  )
}
