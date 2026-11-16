'use client'

import { useEffect } from 'react'
import { ArrowPathIcon, FilmIcon, HomeIcon } from '@heroicons/react/24/outline'
import { UIButton } from '@/components/ui'

export interface ErrorPageProps {
  error: unknown
  retry: () => void
}

const MOVIE_ERROR_ASCII = [
  '+===============================================+',
  '| [ ]   [ ]   [ ]   [ ]   [ ]   [ ]   [ ]   [ ] |',
  '+===============================================+',
  '|                                               |',
  '|     ( o )    ----  CUT!   ----    ( o )       |',
  '|       De projector is even vastgelopen.       |',
  '|                                               |',
  '|        SCENE: ERROR!  |  TAKE: OPNIEUW        |',
  '|                                               |',
  '+===============================================+',
  '| [ ]   [ ]   [ ]   [ ]   [ ]   [ ]   [ ]   [ ] |',
  '+===============================================+',
].join('\n')

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const errorDigest =
    error instanceof Error && 'digest' in error && typeof error.digest === 'string'
      ? error.digest
      : null

  return (
    <section
      aria-labelledby="error-heading"
      className="w-full max-w-3xl mx-auto px-4 py-16 md:py-24"
    >
      <div className="rounded-hero border border-border-subtle bg-surface p-6 md:p-10 text-center shadow-2xl">
        <div className="mb-6 flex justify-center">
          <span className="badge-coral">
            <FilmIcon className="icon-xs" aria-hidden="true" />
            Technische storing op de set
          </span>
        </div>

        <pre
          aria-hidden="true"
          className="mx-auto mb-8 inline-block max-w-full overflow-x-auto whitespace-pre rounded-tile border border-border-default bg-canvas px-4 py-3 text-left font-mono text-[11px] sm:text-xs leading-snug text-brand shadow-inner"
        >
          {MOVIE_ERROR_ASCII}
        </pre>

        <h1 id="error-heading" className="h2 mb-3">
          Cut! Deze scène liep even vast
        </h1>

        <p className="mx-auto mb-6 max-w-xl text-sm md:text-base leading-relaxed text-fg-secondary">
          Er ging iets mis tijdens het ophalen van de filmgegevens of het renderen van
          deze pagina. Pak gerust wat verse popcorn en schiet deze take nog een keer.
        </p>

        {errorDigest && (
          <p className="label-tech mb-6">
            Referentiecode: {errorDigest}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <UIButton
            type="button"
            variant="primary"
            size="md"
            onClick={() => retry()}
            className="min-h-10"
          >
            <ArrowPathIcon className="icon-sm" aria-hidden="true" />
            Take opnieuw opnemen
          </UIButton>

          <UIButton
            href="/"
            variant="outline"
            size="md"
            className="min-h-10"
          >
            <HomeIcon className="icon-sm" aria-hidden="true" />
            Terug naar home
          </UIButton>
        </div>
      </div>
    </section>
  )
}
