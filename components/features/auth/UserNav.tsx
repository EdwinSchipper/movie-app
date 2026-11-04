import { Suspense } from 'react'
import Link from 'next/link'
import { UserIcon } from '@heroicons/react/24/outline'
import { UIButton } from '@/components/ui'
import { getAppUser, logout } from '@/lib/auth'

function UserNavSkeleton() {
  return (
    <div className="flex items-center gap-2 animate-pulse">
      <div className="h-7 w-20 bg-gray-200/10 rounded-lg" />
      <div className="h-7 w-16 bg-gray-200/10 rounded-lg" />
    </div>
  )
}

async function UserNavContent() {
  const user = await getAppUser()

  async function handleLogout() {
    'use server'
    await logout()
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {user ? (
        <div className="flex items-center gap-2">
          <Link
            href="/account"
            className="px-2.5 py-1 text-xs font-medium text-gray-300 hover:text-white bg-gray-900/80 hover:bg-gray-800 border border-gray-800 rounded-lg transition-colors flex items-center gap-1.5"
            title={user.email ? `Account (${user.email})` : 'Account'}
          >
            <UserIcon className="w-3.5 h-3.5 text-gray-400" />
            <span className="hidden sm:inline">Account</span>
          </Link>

          {user.role === 'admin' ? (
            <Link
              href="/admin"
              className="px-2.5 py-1 text-xs font-semibold text-purple-300 hover:text-purple-200 bg-purple-950/60 hover:bg-purple-950/90 border border-purple-800/60 rounded-lg transition-colors flex items-center gap-1.5"
              title="Beheer & Administratie"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span className="hidden sm:inline">Beheer</span>
            </Link>
          ) : null}

          <form action={handleLogout}>
            <UIButton
              type="submit"
              variant="secondary"
              size="sm"
              className="bg-gray-900/80 text-gray-400 hover:border-red-900/50 hover:bg-red-950/40 hover:text-red-300 border border-gray-800"
            >
              Uitloggen
            </UIButton>
          </form>
        </div>
      ) : (
        <Link
          href="/login"
          className="text-white bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-md text-xs font-medium transition-colors"
        >
          Inloggen
        </Link>
      )}
    </div>
  )
}

export default function UserNav() {
  return (
    <Suspense fallback={<UserNavSkeleton />}>
      <UserNavContent />
    </Suspense>
  )
}
