import Link from 'next/link'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { AccountDataList } from '@/components/features/account'
import type { UserProfile } from '@/types'

export interface UserDetailCardProps {
  user: UserProfile
}

export default function UserDetailCard({ user }: UserDetailCardProps) {
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors mb-2"
          >
            <ChevronLeftIcon className="w-3.5 h-3.5" />
            <span>Terug naar gebruikersoverzicht</span>
          </Link>
          <h2 className="text-xl font-bold text-gray-100">
            Gebruikersdetails
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Overzicht van accountgegevens en actieve autorisatierol.
          </p>
        </div>

        <div>
          {user.role === 'admin' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Administrator
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-800/80 text-gray-300 border border-gray-700/60">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              Standaard Gebruiker
            </span>
          )}
        </div>
      </div>

      <AccountDataList profile={user} />
    </div>
  )
}
