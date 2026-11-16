'use client'

import { useState } from 'react'
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
  CpuChipIcon,
  CubeTransparentIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ServerStackIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { UIButton } from '@/components/ui'
import type { RouteSpec } from '@/types'
import { INTEGRATION_SPECS, ROUTE_SPECS } from './presentationData'

interface RouteGroupBranch {
  id: string
  title: string
  subtitle: string
  badgeClass: string
  accentBorderClass: string
  paths: string[]
}

const ROUTE_MAP_BRANCHES: RouteGroupBranch[] = [
  {
    id: 'public',
    title: 'Publiek & Ontdekken',
    subtitle: 'Basis Route Group (PPR + Suspense)',
    badgeClass: 'badge-emerald',
    accentBorderClass: 'border-accent-emerald/40',
    paths: ['/', '/trending', '/movies/[id]', '/tv/[id]', '/recommendations', '/presentatie', '/tijdlijn'],
  },
  {
    id: 'auth',
    title: 'Authenticatie & PKCE',
    subtitle: '(auth) Route Group',
    badgeClass: 'badge-surface',
    accentBorderClass: 'border-border-default',
    paths: ['/login', '/register', '/auth/callback'],
  },
  {
    id: 'user',
    title: 'Persoonlijke Scope',
    subtitle: '(user) Layout + Watchlist RLS',
    badgeClass: 'badge-brand',
    accentBorderClass: 'border-brand/40',
    paths: ['/watchlist', '/account', '/account/profile', '/account/settings', '/account/watchlist'],
  },
  {
    id: 'admin',
    title: 'Admin RBAC & Systeem',
    subtitle: '(admin) + Error / 404 Boundaries',
    badgeClass: 'badge-violet',
    accentBorderClass: 'border-accent-violet/40',
    paths: [
      '/admin',
      '/admin/users',
      '/admin/users/[id]',
      '/admin/recommendations',
      'app/error.tsx',
      'app/not-found.tsx',
    ],
  },
]

const routeByPath = new Map<string, RouteSpec>(
  ROUTE_SPECS.map((route) => [route.path, route])
)

export default function RouteMapOverview() {
  const [selectedPath, setSelectedPath] = useState<string>('/movies/[id]')

  const activeRoute = routeByPath.get(selectedPath) ?? ROUTE_SPECS[0]

  return (
    <div className="space-y-8">
      <div className="rounded-card border border-border-subtle bg-surface p-5 md:p-7 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="h2">Visuele Route &amp; Architectuurkaart</h2>
            <p className="mt-1 text-sm text-fg-secondary">
              Klik op een willekeurige route-node in de kaart om alle verbonden UI-features,
              Promises, scopes en externe koppelingen live te laten oplichten.
            </p>
          </div>
          <span className="badge-brand self-start md:self-auto font-mono">
            Actief: {activeRoute.path}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full max-w-3xl rounded-tile border border-brand/40 bg-canvas p-4 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="icon-tile shrink-0 text-brand">
                  <GlobeAltIcon className="icon-md" aria-hidden="true" />
                </span>
                <div>
                  <span className="label-tech block">Ingang &amp; Globale Shell</span>
                  <h3 className="h4">proxy.ts &rarr; app/layout.tsx (RootLayout)</h3>
                  <p className="label-meta mt-0.5">
                    Ververst auth-sessie via updateSession() en rendert Header (HeaderSearch, MainNav, UserNav), ToastProvider &amp; Footer.
                  </p>
                </div>
              </div>
              <span className="badge-surface shrink-0 font-mono">Alle routes</span>
            </div>
          </div>

          <div className="h-6 w-px bg-border-default" aria-hidden="true" />
          <div className="hidden lg:block w-3/4 border-t-2 border-border-default" aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {ROUTE_MAP_BRANCHES.map((branch) => (
            <div key={branch.id} className="flex flex-col">
              <div className="hidden lg:flex justify-center" aria-hidden="true">
                <div className="h-5 w-px bg-border-default" />
              </div>

              <div
                className={`flex-1 rounded-tile border ${branch.accentBorderClass} bg-canvas/70 p-4 flex flex-col`}
              >
                <div className="mb-4 space-y-1.5">
                  <span className={branch.badgeClass}>{branch.title}</span>
                  <p className="label-meta font-mono">{branch.subtitle}</p>
                </div>

                <ul className="space-y-2 border-l-2 border-border-default pl-3">
                  {branch.paths.map((path) => {
                    const route = routeByPath.get(path)
                    if (!route) return null

                    const isSelected = route.path === activeRoute.path

                    return (
                      <li key={route.path} className="relative flex items-center">
                        <span
                          aria-hidden="true"
                          className={`-ml-3 mr-2 h-px w-3 shrink-0 transition-colors ${isSelected ? 'bg-brand' : 'bg-border-default'
                            }`}
                        />
                        <UIButton
                          type="button"
                          variant={isSelected ? 'primary' : 'outline'}
                          size="xs"
                          onClick={() => setSelectedPath(route.path)}
                          className={`w-full justify-between px-2.5 py-2 text-left ${
                            isSelected ? 'ring-2 ring-brand/40' : 'border-border-subtle bg-surface'
                          }`}
                        >
                          <span className="truncate font-mono text-xs">{route.path}</span>
                          <span
                            className={`shrink-0 text-[10px] font-mono ${isSelected ? 'text-white/80' : 'text-fg-muted'
                              }`}
                          >
                            {route.renderMode === 'PPR + Suspense' ? 'PPR' : route.renderMode}
                          </span>
                        </UIButton>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center" aria-hidden="true">
          <div className="flex flex-col items-center gap-1 text-fg-muted">
            <div className="h-5 w-px bg-border-default" />
            <ArrowDownIcon className="icon-sm text-brand" />
          </div>
        </div>

        <div className="rounded-tile border border-brand/35 bg-canvas p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-4">
            <div className="space-y-1">
              <span className="label-tech block">Gekoppelde Keten voor geselecteerde route</span>
              <div className="flex flex-wrap items-center gap-2">
                <code className="rounded-control bg-surface px-2.5 py-1 font-mono text-sm font-bold text-brand border border-border-subtle">
                  {activeRoute.path}
                </code>
                <span className="text-xs font-mono text-fg-muted">{activeRoute.filePath}</span>
              </div>
            </div>

            {activeRoute.navigableHref && (
              <UIButton
                href={activeRoute.navigableHref}
                variant="primary"
                size="sm"
              >
                Open live route
                <ArrowTopRightOnSquareIcon className="icon-xs" aria-hidden="true" />
              </UIButton>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="relative rounded-control border border-border-subtle bg-surface p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg-primary">
                  <CubeTransparentIcon className="icon-sm text-brand" aria-hidden="true" />
                  1. Shell &amp; Props
                </span>
                <ArrowRightIcon className="icon-xs hidden xl:block text-fg-muted" aria-hidden="true" />
              </div>
              <p className="text-xs font-mono text-brand">{activeRoute.componentName}</p>
              <p className="text-xs font-mono leading-relaxed text-fg-secondary">
                {activeRoute.propsSpec}
              </p>
            </div>

            <div className="relative rounded-control border border-border-subtle bg-surface p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg-primary">
                  <CpuChipIcon className="icon-sm text-accent-violet" aria-hidden="true" />
                  2. Componenten
                </span>
                <ArrowRightIcon className="icon-xs hidden xl:block text-fg-muted" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <span className="label-meta block uppercase tracking-wider">
                  Feature-componenten &amp; Layouts
                </span>
                <ul className="space-y-1">
                  {activeRoute.connectedFeatures.map((feature) => (
                    <li key={feature} className="text-xs font-mono text-fg-secondary">
                      &bull; {feature}
                    </li>
                  ))}
                </ul>
              </div>
              {activeRoute.connectedUiPrimitives.length > 0 && (
                <div className="space-y-1 border-t border-border-subtle pt-2">
                  <span className="label-meta block uppercase tracking-wider">
                    UI-bouwstenen (intern gebruikt)
                  </span>
                  <ul className="space-y-1">
                    {activeRoute.connectedUiPrimitives.map((primitive) => (
                      <li key={primitive} className="text-xs font-mono text-fg-muted">
                        &bull; {primitive}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="relative rounded-control border border-border-subtle bg-surface p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg-primary">
                  <ServerStackIcon className="icon-sm text-accent-emerald" aria-hidden="true" />
                  3. Promises &amp; Data
                </span>
                <ArrowRightIcon className="icon-xs hidden xl:block text-fg-muted" aria-hidden="true" />
              </div>
              <ul className="space-y-1">
                {activeRoute.dataDependencies.map((dep) => (
                  <li key={dep} className="text-xs font-mono leading-relaxed text-fg-secondary">
                    &bull; {dep}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-control border border-border-subtle bg-surface p-4 space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg-primary">
                <LockClosedIcon className="icon-sm text-accent-coral" aria-hidden="true" />
                4. Scope &amp; Guard
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="badge-surface">{activeRoute.scope}</span>
                <span className="badge-surface">{activeRoute.renderMode}</span>
              </div>
              <p className="text-xs leading-relaxed text-fg-secondary">
                {activeRoute.securityNotes}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <span className="label-tech block">Externe &amp; Platform Koppelingen</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {INTEGRATION_SPECS.map((integration) => {
                const isConnected = activeRoute.connectedIntegrations.includes(integration.name)
                return (
                  <div
                    key={integration.name}
                    className={`rounded-control border p-3 transition-all ${isConnected
                        ? 'border-brand/60 bg-surface shadow-md opacity-100'
                        : 'border-border-subtle bg-surface/40 opacity-45'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-fg-primary">
                        {integration.name}
                      </span>
                      {isConnected && (
                        <ShieldCheckIcon className="icon-xs text-brand shrink-0" aria-hidden="true" />
                      )}
                    </div>
                    <p className="label-meta mt-1 font-mono">{integration.category}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
