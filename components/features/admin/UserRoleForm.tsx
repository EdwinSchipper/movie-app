'use client'

import { useState, useTransition } from 'react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { UIButton, Spinner } from '@/components/ui'
import { updateUserRole } from '@/lib/admin'
import type { UserProfile, UserRole } from '@/types'

export interface UserRoleFormProps {
  user: UserProfile
}

export default function UserRoleForm({ user }: UserRoleFormProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFeedback(null)

    startTransition(async () => {
      const result = await updateUserRole(user.id, selectedRole)

      if (result.success) {
        setFeedback({
          type: 'success',
          message: `De rol voor ${user.email} is succesvol gewijzigd naar '${selectedRole}'.`,
        })
      } else {
        setFeedback({
          type: 'error',
          message: result.error || 'Er is een fout opgetreden bij het toekennen van de rol.',
        })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 sm:p-8">
      <div className="pb-6 border-b border-gray-800">
        <h3 className="text-lg font-bold text-gray-100">
          Rechten & Autorisatie Instellen
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          Kies het rechtenniveau voor dit account. Wijzigingen zijn per direct van kracht.
        </p>
      </div>

      {feedback ? (
        <div
          className={`mt-6 p-4 rounded-lg text-sm border flex items-center gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
              : 'bg-red-950/60 border-red-800/80 text-red-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckIcon className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <XMarkIcon className="w-5 h-5 shrink-0 text-red-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      ) : null}

      <div className="space-y-4 pt-6">
        <label
          className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
            selectedRole === 'user'
              ? 'bg-blue-950/20 border-blue-500/50 text-white'
              : 'bg-gray-950/60 border-gray-800 text-gray-400 hover:border-gray-700'
          }`}
        >
          <input
            type="radio"
            name="role"
            value="user"
            checked={selectedRole === 'user'}
            onChange={() => setSelectedRole('user')}
            className="mt-1 text-blue-600 focus:ring-blue-500"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-200">
                Standaard Gebruiker (user)
              </span>
              <span className="px-2 py-0.5 rounded text-2xs font-semibold bg-gray-800 text-gray-300">
                Standaard
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Heeft toegang tot eigen Watchlist, persoonlijke instellingen en kan publieke aanbevelingen inzien. Heeft geen beheerdersrechten.
            </p>
          </div>
        </label>

        <label
          className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
            selectedRole === 'admin'
              ? 'bg-purple-950/25 border-purple-500/50 text-white'
              : 'bg-gray-950/60 border-gray-800 text-gray-400 hover:border-gray-700'
          }`}
        >
          <input
            type="radio"
            name="role"
            value="admin"
            checked={selectedRole === 'admin'}
            onChange={() => setSelectedRole('admin')}
            className="mt-1 text-purple-600 focus:ring-purple-500"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-200">
                Administrator (admin)
              </span>
              <span className="px-2 py-0.5 rounded text-2xs font-semibold bg-purple-900/60 text-purple-300 border border-purple-700/50">
                Volledige toegang
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Kan publieke aanbevelingen beheren (toevoegen/verwijderen op detailpagina&apos;s en in het admin panel) en gebruikersrechten van alle accounts aanpassen.
            </p>
          </div>
        </label>
      </div>

      <div className="pt-6 mt-6 border-t border-gray-800 flex justify-end">
        <UIButton
          type="submit"
          variant="primary"
          size="md"
          disabled={isPending || selectedRole === user.role}
          className="gap-2"
        >
          {isPending ? (
            <>
              <Spinner size="sm" className="-ml-1 mr-2 text-white" />
              <span>Bezig met bijwerken...</span>
            </>
          ) : (
            'Rol opslaan'
          )}
        </UIButton>
      </div>
    </form>
  )
}
