import type { UserProfile } from '@/types'
import { formatDate } from '@/lib/utils'

export interface AccountDataListProps {
  profile: UserProfile
}

export default function AccountDataList({ profile }: AccountDataListProps) {
  const registeredDate = formatDate(
    profile.created_at,
    { dateStyle: 'long' },
    'Onbekend'
  )

  const updatedDate = formatDate(
    profile.updated_at,
    { dateStyle: 'medium', timeStyle: 'short' },
    'Niet beschikbaar'
  )

  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
      <div className="space-y-1">
        <dt className="label-tech">
          E-mailadres
        </dt>
        <dd className="text-base font-medium text-fg-primary">
          {profile.email || 'Geen e-mailadres'}
        </dd>
      </div>

      <div className="space-y-1">
        <dt className="label-tech">
          Gebruiker ID
        </dt>
        <dd className="text-xs font-mono text-fg-muted break-all bg-canvas px-2.5 py-1.5 rounded-control border border-border-subtle inline-block">
          {profile.id}
        </dd>
      </div>

      <div className="space-y-1">
        <dt className="label-tech">
          Geregistreerd op
        </dt>
        <dd className="text-sm text-fg-secondary">
          {registeredDate}
        </dd>
      </div>

      <div className="space-y-1">
        <dt className="label-tech">
          Laatst bijgewerkt
        </dt>
        <dd className="text-sm text-fg-secondary">
          {updatedDate}
        </dd>
      </div>
    </dl>
  )
}
