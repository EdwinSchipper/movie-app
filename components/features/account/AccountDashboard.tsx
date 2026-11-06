import {
  UserIcon,
  BookmarkIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import type { UserProfile } from '@/types'
import AccountSummary from './AccountSummary'
import AccountCard from './AccountCard'

export interface AccountDashboardProps {
  profile: UserProfile
  watchlistItemCount: number
}

export default function AccountDashboard({
  profile,
  watchlistItemCount,
}: AccountDashboardProps) {
  return (
    <div className="space-y-8">
      <AccountSummary profile={profile} watchlistItemCount={watchlistItemCount} />

      <div>
        <div className="mb-6">
          <h2 className="h2">
            Account Dashboard
          </h2>
          <p className="text-sm text-fg-muted mt-1">
            Overzicht van jouw persoonlijke functies, lijsten en voorkeuren.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AccountCard
            heading="Mijn Gegevens"
            description="Bekijk je accountprofiel, e-mailadres, unieke identificatie en autorisatiestatus."
            href="/account/profile"
            buttonText="Gegevens bekijken"
            icon={<UserIcon className="icon-md text-brand" />}
          />

          <AccountCard
            heading="Mijn Watchlist"
            description="Beheer je bewaarde films en series, gesegmenteerd op nog te zien en reeds bekeken."
            href="/account/watchlist"
            buttonText="Watchlist openen"
            badge={`${watchlistItemCount} titels`}
            icon={<BookmarkIcon className="icon-md text-brand" />}
          />

          <AccountCard
            heading="Instellingen"
            description="Pas het aantal getoonde posters per overzicht aan en kies tussen grid- of rijweergave."
            href="/account/settings"
            buttonText="Instellingen beheren"
            icon={<Cog6ToothIcon className="icon-md text-brand" />}
          />

          {profile.role === 'admin' ? (
            <div className="md:col-span-3">
              <AccountCard
                heading="Beheerderspaneel (Admin)"
                description="Als administrator heb je toegang tot het centrale beheersysteem om gebruikersrechten toe te kennen en publieke aanbevelingen te beheren."
                href="/admin"
                buttonText="Naar Beheeromgeving"
                badge="Admin Alleen"
                icon={<ShieldCheckIcon className="icon-md text-accent-violet" />}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
