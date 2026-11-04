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
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 sm:p-8 backdrop-blur-xs">
        <div className="pb-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-gray-100">
            Weergave-instellingen
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Personaliseer hoe overzichtslijsten en media-tegels standaard aan jou getoond worden.
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

        <div className="space-y-8 pt-6">
          <div>
            <span className="block text-sm font-semibold text-gray-200 mb-1">
              Aantal tiles per overzichtspagina
            </span>
            <p className="text-xs text-gray-400 mb-3">
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

          <div className="pt-6 border-t border-gray-800/80">
            <span className="block text-sm font-semibold text-gray-200 mb-1">
              Standaard weergavetype
            </span>
            <p className="text-xs text-gray-400 mb-3">
              Kies of je overzichten bij voorkeur als poster-raster of als compacte rijlijst ziet.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  displayMode === 'grid'
                    ? 'bg-blue-950/20 border-blue-500/50 text-white'
                    : 'bg-gray-950/60 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="displayMode"
                  value="grid"
                  checked={displayMode === 'grid'}
                  onChange={() => setDisplayMode('grid')}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="block text-sm font-semibold text-gray-200">
                    Rasterweergave (Grid)
                  </span>
                  <span className="block text-xs text-gray-400 mt-1">
                    Grote filmposters in een dynamisch meer-koloms raster.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  displayMode === 'row'
                    ? 'bg-blue-950/20 border-blue-500/50 text-white'
                    : 'bg-gray-950/60 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="displayMode"
                  value="row"
                  checked={displayMode === 'row'}
                  onChange={() => setDisplayMode('row')}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="block text-sm font-semibold text-gray-200">
                    Rijweergave (Row / List)
                  </span>
                  <span className="block text-xs text-gray-400 mt-1">
                    Horizontale compacte rijen met titel en details per regel.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-gray-800 flex justify-end">
          <UIButton
            type="submit"
            variant="primary"
            size="md"
            disabled={isPending}
            className="gap-2"
          >
            {isPending ? (
              <>
                <UISpinner size="sm" className="text-white" />
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
