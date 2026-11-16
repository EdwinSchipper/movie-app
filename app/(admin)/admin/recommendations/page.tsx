import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import { getRecommendations } from '@/lib/recommendations'
import { AdminRecommendations } from '@/components/features/admin'

function AdminRecommendationsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 bg-surface-hover rounded-control max-w-md" />
      <div className="h-64 bg-surface border border-border-subtle rounded-card" />
    </div>
  )
}

async function AdminRecommendationsContent() {
  const [isAuthorized, recommendations] = await Promise.all([
    isAdmin(),
    getRecommendations(),
  ])

  if (!isAuthorized) {
    notFound()
  }

  return <AdminRecommendations initialItems={recommendations} />
}

export default function AdminRecommendationsPage() {
  return (
    <Suspense fallback={<AdminRecommendationsSkeleton />}>
      <AdminRecommendationsContent />
    </Suspense>
  )
}
