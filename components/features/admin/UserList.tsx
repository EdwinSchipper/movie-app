'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { UIInput } from '@/components/ui'
import { AccountRoleBadge } from '@/components/features/account'
import { formatDate, getUserInitial } from '@/lib/utils'
import type { AdminUserSummary } from '@/types'

export interface UserListProps {
  users: AdminUserSummary[]
}

export default function UserList({ users }: UserListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredUsers = users.filter((u) =>
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase().trim())
  )

  const adminCount = users.filter((u) => u.role === 'admin').length
  const regularCount = users.filter((u) => u.role === 'user').length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-surface border border-border-subtle rounded-card">
          <span className="label-tech block">
            Totaal geregistreerd
          </span>
          <span className="h2 mt-1 block">
            {users.length}
          </span>
        </div>

        <div className="p-4 bg-surface border border-border-subtle rounded-card">
          <span className="label-tech text-accent-violet block">
            Administrators
          </span>
          <span className="h2 text-accent-violet mt-1 block">
            {adminCount}
          </span>
        </div>

        <div className="p-4 bg-surface border border-border-subtle rounded-card">
          <span className="label-tech text-brand block">
            Standaard Gebruikers
          </span>
          <span className="h2 text-brand mt-1 block">
            {regularCount}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-fg-muted z-10">
            <MagnifyingGlassIcon className="icon-sm" />
          </span>
          <UIInput
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Zoek gebruiker op e-mailadres..."
            className="pl-9 w-full"
          />
        </div>

        <span className="label-meta">
          {filteredUsers.length} van de {users.length} gebruikers getoond
        </span>
      </div>

      <div className="bg-surface border border-border-subtle rounded-card overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-fg-muted text-sm">
            Geen gebruikers gevonden die overeenkomen met je zoekopdracht.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-canvas label-tech border-b border-border-subtle">
                <tr>
                  <th scope="col" className="px-6 py-3.5 font-semibold">
                    Gebruiker
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-semibold">
                    Rol
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-semibold">
                    Registratiedatum
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-semibold text-right">
                    Actie
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredUsers.map((user) => {
                  const registeredDate = formatDate(
                    user.created_at,
                    { dateStyle: 'medium' },
                    '—'
                  )

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-surface-hover transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-pill bg-surface-hover border border-border-subtle flex items-center justify-center text-fg-primary font-semibold text-xs shrink-0">
                            {getUserInitial(user.email)}
                          </div>
                          <div className="min-w-0">
                            <span className="font-medium text-fg-primary block truncate">
                              {user.email || 'Geen e-mailadres'}
                            </span>
                            <span className="font-mono text-2xs text-fg-muted block truncate">
                              {user.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <AccountRoleBadge role={user.role} />
                      </td>

                      <td className="px-6 py-4 text-xs text-fg-muted whitespace-nowrap">
                        {registeredDate}
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-fg-primary hover:text-brand transition-colors bg-surface-hover border border-border-default px-3 py-1.5 rounded-control"
                        >
                          <span>Rechten instellen</span>
                          <ChevronRightIcon className="icon-xs" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
