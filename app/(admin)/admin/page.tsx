import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import { getAdminUsers } from '@/lib/admin'
import { getRecommendations } from '@/lib/recommendations'
import { AdminDashboard } from '@/components/features/admin'

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-24 bg-surface border border-border-subtle rounded-card" />
        <div className="h-24 bg-surface border border-border-subtle rounded-card" />
        <div className="h-24 bg-surface border border-border-subtle rounded-card" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-48 rounded-card bg-surface border border-border-subtle" />
        <div className="h-48 rounded-card bg-surface border border-border-subtle" />
      </div>
    </div>
  )
}

async function AdminDashboardContent() {
  const [isAuthorized, users, recommendations] = await Promise.all([
    isAdmin(),
    getAdminUsers(),
    getRecommendations(),
  ])

  if (!isAuthorized) {
    notFound()
  }

  return <AdminDashboard users={users} recommendations={recommendations} />
}

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboardContent />
    </Suspense>
  )
}
