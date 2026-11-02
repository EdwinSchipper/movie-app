import { Suspense } from 'react'
import Link from 'next/link'
import { getAppUser, logout } from '@/lib/auth'

function UserNavSkeleton() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="h-4 w-20 bg-gray-200/10 rounded" />
      <div className="h-7 w-16 bg-gray-200/10 rounded" />
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
    <div className="flex items-center gap-3 text-sm">
      {user ? (
        <div className="flex items-center gap-3">
          <span className="text-gray-400">
            Ingelogd als <strong className="text-gray-200 font-medium">{user.email}</strong>
            {user.role === 'admin' ? (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-purple-900/60 text-purple-300 border border-purple-700/50 rounded font-normal">
                Admin
              </span>
            ) : null}
          </span>
          <form action={handleLogout}>
            <button
              type="submit"
              className="px-2.5 py-1 text-xs font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded transition-colors cursor-pointer"
            >
              Uitloggen
            </button>
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
