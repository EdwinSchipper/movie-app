'use client'

import { Suspense, type ComponentType } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  UsersIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

interface AdminNavTab {
  label: string
  href: string
  exact?: boolean
  Icon: ComponentType<{ className?: string }>
}

const tabs: AdminNavTab[] = [
  {
    label: 'Overzicht',
    href: '/admin',
    exact: true,
    Icon: HomeIcon,
  },
  {
    label: 'Gebruikersoverzicht',
    href: '/admin/users',
    Icon: UsersIcon,
  },
  {
    label: 'Publieke Aanbevelingen',
    href: '/admin/recommendations',
    Icon: SparklesIcon,
  },
]

function AdminNavSkeleton() {
  return (
    <div className="flex space-x-2 border-b border-border-subtle pb-2 mb-8 animate-pulse">
      <div className="h-9 w-24 bg-surface-hover rounded-control" />
      <div className="h-9 w-40 bg-surface-hover rounded-control" />
      <div className="h-9 w-44 bg-surface-hover rounded-control" />
    </div>
  )
}

function AdminNavContent() {
  const pathname = usePathname()

  return (
    <nav className="flex space-x-2 border-b border-border-subtle pb-2 mb-8" aria-label="Admin Tabs">
      {tabs.map((tab) => {
        const isActive = tab.exact
          ? pathname === tab.href
          : pathname === tab.href || pathname.startsWith(`${tab.href}/`)

        const { Icon } = tab

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-control text-sm transition-colors border ${
              isActive
                ? 'bg-accent-violet/15 text-accent-violet border-accent-violet/40 font-semibold'
                : 'text-fg-secondary border-transparent hover:text-fg-primary hover:bg-surface-hover font-medium'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className={`icon-sm ${isActive ? 'text-accent-violet' : 'text-fg-muted'}`} />
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default function AdminNav() {
  return (
    <Suspense fallback={<AdminNavSkeleton />}>
      <AdminNavContent />
    </Suspense>
  )
}
