'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Field,
  Label,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react'
import {
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
  BoltIcon,
  ChevronDownIcon,
  FunnelIcon,
  LinkIcon,
  ListBulletIcon,
  MapIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline'
import { UIButton, UIInput } from '@/components/ui'
import type { ArchitectureTabId, RouteAccessScope } from '@/types'
import RouteMapOverview from './RouteMapOverview'
import {
  FEATURE_MODULE_SPECS,
  INTEGRATION_SPECS,
  PROMISE_PATTERN_SPECS,
  ROUTE_SPECS,
  SCOPE_BOUNDARY_SPECS,
  UI_PRIMITIVE_SPECS,
} from './presentationData'

const SCOPE_FILTERS: ('Alle' | RouteAccessScope)[] = [
  'Alle',
  'Publiek',
  'Ingelogd',
  'Admin',
  'Systeem',
]

const ARCHITECTURE_FLOW = [
  { step: '01', label: 'Proxy & Routes', detail: 'proxy.ts + Route Groups' },
  { step: '02', label: 'Pure Shells', detail: 'layout + <Suspense>' },
  { step: '03', label: 'Server Promises', detail: 'Promise.all + React.cache()' },
  { step: '04', label: 'UI & Client State', detail: 'Headless UI v2 + Toast' },
  { step: '05', label: 'Externe Koppelingen', detail: 'Supabase, TMDB & Vercel' },
]

const TABS: {
  id: ArchitectureTabId
  label: string
  count: number
  icon: typeof MapIcon
}[] = [
  { id: 'map', label: 'Route Map', count: ROUTE_SPECS.length, icon: MapIcon },
  { id: 'routes', label: 'Routes', count: ROUTE_SPECS.length, icon: ListBulletIcon },
  {
    id: 'ui',
    label: 'Componenten & Props',
    count: UI_PRIMITIVE_SPECS.length + FEATURE_MODULE_SPECS.length,
    icon: Squares2X2Icon,
  },
  { id: 'scopes', label: 'Scopes', count: SCOPE_BOUNDARY_SPECS.length, icon: ShieldCheckIcon },
  { id: 'promises', label: 'Promises', count: PROMISE_PATTERN_SPECS.length, icon: BoltIcon },
  { id: 'koppelingen', label: 'Koppelingen', count: INTEGRATION_SPECS.length, icon: LinkIcon },
]

function getScopeBadgeClass(scope: RouteAccessScope): string {
  if (scope === 'Publiek') return 'badge-emerald'
  if (scope === 'Ingelogd') return 'badge-brand'
  if (scope === 'Admin') return 'badge-violet'
  return 'badge-surface'
}

interface TechnicalDisclosureProps {
  label: string
  children: ReactNode
}

function TechnicalDisclosure({ label, children }: TechnicalDisclosureProps) {
  return (
    <Disclosure as="div" className="mt-4 border-t border-border-subtle pt-3">
      <DisclosureButton className="group inline-flex w-full items-center justify-between gap-2 rounded-control px-2.5 py-2 text-left text-xs font-semibold uppercase tracking-wider text-fg-secondary transition-colors hover:bg-surface-hover hover:text-fg-primary focus:outline-none data-focus:ring-2 data-focus:ring-brand">
        <span>{label}</span>
        <ChevronDownIcon
          className="icon-sm text-fg-muted transition-transform duration-200 group-data-open:rotate-180 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </DisclosureButton>
      <DisclosurePanel className="mt-2 space-y-2 rounded-control bg-canvas/80 p-3.5 text-xs leading-relaxed text-fg-secondary border border-border-subtle">
        {children}
      </DisclosurePanel>
    </Disclosure>
  )
}

export default function PresentationClient() {
  const [selectedScope, setSelectedScope] = useState<'Alle' | RouteAccessScope>('Alle')
  const [searchQuery, setSearchQuery] = useState('')

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredRoutes = ROUTE_SPECS.filter((route) => {
    const matchesScope = selectedScope === 'Alle' || route.scope === selectedScope
    if (!matchesScope) return false
    if (!normalizedQuery) return true

    return (
      route.path.toLowerCase().includes(normalizedQuery) ||
      route.filePath.toLowerCase().includes(normalizedQuery) ||
      route.componentName.toLowerCase().includes(normalizedQuery) ||
      route.summary.toLowerCase().includes(normalizedQuery)
    )
  })

  return (
    <section
      aria-labelledby="presentation-heading"
      className="w-full max-w-6xl mx-auto px-4 py-12 md:py-16 space-y-10"
    >
      <div className="rounded-hero border border-border-subtle bg-surface p-6 md:p-10 shadow-2xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-4">
            <span className="badge-brand">
              Architectuur &amp; Presentatie
            </span>

            <h1 id="presentation-heading" className="h1">
              Movie App — Projectscope &amp; Koppelingen
            </h1>

            <p className="max-w-3xl text-sm md:text-base leading-relaxed text-fg-secondary">
              Volledig overzicht van de Next.js 16 App Router applicatie: van routes,
              toegangsscopes en UI-contracten tot parallelle Promises, React.cache(),
              Supabase RLS en TMDB API v3 integratie.
            </p>
          </div>

          <div className="shrink-0">
            <UIButton href="/tijdlijn" variant="outline" size="sm">
              Bekijk Data stroom
            </UIButton>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-tile border border-border-subtle bg-canvas/70 p-4">
            <span className="label-tech block">Routes &amp; Boundaries</span>
            <p className="mt-1 text-2xl font-bold text-fg-primary">{ROUTE_SPECS.length}</p>
            <p className="label-meta mt-0.5">Paginas, callback, error &amp; 404</p>
          </div>
          <div className="rounded-tile border border-border-subtle bg-canvas/70 p-4">
            <span className="label-tech block">Componenten</span>
            <p className="mt-1 text-2xl font-bold text-fg-primary">
              {UI_PRIMITIVE_SPECS.length}{' '}
              <span className="text-base font-normal text-fg-muted">+</span>{' '}
              {FEATURE_MODULE_SPECS.length}
            </p>
            <p className="label-meta mt-0.5">
              {UI_PRIMITIVE_SPECS.length} UI-bouwstenen &bull; {FEATURE_MODULE_SPECS.length} feature-componenten
            </p>
          </div>
          <div className="rounded-tile border border-border-subtle bg-canvas/70 p-4">
            <span className="label-tech block">Scope &amp; Promises</span>
            <p className="mt-1 text-2xl font-bold text-fg-primary">
              {SCOPE_BOUNDARY_SPECS.length}{' '}
              <span className="text-base font-normal text-fg-muted">+</span>{' '}
              {PROMISE_PATTERN_SPECS.length}
            </p>
            <p className="label-meta mt-0.5">
              {SCOPE_BOUNDARY_SPECS.length} scopes &bull; {PROMISE_PATTERN_SPECS.length} async patronen
            </p>
          </div>
          <div className="rounded-tile border border-border-subtle bg-canvas/70 p-4">
            <span className="label-tech block">Koppelingen</span>
            <p className="mt-1 text-2xl font-bold text-fg-primary">{INTEGRATION_SPECS.length}</p>
            <p className="label-meta mt-0.5">Supabase, TMDB, Vercel, GitHub CI</p>
          </div>
        </div>

        <div className="space-y-3">
          <span className="label-tech block">End-to-end Architectuurstroom</span>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {ARCHITECTURE_FLOW.map((item, index) => (
              <div
                key={item.step}
                className="relative flex flex-col justify-between rounded-tile border border-border-subtle bg-canvas/60 p-3.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-brand">{item.step}</span>
                  {index < ARCHITECTURE_FLOW.length - 1 && (
                    <ArrowRightIcon
                      className="icon-xs hidden md:block text-fg-muted"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <p className="mt-2 text-sm font-semibold text-fg-primary">{item.label}</p>
                <p className="label-meta mt-0.5 font-mono">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TabGroup>
        <TabList
          aria-label="Architectuur pijlers"
          className="flex flex-wrap gap-2 rounded-card border border-border-subtle bg-surface p-2"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <Tab
                key={tab.id}
                className="inline-flex min-h-10 items-center gap-2 rounded-control px-4 py-2 text-sm font-semibold text-fg-secondary transition-colors cursor-pointer hover:bg-surface-hover hover:text-fg-primary focus:outline-none data-focus:ring-2 data-focus:ring-brand data-selected:bg-brand data-selected:text-brand-fg"
              >
                <Icon className="icon-sm" aria-hidden="true" />
                <span>{tab.label}</span>
                <span className="rounded-pill bg-black/20 px-2 py-0.5 text-xs font-mono">
                  {tab.count}
                </span>
              </Tab>
            )
          })}
        </TabList>

        <TabPanels className="mt-6">
          <TabPanel className="focus:outline-none">
            <RouteMapOverview />
          </TabPanel>

          <TabPanel className="space-y-6 focus:outline-none">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 rounded-card border border-border-subtle bg-surface p-4 md:p-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-fg-secondary">
                  <FunnelIcon className="icon-sm" aria-hidden="true" />
                  <span className="label-form">Filter op toegangsscope</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SCOPE_FILTERS.map((scope) => (
                    <UIButton
                      key={scope}
                      type="button"
                      size="sm"
                      variant={selectedScope === scope ? 'primary' : 'outline'}
                      onClick={() => setSelectedScope(scope)}
                    >
                      {scope}
                    </UIButton>
                  ))}
                </div>
              </div>

              <Field className="w-full md:w-72 space-y-1.5">
                <Label className="label-form block">
                  Zoek route, bestand of component
                </Label>
                <UIInput
                  type="search"
                  placeholder="bijv. /admin, Watchlist, error..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </Field>
            </div>

            {filteredRoutes.length === 0 ? (
              <div className="rounded-card border border-border-subtle bg-surface p-8 text-center">
                <p className="text-sm text-fg-secondary">
                  Geen routes gevonden voor &ldquo;{searchQuery}&rdquo; binnen scope &ldquo;{selectedScope}&rdquo;.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredRoutes.map((route) => (
                  <article
                    key={route.path}
                    className="flex flex-col justify-between rounded-card border border-border-subtle bg-surface p-5"
                  >
                    <div>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <code className="rounded-control bg-canvas px-2.5 py-1 font-mono text-sm font-bold text-brand border border-border-subtle">
                            {route.path}
                          </code>
                          {route.navigableHref && (
                            <Link
                              href={route.navigableHref}
                              className="inline-flex min-h-7 items-center gap-1 rounded-pill border border-border-default bg-canvas/60 px-2.5 py-0.5 text-xs font-medium text-fg-secondary transition-colors hover:border-accent-blue-hover hover:text-accent-blue-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/60"
                            >
                              Open
                              <ArrowTopRightOnSquareIcon className="icon-xs" aria-hidden="true" />
                            </Link>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={getScopeBadgeClass(route.scope)}>
                            {route.scope}
                          </span>
                          <span className="badge-surface">
                            {route.renderMode}
                          </span>
                        </div>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-fg-secondary">
                        {route.summary}
                      </p>
                    </div>

                    <TechnicalDisclosure label="Technische spec: props, data &amp; beveiliging">
                      <p>
                        <strong className="text-fg-primary">Bestand:</strong>{' '}
                        <code className="font-mono text-brand">{route.filePath}</code> ({route.routeGroup})
                      </p>
                      <p>
                        <strong className="text-fg-primary">Component:</strong>{' '}
                        <code className="font-mono">{route.componentName}</code>
                      </p>
                      <p>
                        <strong className="text-fg-primary">Props:</strong>{' '}
                        <code className="font-mono">{route.propsSpec}</code>
                      </p>
                      <div>
                        <strong className="text-fg-primary">Data &amp; Promises:</strong>
                        <ul className="mt-1 list-disc pl-5 space-y-0.5">
                          {route.dataDependencies.map((dep) => (
                            <li key={dep} className="font-mono">{dep}</li>
                          ))}
                        </ul>
                      </div>
                      <p>
                        <strong className="text-fg-primary">Beveiliging &amp; Scope:</strong>{' '}
                        {route.securityNotes}
                      </p>
                    </TechnicalDisclosure>
                  </article>
                ))}
              </div>
            )}
          </TabPanel>

          <TabPanel className="space-y-8 focus:outline-none">
            <div className="space-y-4">
              <div>
                <h2 className="h2">UI-bouwstenen (components/ui/)</h2>
                <p className="mt-1 text-sm text-fg-secondary">
                  Verplichte herbruikbare basiscomponenten gebouwd op Headless UI v2, react-toastify v11 en Tailwind CSS v4 tokens.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {UI_PRIMITIVE_SPECS.map((primitive) => (
                  <article
                    key={primitive.name}
                    className="flex flex-col justify-between rounded-card border border-border-subtle bg-surface p-5"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="h4 font-mono text-brand">{primitive.name}</h3>
                        <span className="badge-surface">UI-bouwsteen</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-fg-secondary">
                        {primitive.summary}
                      </p>
                    </div>

                    <TechnicalDisclosure label="Props &amp; gebruik">
                      <p>
                        <strong className="text-fg-primary">Bestand:</strong>{' '}
                        <code className="font-mono text-brand">{primitive.filePath}</code>
                      </p>
                      <p>
                        <strong className="text-fg-primary">Interface:</strong>{' '}
                        <code className="font-mono">{primitive.propsInterface}</code>
                      </p>
                      <p>
                        <strong className="text-fg-primary">Basis:</strong> {primitive.foundation}
                      </p>
                      <div>
                        <strong className="text-fg-primary">Belangrijkste props:</strong>
                        <ul className="mt-1 list-disc pl-5 space-y-0.5">
                          {primitive.keyProps.map((prop) => (
                            <li key={prop} className="font-mono">{prop}</li>
                          ))}
                        </ul>
                      </div>
                      <p>
                        <strong className="text-fg-primary">Gebruikt in:</strong>{' '}
                        {primitive.usedIn.join(', ')}
                      </p>
                    </TechnicalDisclosure>
                  </article>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="h2">Feature-componenten (components/features/)</h2>
                <p className="mt-1 text-sm text-fg-secondary">
                  Zelfvoorzienende domeincomponenten met eigen &lt;Suspense&gt; grenzen, Server/Client scheiding en getypeerde props.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {FEATURE_MODULE_SPECS.map((feature) => (
                  <article
                    key={feature.domain}
                    className="flex flex-col justify-between rounded-card border border-border-subtle bg-surface p-5"
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="h4 font-mono text-fg-primary">{feature.domain}</h3>
                        <span className="badge-violet">{feature.boundary}</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-fg-secondary">
                        {feature.summary}
                      </p>
                    </div>

                    <TechnicalDisclosure label="Props-contracten &amp; dataflow">
                      <p>
                        <strong className="text-fg-primary">Map:</strong>{' '}
                        <code className="font-mono text-brand">{feature.folderPath}</code>
                      </p>
                      <div>
                        <strong className="text-fg-primary">Geëxporteerde Props interfaces:</strong>
                        <ul className="mt-1 list-disc pl-5 space-y-0.5">
                          {feature.propsInterfaces.map((item) => (
                            <li key={item} className="font-mono">{item}</li>
                          ))}
                        </ul>
                      </div>
                      <p>
                        <strong className="text-fg-primary">Dataflow:</strong> {feature.dataFlow}
                      </p>
                    </TechnicalDisclosure>
                  </article>
                ))}
              </div>
            </div>
          </TabPanel>

          <TabPanel className="grid grid-cols-1 md:grid-cols-2 gap-5 focus:outline-none">
            {SCOPE_BOUNDARY_SPECS.map((scopeItem) => (
              <article
                key={scopeItem.title}
                className="flex flex-col justify-between rounded-card border border-border-subtle bg-surface p-5"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="badge-emerald">{scopeItem.layer}</span>
                    <code className="font-mono text-xs text-fg-muted">{scopeItem.enforcement}</code>
                  </div>
                  <h2 className="h3 mt-3">{scopeItem.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-fg-secondary">
                    {scopeItem.summary}
                  </p>
                </div>

                <TechnicalDisclosure label="Afdwinging &amp; bronbestanden">
                  <div>
                    <strong className="text-fg-primary">Architecturale garanties:</strong>
                    <ul className="mt-1 list-disc pl-5 space-y-1">
                      {scopeItem.guarantees.map((guarantee) => (
                        <li key={guarantee}>{guarantee}</li>
                      ))}
                    </ul>
                  </div>
                  <p>
                    <strong className="text-fg-primary">Bestanden:</strong>{' '}
                    <code className="font-mono text-brand">{scopeItem.files.join(', ')}</code>
                  </p>
                </TechnicalDisclosure>
              </article>
            ))}
          </TabPanel>

          <TabPanel className="grid grid-cols-1 md:grid-cols-2 gap-5 focus:outline-none">
            {PROMISE_PATTERN_SPECS.map((pattern) => (
              <article
                key={pattern.title}
                className="flex flex-col justify-between rounded-card border border-border-subtle bg-surface p-5"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="badge-brand font-mono">{pattern.mechanism}</span>
                  </div>
                  <h2 className="h3 mt-3">{pattern.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-fg-secondary">
                    {pattern.summary}
                  </p>
                </div>

                <TechnicalDisclosure label="Uitvoering &amp; toepassingen">
                  <p>
                    <strong className="text-fg-primary">Werking:</strong> {pattern.behavior}
                  </p>
                  <div>
                    <strong className="text-fg-primary">Toegepast in:</strong>
                    <ul className="mt-1 list-disc pl-5 space-y-0.5">
                      {pattern.exampleFiles.map((file) => (
                        <li key={file} className="font-mono text-brand">{file}</li>
                      ))}
                    </ul>
                  </div>
                </TechnicalDisclosure>
              </article>
            ))}
          </TabPanel>

          <TabPanel className="grid grid-cols-1 md:grid-cols-2 gap-5 focus:outline-none">
            {INTEGRATION_SPECS.map((integration) => (
              <article
                key={integration.name}
                className="flex flex-col justify-between rounded-card border border-border-subtle bg-surface p-5"
              >
                <div>
                  <span className="badge-violet">{integration.category}</span>
                  <h2 className="h3 mt-3">{integration.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-fg-secondary">
                    {integration.summary}
                  </p>
                </div>

                <TechnicalDisclosure label="Contracten &amp; koppellagen">
                  <div>
                    <strong className="text-fg-primary">Belangrijkste afspraken:</strong>
                    <ul className="mt-1 list-disc pl-5 space-y-1">
                      {integration.contracts.map((contract) => (
                        <li key={contract}>{contract}</li>
                      ))}
                    </ul>
                  </div>
                  <p>
                    <strong className="text-fg-primary">Bestanden:</strong>{' '}
                    <code className="font-mono text-brand">{integration.files.join(', ')}</code>
                  </p>
                </TechnicalDisclosure>
              </article>
            ))}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </section>
  )
}
