'use client'

import { Suspense, type ComponentType } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  UserIcon,
  BookmarkIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

interface NavTab {
  label: string
  href: string
  exact?: boolean
  Icon: ComponentType<{ className?: string }>
}

const tabs: NavTab[] = [
  {
    label: 'Overzicht',
    href: '/account',
    exact: true,
    Icon: HomeIcon,
  },
  {
    label: 'Gegevens',
    href: '/account/profile',
    Icon: UserIcon,
  },
  {
    label: 'Watchlist',
    href: '/account/watchlist',
    Icon: BookmarkIcon,
  },
  {
    label: 'Instellingen',
    href: '/account/settings',
    Icon: Cog6ToothIcon,
  },
]

function AccountNavSkeleton() {
  return (
    <div className="flex space-x-2 border-b border-gray-800 pb-2 mb-8 animate-pulse">
      <div className="h-9 w-24 bg-gray-800/60 rounded-lg" />
      <div className="h-9 w-28 bg-gray-800/60 rounded-lg" />
      <div className="h-9 w-28 bg-gray-800/60 rounded-lg" />
      <div className="h-9 w-32 bg-gray-800/60 rounded-lg" />
    </div>
  )
}

function AccountNavContent() {
  const pathname = usePathname()

  return (
    <nav className="flex space-x-2 border-b border-gray-800 pb-2 mb-8" aria-label="Account Tabs">
      {tabs.map((tab) => {
        const isActive = tab.exact
          ? pathname === tab.href
          : pathname === tab.href || pathname.startsWith(`${tab.href}/`)

        const { Icon } = tab

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-colors border ${
              isActive
                ? 'bg-blue-600/10 text-blue-400 border-blue-500/30 font-semibold'
                : 'text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-800/40 font-medium'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-gray-500'}`} />
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default function AccountNav() {
  return (
    <Suspense fallback={<AccountNavSkeleton />}>
      <AccountNavContent />
    </Suspense>
  )
}
