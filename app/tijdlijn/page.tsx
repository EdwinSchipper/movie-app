import type { Metadata } from 'next'
import { ArchitectureTimeline } from '@/components/features'

export const metadata: Metadata = {
  title: 'Dataflow | Movie App',
  description:
    'Interactieve dataflow van component-aanroepen, Suspense boundaries, parallelle Promises, React.cache() deduplicatie en Auth Short-Circuiting per route.',
}

export default function TimelinePage() {
  return <ArchitectureTimeline />
}
