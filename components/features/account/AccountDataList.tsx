import type { UserProfile } from '@/types'

export interface AccountDataListProps {
  profile: UserProfile
}

export function formatSafeDate(
  dateString?: string | null,
  options?: Intl.DateTimeFormatOptions,
  fallback: string = 'Niet beschikbaar'
): string {
  if (!dateString) return fallback
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return fallback
  return new Intl.DateTimeFormat('nl-NL', options).format(date)
}

export default function AccountDataList({ profile }: AccountDataListProps) {
  const registeredDate = formatSafeDate(
    profile.created_at,
    { dateStyle: 'long' },
    'Onbekend'
  )

  const updatedDate = formatSafeDate(
    profile.updated_at,
    { dateStyle: 'medium', timeStyle: 'short' },
    'Niet beschikbaar'
  )

  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
      <div className="space-y-1">
        <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
          E-mailadres
        </dt>
        <dd className="text-base font-medium text-gray-200">
          {profile.email || 'Geen e-mailadres'}
        </dd>
      </div>

      <div className="space-y-1">
        <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
          Gebruiker ID
        </dt>
        <dd className="text-xs font-mono text-gray-400 break-all bg-gray-950/60 px-2.5 py-1.5 rounded border border-gray-800/80 inline-block">
          {profile.id}
        </dd>
      </div>

      <div className="space-y-1">
        <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
          Geregistreerd op
        </dt>
        <dd className="text-sm text-gray-300">
          {registeredDate}
        </dd>
      </div>

      <div className="space-y-1">
        <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
          Laatst bijgewerkt
        </dt>
        <dd className="text-sm text-gray-300">
          {updatedDate}
        </dd>
      </div>
    </dl>
  )
}
