import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import { getAdminUsers } from '@/lib/admin'
import { UserList } from '@/components/features/admin'

function UserListSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-20 bg-surface border border-border-subtle rounded-card" />
        <div className="h-20 bg-surface border border-border-subtle rounded-card" />
        <div className="h-20 bg-surface border border-border-subtle rounded-card" />
      </div>
      <div className="h-10 bg-surface-hover rounded-control max-w-md" />
      <div className="h-64 bg-surface border border-border-subtle rounded-card" />
    </div>
  )
}

async function UserListContent() {
  const [isAuthorized, users] = await Promise.all([
    isAdmin(),
    getAdminUsers(),
  ])

  if (!isAuthorized) {
    notFound()
  }

  return <UserList users={users} />
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<UserListSkeleton />}>
      <UserListContent />
    </Suspense>
  )
}
