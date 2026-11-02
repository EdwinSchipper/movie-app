import { Suspense } from 'react'
import Link from 'next/link'
import { getAppUser } from '@/lib/auth'

function MainNavSkeleton() {
  return (
    <nav className="hidden sm:flex items-center gap-4 text-sm font-medium animate-pulse">
      <div className="h-4 w-16 bg-gray-200/10 rounded" />
      <div className="h-4 w-24 bg-gray-200/10 rounded" />
      <div className="h-4 w-16 bg-gray-200/10 rounded" />
    </nav>
  )
}

async function MainNavContent() {
  const user = await getAppUser()

  return (
    <nav className="hidden sm:flex items-center gap-4 text-sm font-medium text-gray-500">
      <Link href="/trending" className="hover:text-blue-600 transition-colors">
        Trending
      </Link>
      <Link href="/recommendations" className="hover:text-blue-600 transition-colors">
        Aanbevelingen
      </Link>
      {user ? (
        <Link href="/watchlist" className="hover:text-blue-600 transition-colors">
          Watchlist
        </Link>
      ) : null}
    </nav>
  )
}

export default function MainNav() {
  return (
    <Suspense fallback={<MainNavSkeleton />}>
      <MainNavContent />
    </Suspense>
  )
}

