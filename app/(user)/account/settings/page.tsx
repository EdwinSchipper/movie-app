import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getUserProfile } from '@/lib/account'
import { AccountSettings } from '@/components/features/account'

function SettingsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 sm:p-8">
        <div className="h-6 w-52 bg-gray-800 rounded mb-4" />
        <div className="h-4 w-80 bg-gray-800/60 rounded mb-8" />
        <div className="space-y-6">
          <div className="h-16 bg-gray-800/40 rounded" />
          <div className="h-24 bg-gray-800/40 rounded" />
        </div>
      </div>
    </div>
  )
}

async function SettingsContent() {
  const profile = await getUserProfile()

  if (!profile) {
    redirect('/login?next=/account/settings')
  }

  return (
    <AccountSettings
      initialSettings={{
        tile_count_preference: profile.tile_count_preference,
        tile_display_mode: profile.tile_display_mode,
      }}
    />
  )
}

export default function AccountSettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsContent />
    </Suspense>
  )
}
