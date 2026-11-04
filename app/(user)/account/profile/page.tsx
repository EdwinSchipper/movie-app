import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getUserProfile } from '@/lib/account'
import { AccountProfile } from '@/components/features/account'

function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 sm:p-8">
        <div className="h-6 w-48 bg-gray-800 rounded mb-4" />
        <div className="h-4 w-72 bg-gray-800/60 rounded mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="h-12 bg-gray-800/40 rounded" />
          <div className="h-12 bg-gray-800/40 rounded" />
          <div className="h-12 bg-gray-800/40 rounded" />
          <div className="h-12 bg-gray-800/40 rounded" />
        </div>
      </div>
    </div>
  )
}

async function ProfileContent() {
  const profile = await getUserProfile()

  if (!profile) {
    redirect('/login?next=/account/profile')
  }

  return <AccountProfile profile={profile} />
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  )
}
