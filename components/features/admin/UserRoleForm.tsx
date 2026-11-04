'use client'

import { useState, useTransition } from 'react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { UIButton, UISpinner } from '@/components/ui'
import { updateUserRole } from '@/lib/admin'
import type { UserProfile, UserRole } from '@/types'

export interface UserRoleFormProps {
  user: UserProfile
}

const roleOptions: {
  value: UserRole
  label: string
  badgeText: string
  badgeClass: string
  description: string
}[] = [
  {
    value: 'user',
    label: 'Standaard Gebruiker (user)',
    badgeText: 'Standaard',
    badgeClass: 'bg-gray-800 text-gray-300',
    description:
      'Heeft toegang tot eigen Watchlist, persoonlijke instellingen en kan publieke aanbevelingen inzien. Heeft geen beheerdersrechten.',
  },
  {
    value: 'admin',
    label: 'Administrator (admin)',
    badgeText: 'Volledige toegang',
    badgeClass: 'bg-purple-900/60 text-purple-300 border border-purple-700/50',
    description:
      "Kan publieke aanbevelingen beheren (toevoegen/verwijderen op detailpagina's en in het admin panel) en gebruikersrechten van alle accounts aanpassen.",
  },
]

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
        {roleOptions.map((option) => {
          const isSelected = selectedRole === option.value
          return (
            <label
              key={option.value}
              className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? option.value === 'admin'
                    ? 'bg-purple-950/25 border-purple-500/50 text-white'
                    : 'bg-blue-950/20 border-blue-500/50 text-white'
                  : 'bg-gray-950/60 border-gray-800 text-gray-400 hover:border-gray-700'
              }`}
            >
              <input
                type="radio"
                name="role"
                value={option.value}
                checked={isSelected}
                onChange={() => setSelectedRole(option.value)}
                className={`mt-1 ${
                  option.value === 'admin'
                    ? 'text-purple-600 focus:ring-purple-500'
                    : 'text-blue-600 focus:ring-blue-500'
                }`}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-200">
                    {option.label}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-2xs font-semibold ${option.badgeClass}`}>
                    {option.badgeText}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {option.description}
                </p>
              </div>
            </label>
          )
        })}
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
              <UISpinner size="sm" className="text-white" />
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
