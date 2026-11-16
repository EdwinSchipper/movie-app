import { Suspense } from 'react'
import Link from 'next/link'
import { getAppUser } from '@/lib/auth'

function MainNavSkeleton() {
  return (
    <nav
      aria-label="Hoofdnavigatie"
      className="hidden sm:flex items-center gap-4 text-sm font-medium animate-pulse"
    >
      <div className="h-4 w-16 bg-surface-hover rounded-control" />
      <div className="h-4 w-24 bg-surface-hover rounded-control" />
      <div className="h-4 w-16 bg-surface-hover rounded-control" />
    </nav>
  )
}

async function MainNavContent() {
  const user = await getAppUser()

  return (
    <nav
      aria-label="Hoofdnavigatie"
      className="hidden sm:flex items-center gap-4 text-sm font-medium text-fg-secondary"
    >
      <Link href="/trending" className="hover:text-fg-primary transition-colors">
        Trending
      </Link>
      <Link href="/recommendations" className="hover:text-fg-primary transition-colors">
        Aanbevelingen
      </Link>
      {user ? (
        <Link href="/watchlist" className="hover:text-fg-primary transition-colors">
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

