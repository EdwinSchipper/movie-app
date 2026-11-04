import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { UsersIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { isAdmin } from '@/lib/auth'
import { getAdminUsers } from '@/lib/admin'
import { getRecommendations } from '@/lib/recommendations'
import AdminCard from './AdminCard'

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-24 bg-gray-900/60 rounded-xl" />
        <div className="h-24 bg-gray-900/60 rounded-xl" />
        <div className="h-24 bg-gray-900/60 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-48 rounded-xl bg-gray-900/40 border border-gray-800" />
        <div className="h-48 rounded-xl bg-gray-900/40 border border-gray-800" />
      </div>
    </div>
  )
}

async function AdminDashboardContent() {
  const isAuthorized = await isAdmin()

  if (!isAuthorized) {
    notFound()
  }

  const [users, recommendations] = await Promise.all([
    getAdminUsers(),
    getRecommendations(),
  ])

  const adminCount = users.filter((u) => u.role === 'admin').length

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-gray-900/60 border border-gray-800 rounded-xl">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
            Geregistreerde Accounts
          </span>
          <span className="text-3xl font-bold text-gray-100 mt-2 block">
            {users.length}
          </span>
        </div>

        <div className="p-5 bg-gray-900/60 border border-gray-800 rounded-xl">
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block">
            Beheerders (Admins)
          </span>
          <span className="text-3xl font-bold text-purple-300 mt-2 block">
            {adminCount}
          </span>
        </div>

        <div className="p-5 bg-gray-900/60 border border-gray-800 rounded-xl">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">
            Publieke Aanbevelingen
          </span>
          <span className="text-3xl font-bold text-blue-300 mt-2 block">
            {recommendations.length}
          </span>
        </div>
      </div>

      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-100">
            Beheer Dashboard
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Kies een beheerdersmodule om accounts te beheren of aanbevelingen te cureren.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminCard
            title="Gebruikers & Rechten"
            description="Bekijk alle geregistreerde accounts, inspecteer accountdetails en wijs beheerdersrechten toe."
            href="/admin/users"
            buttonText="Gebruikers beheren"
            badge={`${users.length} accounts`}
            icon={<UsersIcon className="w-5 h-5 text-purple-400" />}
          />

          <AdminCard
            title="Publieke Aanbevelingen"
            description="Beheer de gecureerde titels die publiek getoond worden aan alle bezoekers van de Movie App."
            href="/admin/recommendations"
            buttonText="Aanbevelingen beheren"
            badge={`${recommendations.length} titels`}
            icon={<SparklesIcon className="w-5 h-5 text-purple-400" />}
          />
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboardContent />
    </Suspense>
  )
}
