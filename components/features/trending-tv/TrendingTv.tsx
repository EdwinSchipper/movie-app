import { getTrendingTv } from '@/lib/tmdb'
import TrendingTvClient from './TrendingTvClient'

export default async function TrendingTv() {
  const initialShows = await getTrendingTv('day')

  return <TrendingTvClient initialShows={initialShows} />
}