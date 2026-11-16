import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getUserProfile } from '@/lib/account'
import { getWatchlist } from '@/lib/watchlist'
import { AccountDashboard } from '@/components/features/account'

function AccountDashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-36 rounded-hero bg-surface border border-border-subtle" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-48 rounded-card bg-surface border border-border-subtle" />
        <div className="h-48 rounded-card bg-surface border border-border-subtle" />
        <div className="h-48 rounded-card bg-surface border border-border-subtle" />
      </div>
    </div>
  )
}

async function AccountDashboardContent() {
  const [profile, watchlist] = await Promise.all([
    getUserProfile(),
    getWatchlist(),
  ])

  if (!profile) {
    redirect('/login?next=/account')
  }

  return (
    <AccountDashboard
      profile={profile}
      watchlistItemCount={watchlist.length}
    />
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountDashboardSkeleton />}>
      <AccountDashboardContent />
    </Suspense>
  )
}

