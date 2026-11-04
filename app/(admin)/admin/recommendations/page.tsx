import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import { getRecommendations } from '@/lib/recommendations'
import { AdminRecommendations } from '@/components/features/admin'

function AdminRecommendationsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 bg-gray-900/80 rounded-lg max-w-md" />
      <div className="h-64 bg-gray-900/40 rounded-xl" />
    </div>
  )
}

async function AdminRecommendationsContent() {
  const isAuthorized = await isAdmin()

  if (!isAuthorized) {
    notFound()
  }

  const recommendations = await getRecommendations()

  return <AdminRecommendations initialItems={recommendations} />
}

export default function AdminRecommendationsPage() {
  return (
    <Suspense fallback={<AdminRecommendationsSkeleton />}>
      <AdminRecommendationsContent />
    </Suspense>
  )
}
