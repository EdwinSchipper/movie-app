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
          <span className="badge-violet">
            Beheerderspaneel
          </span>
        </div>
        <h1 className="h1">
          Beheer & Administratie
        </h1>
        <p className="text-sm text-fg-secondary mt-1">
          Beheer gebruikersrechten en gecureerde publieke aanbevelingen.
        </p>
      </div>

      <AdminNav />

      <main>{children}</main>
    </div>
  )
}
