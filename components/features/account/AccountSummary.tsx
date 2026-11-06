import type { UserProfile } from '@/types'
import { formatDate, getUserInitial } from '@/lib/utils'
import AccountRoleBadge from './AccountRoleBadge'

export interface AccountSummaryProps {
  profile: UserProfile
  watchlistItemCount?: number
}

export default function AccountSummary({
  profile,
  watchlistItemCount,
}: AccountSummaryProps) {
  const registeredDate = formatDate(
    profile.created_at,
    { dateStyle: 'long' },
    'Onbekend'
  )

  const initial = getUserInitial(profile.email)

  return (
    <div className="relative overflow-hidden rounded-card border border-border-subtle bg-surface p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-card bg-surface-hover border border-border-subtle flex items-center justify-center text-brand text-2xl font-bold shadow-lg shrink-0">
            {initial}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="h2">
                {profile.email || 'Geen e-mailadres'}
              </h2>
              <AccountRoleBadge role={profile.role} />
            </div>
            <p className="text-xs text-fg-muted">
              Lid sinds {registeredDate} • Voorkeur: {profile.tile_count_preference ?? 20} tiles ({profile.tile_display_mode === 'row' ? 'Lijst' : 'Raster'})
            </p>
          </div>
        </div>

        {typeof watchlistItemCount === 'number' ? (
          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-4 sm:pt-0 border-border-subtle">
            <span className="label-tech">
              Watchlist
            </span>
            <span className="text-2xl font-bold text-brand mt-1">
              {watchlistItemCount} titels
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
