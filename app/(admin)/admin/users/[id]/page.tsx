import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import { getAdminUserById } from '@/lib/admin'
import { UserDetailCard, UserRoleForm } from '@/components/features/admin'

export interface AdminUserDetailPageProps {
  params: Promise<{ id: string }>
}

function UserDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-60 bg-gray-900/60 rounded-xl" />
      <div className="h-72 bg-gray-900/60 rounded-xl" />
    </div>
  )
}

async function UserDetailContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ id: string }>
}) {
  const { id } = await paramsPromise

  const isAuthorized = await isAdmin()
  if (!isAuthorized) {
    notFound()
  }

  const user = await getAdminUserById(id)
  if (!user) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <UserDetailCard user={user} />
      <UserRoleForm user={user} />
    </div>
  )
}

export default function AdminUserDetailPage({ params }: AdminUserDetailPageProps) {
  return (
    <Suspense fallback={<UserDetailSkeleton />}>
      <UserDetailContent paramsPromise={params} />
    </Suspense>
  )
}
