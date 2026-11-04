import type { ReactNode } from 'react'
import { AdminNav } from '@/components/features/admin'

export interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 sm:py-16">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded text-2xs font-semibold bg-purple-900/60 text-purple-300 border border-purple-700/50">
            Beheerderspaneel
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-100">
          Beheer & Administratie
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Beheer gebruikersrechten en gecureerde publieke aanbevelingen.
        </p>
      </div>

      <AdminNav />

      <main>{children}</main>
    </div>
  )
}
