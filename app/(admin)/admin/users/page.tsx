import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import { getAdminUsers } from '@/lib/admin'
import { UserList } from '@/components/features/admin'

function UserListSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-20 bg-gray-900/60 rounded-xl" />
        <div className="h-20 bg-gray-900/60 rounded-xl" />
        <div className="h-20 bg-gray-900/60 rounded-xl" />
      </div>
      <div className="h-10 bg-gray-900/80 rounded-lg max-w-md" />
      <div className="h-64 bg-gray-900/40 rounded-xl" />
    </div>
  )
}

async function UserListContent() {
  const isAuthorized = await isAdmin()

  if (!isAuthorized) {
    notFound()
  }

  const users = await getAdminUsers()

  return <UserList users={users} />
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<UserListSkeleton />}>
      <UserListContent />
    </Suspense>
  )
}
