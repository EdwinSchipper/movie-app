import { BookmarkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import type { UserProfile } from '@/types'
import AccountCard from './AccountCard'
import AccountDataList from './AccountDataList'
import AccountRoleBadge from './AccountRoleBadge'

export interface AccountProfileProps {
  profile: UserProfile
}

export default function AccountProfile({ profile }: AccountProfileProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 sm:p-8 backdrop-blur-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-gray-100">
              Profiel & Accountgegevens
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Overzicht van je persoonlijke account en autorisatiestatus.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <AccountRoleBadge role={profile.role} />
          </div>
        </div>

        <AccountDataList profile={profile} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AccountCard
          heading="Watchlist bekijken"
          description="Beheer je bewaarde films en series, gefilterd op bekeken of nog te bekijken."
          href="/account/watchlist"
          buttonText="Naar Watchlist"
          icon={<BookmarkIcon className="w-5 h-5 text-blue-400" />}
        />

        <AccountCard
          heading="Weergave instellen"
          description="Pas het aantal getoonde tiles en de layout (grid of lijst) aan naar wens."
          href="/account/settings"
          buttonText="Naar Instellingen"
          icon={<Cog6ToothIcon className="w-5 h-5 text-blue-400" />}
        />
      </div>
    </div>
  )
}
