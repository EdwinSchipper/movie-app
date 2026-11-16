import Link from 'next/link'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { AccountDataList, AccountRoleBadge } from '@/components/features/account'
import type { UserProfile } from '@/types'

export interface UserDetailCardProps {
  user: UserProfile
}

export default function UserDetailCard({ user }: UserDetailCardProps) {
  return (
    <div className="bg-surface border border-border-subtle rounded-card p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1.5 text-xs text-fg-secondary hover:text-accent-blue-hover transition-colors mb-2"
          >
            <ChevronLeftIcon className="icon-xs" />
            <span>Terug naar gebruikersoverzicht</span>
          </Link>
          <h2 className="h3">
            Gebruikersdetails
          </h2>
          <p className="text-sm text-fg-secondary mt-1">
            Overzicht van accountgegevens en actieve autorisatierol.
          </p>
        </div>

        <div>
          <AccountRoleBadge role={user.role} />
        </div>
      </div>

      <AccountDataList profile={user} />
    </div>
  )
}
