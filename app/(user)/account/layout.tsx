import type { ReactNode } from 'react'
import { AccountNav } from '@/components/features/account'

export interface AccountLayoutProps {
  children: ReactNode
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 sm:py-16">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-100">
          Mijn Account
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Beheer je persoonlijke gegevens, kijklijst en gebruikersinstellingen.
        </p>
      </div>

      <AccountNav />

      <main>{children}</main>
    </div>
  )
}

