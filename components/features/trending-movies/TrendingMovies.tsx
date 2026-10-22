import { getTrendingMovies } from '@/lib/tmdb'
import TrendingMoviesClient from './TrendingMoviesClient'

export default async function TrendingMovies() {
  const initialMovies = await getTrendingMovies('day')

  return <TrendingMoviesClient initialMovies={initialMovies} />
}