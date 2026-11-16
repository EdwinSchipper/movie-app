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
    badgeClass: 'badge-surface',
    description:
      'Heeft toegang tot eigen Watchlist, persoonlijke instellingen en kan publieke aanbevelingen inzien. Heeft geen beheerdersrechten.',
  },
  {
    value: 'admin',
    label: 'Administrator (admin)',
    badgeText: 'Volledige toegang',
    badgeClass: 'badge-violet',
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
          message: `De rol voor ${user.email || 'dit account'} is succesvol gewijzigd naar '${selectedRole}'.`,
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
    <form onSubmit={handleSubmit} className="bg-surface border border-border-subtle rounded-card p-6 sm:p-8">
      <div className="pb-6 border-b border-border-subtle">
        <h3 className="h3">
          Rechten & Autorisatie Instellen
        </h3>
        <p className="text-sm text-fg-secondary mt-1">
          Kies het rechtenniveau voor dit account. Wijzigingen zijn per direct van kracht.
        </p>
      </div>

      {feedback ? (
        <div
          className={`mt-6 p-4 rounded-control text-sm border flex items-center gap-3 ${
            feedback.type === 'success'
              ? 'bg-accent-emerald/15 border-accent-emerald/40 text-accent-emerald'
              : 'bg-accent-coral/15 border-accent-coral/40 text-accent-coral'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckIcon className="icon-md shrink-0 text-accent-emerald" />
          ) : (
            <XMarkIcon className="icon-md shrink-0 text-accent-coral" />
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
              className={`flex items-start gap-4 p-4 rounded-card border cursor-pointer transition-all ${
                isSelected
                  ? option.value === 'admin'
                    ? 'bg-accent-violet/15 border-accent-violet/50 text-fg-primary'
                    : 'bg-accent-blue/15 border-accent-blue/50 text-fg-primary'
                  : 'bg-canvas/60 border-border-subtle text-fg-secondary hover:border-border-default'
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
                    ? 'accent-accent-violet'
                    : 'accent-accent-blue'
                }`}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-fg-primary">
                    {option.label}
                  </span>
                  <span className={option.badgeClass}>
                    {option.badgeText}
                  </span>
                </div>
                <p className="text-xs text-fg-muted mt-1">
                  {option.description}
                </p>
              </div>
            </label>
          )
        })}
      </div>

      <div className="pt-6 mt-6 border-t border-border-subtle flex justify-end">
        <UIButton
          type="submit"
          variant="primary"
          size="md"
          disabled={isPending || selectedRole === user.role}
        >
          {isPending ? (
            <>
              <UISpinner size="sm" />
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
