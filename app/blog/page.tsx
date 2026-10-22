import { TrendingTv, TrendingMovies } from "@/components"

export default function Page() {
  return (
    <section>
      <h1 className="p-10 pb-0 text-3xl font-bold">Blog Page</h1>

      <div className="flex space-y-24 flex-col">
        <TrendingTv />
        <TrendingMovies />
      </div>
    </section>
  )
}
