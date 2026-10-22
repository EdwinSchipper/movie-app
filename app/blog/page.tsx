import TrendingMovies from "@/components/TrendingMovies"
import TrendingTv from "@/components/TrendingTv"

export default function Page() {
  return (
    <section>
      <h1 className="p-10 pb-0 text-3xl font-bold">Blog Page</h1>
      <TrendingMovies />
      <TrendingTv />
    </section>
  )
}
