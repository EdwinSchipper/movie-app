import { TvDetail } from '@/components'

interface TvPageProps {
  params: Promise<{ id: string }>
}

export default function TvPage({ params }: TvPageProps) {
  return <TvDetail params={params} />
}
