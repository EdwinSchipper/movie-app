import { Suspense } from 'react'
import Link from 'next/link'
import { UserIcon } from '@heroicons/react/24/outline'
import { UIButton } from '@/components/ui'
import { getAppUser, logout } from '@/lib/auth'

function UserNavSkeleton() {
  return (
    <div className="flex items-center gap-2 animate-pulse">
      <div className="h-7 w-20 bg-surface-hover rounded-control" />
      <div className="h-7 w-16 bg-surface-hover rounded-control" />
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
          <UIButton
            href="/account"
            variant="outline"
            size="xs"
            title={user.email ? `Account (${user.email})` : 'Account'}
          >
            <UserIcon className="icon-xs text-fg-muted" aria-hidden="true" />
            <span className="hidden sm:inline">Account</span>
          </UIButton>

          {user.role === 'admin' ? (
            <Link
              href="/admin"
              className="badge-violet hover:bg-accent-violet/30 transition-colors"
              title="Beheer & Administratie"
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-accent-violet"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Beheer</span>
            </Link>
          ) : null}

          <form action={handleLogout}>
            <UIButton type="submit" variant="outline" size="xs">
              Uitloggen
            </UIButton>
          </form>
        </div>
      ) : (
        <UIButton href="/login" variant="primary" size="xs">
          Inloggen
        </UIButton>
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
