import { MovieDetail } from '@/components'

interface MoviePageProps {
  params: Promise<{ id: string }>
}

export default function MoviePage({ params }: MoviePageProps) {
  return <MovieDetail params={params} />
}
