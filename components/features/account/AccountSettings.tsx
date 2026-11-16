'use client'

import { useState, useTransition } from 'react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { UIButton, UISpinner } from '@/components/ui'
import { updateUserSettings } from '@/lib/account'
import type { UserSettings, TileDisplayMode } from '@/types'

export interface AccountSettingsProps {
  initialSettings: UserSettings
}

const tileCountOptions = [10, 20, 30, 40, 50]

const displayModeOptions: {
  value: TileDisplayMode
  label: string
  description: string
}[] = [
  {
    value: 'grid',
    label: 'Rasterweergave (Grid)',
    description: 'Grote filmposters in een dynamisch meer-koloms raster.',
  },
  {
    value: 'row',
    label: 'Rijweergave (Row / List)',
    description: 'Horizontale compacte rijen met titel en details per regel.',
  },
]

export default function AccountSettings({
  initialSettings,
}: AccountSettingsProps) {
  const [tileCount, setTileCount] = useState<number>(
    initialSettings.tile_count_preference || 20
  )
  const [displayMode, setDisplayMode] = useState<TileDisplayMode>(
    initialSettings.tile_display_mode || 'grid'
  )
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFeedback(null)

    startTransition(async () => {
      const result = await updateUserSettings({
        tile_count_preference: tileCount,
        tile_display_mode: displayMode,
      })

      if (result.success) {
        setFeedback({
          type: 'success',
          message: 'Je instellingen zijn succesvol opgeslagen.',
        })
      } else {
        setFeedback({
          type: 'error',
          message: result.error || 'Er is een fout opgetreden bij het opslaan.',
        })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-surface border border-border-subtle rounded-card p-6 sm:p-8">
        <div className="pb-6 border-b border-border-subtle">
          <h2 className="h3">
            Weergave-instellingen
          </h2>
          <p className="text-sm text-fg-secondary mt-1">
            Personaliseer hoe overzichtslijsten en media-tegels standaard aan jou getoond worden.
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

        <div className="space-y-8 pt-6">
          <div>
            <span className="block text-sm font-semibold text-fg-primary mb-1">
              Aantal tiles per overzichtspagina
            </span>
            <p className="text-xs text-fg-secondary mb-3">
              Stel in hoeveel media-items (films/series) standaard geladen worden.
            </p>
            <div className="flex flex-wrap gap-2">
              {tileCountOptions.map((count) => (
                <UIButton
                  key={count}
                  type="button"
                  variant={tileCount === count ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setTileCount(count)}
                >
                  {count} items
                </UIButton>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-border-subtle">
            <span className="block text-sm font-semibold text-fg-primary mb-1">
              Standaard weergavetype
            </span>
            <p className="text-xs text-fg-secondary mb-3">
              Kies of je overzichten bij voorkeur als poster-raster of als compacte rijlijst ziet.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayModeOptions.map((option) => {
                const isSelected = displayMode === option.value
                return (
                  <label
                    key={option.value}
                    className={`flex items-start gap-3 p-4 rounded-card border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-accent-blue/15 border-accent-blue/50 text-fg-primary'
                        : 'bg-canvas/60 border-border-subtle text-fg-secondary hover:border-border-default'
                    }`}
                  >
                    <input
                      type="radio"
                      name="displayMode"
                      value={option.value}
                      checked={isSelected}
                      onChange={() => setDisplayMode(option.value)}
                      className="mt-1 accent-accent-blue"
                    />
                    <div>
                      <span className="block text-sm font-semibold text-fg-primary">
                        {option.label}
                      </span>
                      <span className="block text-xs text-fg-muted mt-1">
                        {option.description}
                      </span>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-border-subtle flex justify-end">
          <UIButton
            type="submit"
            variant="primary"
            size="md"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <UISpinner size="sm" />
                <span>Bezig met opslaan...</span>
              </>
            ) : (
              'Instellingen opslaan'
            )}
          </UIButton>
        </div>
      </div>
    </form>
  )
}
