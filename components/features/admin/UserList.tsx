'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { UIInput } from '@/components/ui'
import { AccountRoleBadge } from '@/components/features/account'
import type { AdminUserSummary } from '@/types'

export interface UserListProps {
  users: AdminUserSummary[]
}

export default function UserList({ users }: UserListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase().trim())
  )

  const adminCount = users.filter((u) => u.role === 'admin').length
  const regularCount = users.filter((u) => u.role === 'user').length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-900/60 border border-gray-800 rounded-xl">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
            Totaal geregistreerd
          </span>
          <span className="text-2xl font-bold text-gray-100 mt-1 block">
            {users.length}
          </span>
        </div>

        <div className="p-4 bg-gray-900/60 border border-gray-800 rounded-xl">
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block">
            Administrators
          </span>
          <span className="text-2xl font-bold text-purple-300 mt-1 block">
            {adminCount}
          </span>
        </div>

        <div className="p-4 bg-gray-900/60 border border-gray-800 rounded-xl">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">
            Standaard Gebruikers
          </span>
          <span className="text-2xl font-bold text-blue-300 mt-1 block">
            {regularCount}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 z-10">
            <MagnifyingGlassIcon className="w-4 h-4" />
          </span>
          <UIInput
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Zoek gebruiker op e-mailadres..."
            className="pl-9 w-full"
          />
        </div>

        <span className="text-xs text-gray-400">
          {filteredUsers.length} van de {users.length} gebruikers getoond
        </span>
      </div>

      <div className="bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            Geen gebruikers gevonden die overeenkomen met je zoekopdracht.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-950/60 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-800">
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
              <tbody className="divide-y divide-gray-800/60">
                {filteredUsers.map((user) => {
                  const registeredDate = user.created_at
                    ? new Intl.DateTimeFormat('nl-NL', {
                        dateStyle: 'medium',
                      }).format(new Date(user.created_at))
                    : '—'

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 font-semibold text-xs shrink-0">
                            {user.email.substring(0, 1).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <span className="font-medium text-gray-200 block truncate">
                              {user.email}
                            </span>
                            <span className="font-mono text-2xs text-gray-500 block truncate">
                              {user.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <AccountRoleBadge role={user.role} />
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-400 whitespace-nowrap">
                        {registeredDate}
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors bg-blue-950/30 hover:bg-blue-950/60 border border-blue-900/50 px-3 py-1.5 rounded-lg"
                        >
                          <span>Rechten instellen</span>
                          <ChevronRightIcon className="w-3.5 h-3.5" />
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
