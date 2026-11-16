import type { Metadata } from 'next'
import { FilmIcon, FireIcon, HomeIcon } from '@heroicons/react/24/outline'
import { UIButton } from '@/components/ui'

export const metadata: Metadata = {
  title: '404 — Scène niet gevonden | Movie App',
  description: 'De opgevraagde film, serie of pagina kon niet worden gevonden.',
}

const MOVIE_NOT_FOUND_ASCII = [
  '+===============================================+',
  '| [ ]   [ ]   [ ]   [ ]   [ ]   [ ]   [ ]   [ ] |',
  '+===============================================+',
  '|                                               |',
  '|           +-----------------------+           |',
  '|           |    404  -  MISSING    |           |',
  '|           |   * DELETED SCENE *   |           |',
  '|           +-----------------------+           |',
  '|                                               |',
  '|        Deze filmrol ligt nog ergens in        |',
  '|               de montagekamer...              |',
  '|                                               |',
  '+===============================================+',
  '| [ ]   [ ]   [ ]   [ ]   [ ]   [ ]   [ ]   [ ] |',
  '+===============================================+',
].join('\n')

export default function NotFoundPage() {
  return (
    <section
      aria-labelledby="not-found-heading"
      className="w-full max-w-3xl mx-auto px-4 py-16 md:py-24"
    >
      <div className="rounded-hero border border-border-subtle bg-surface p-6 md:p-10 text-center shadow-2xl">
        <div className="mb-6 flex justify-center">
          <span className="badge-brand">
            <FilmIcon className="icon-xs" aria-hidden="true" />
            Deleted Scene <span aria-hidden="true">•</span> 404
          </span>
        </div>

        <pre
          aria-hidden="true"
          className="mx-auto mb-8 inline-block max-w-full overflow-x-auto whitespace-pre rounded-tile border border-border-default bg-canvas px-4 py-3 text-left font-mono text-[11px] sm:text-xs leading-snug text-brand shadow-inner"
        >
          {MOVIE_NOT_FOUND_ASCII}
        </pre>

        <h1 id="not-found-heading" className="h2 mb-3">
          404 — Deze scène is gesneuveld in de montage
        </h1>

        <p className="mx-auto mb-8 max-w-xl text-sm md:text-base leading-relaxed text-fg-secondary">
          De film, serie of pagina die je zoekt staat niet op de filmrol of is
          verplaatst naar een andere bioscoopzaal.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <UIButton href="/" variant="primary" size="sm" className="min-h-10">
            <HomeIcon className="icon-sm" aria-hidden="true" />
            Terug naar home
          </UIButton>

          <UIButton href="/trending" variant="outline" size="sm" className="min-h-10">
            <FireIcon className="icon-sm" aria-hidden="true" />
            Bekijk trending
          </UIButton>
        </div>
      </div>
    </section>
  )
}
