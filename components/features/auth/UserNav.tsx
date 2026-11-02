import { Suspense } from 'react'
import Link from 'next/link'
import { getCurrentUser, logout } from '@/lib/auth'

function UserNavSkeleton() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="h-4 w-20 bg-gray-200/10 rounded" />
      <div className="h-7 w-16 bg-gray-200/10 rounded" />
    </div>
  )
}

async function UserNavContent() {
  const user = await getCurrentUser()

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
        <div className="flex items-center gap-3">
          <span className="text-gray-500">Niet ingelogd</span>
          <Link
            href="/login"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Inloggen
          </Link>
          <Link
            href="/register"
            className="text-white bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-md text-xs font-medium transition-colors"
          >
            Registreren
          </Link>
        </div>
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
