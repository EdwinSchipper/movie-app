import type { Metadata } from 'next'
import { ArchitectureTimeline } from '@/components/features'

export const metadata: Metadata = {
  title: 'Data stroom | Movie App',
  description:
    'Interactieve data stroom van component-aanroepen, Suspense boundaries, parallelle Promises, React.cache() deduplicatie en Auth Short-Circuiting per route.',
}

export default function TimelinePage() {
  return <ArchitectureTimeline />
}
