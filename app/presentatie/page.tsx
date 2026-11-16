import type { Metadata } from 'next'
import { PresentationOverview } from '@/components/features'

export const metadata: Metadata = {
  title: 'Architectuur & Presentatie | Movie App',
  description:
    'Interactieve projectkaart van alle routes, UI primitives, toegangsscopes, Promises en externe koppelingen binnen Movie App.',
}

export default function PresentationPage() {
  return <PresentationOverview />
}
