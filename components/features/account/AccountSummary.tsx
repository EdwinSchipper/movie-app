import type { UserProfile } from '@/types'
import AccountRoleBadge from './AccountRoleBadge'

export interface AccountSummaryProps {
  profile: UserProfile
  watchlistItemCount?: number
}

export default function AccountSummary({
  profile,
  watchlistItemCount,
}: AccountSummaryProps) {
  const registeredDate = profile.created_at
    ? new Intl.DateTimeFormat('nl-NL', {
        dateStyle: 'long',
      }).format(new Date(profile.created_at))
    : 'Onbekend'

  const initial = profile.email.charAt(0).toUpperCase()

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-linear-to-r from-gray-900 via-gray-900/90 to-gray-950 p-6 sm:p-8 backdrop-blur-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20 shrink-0">
            {initial}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
                {profile.email}
              </h2>
              <AccountRoleBadge role={profile.role} />
            </div>
            <p className="text-xs text-gray-400">
              Lid sinds {registeredDate} • Voorkeur: {profile.tile_count_preference || 20} tiles ({profile.tile_display_mode === 'row' ? 'Lijst' : 'Raster'})
            </p>
          </div>
        </div>

        {typeof watchlistItemCount === 'number' ? (
          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-800/80">
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              Watchlist
            </span>
            <span className="text-2xl font-bold text-blue-400">
              {watchlistItemCount} titels
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

