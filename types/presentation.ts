export type ArchitectureTabId =
  | 'map'
  | 'routes'
  | 'ui'
  | 'scopes'
  | 'promises'
  | 'koppelingen'

export type RouteAccessScope = 'Publiek' | 'Ingelogd' | 'Admin' | 'Systeem'

export type RouteRenderMode =
  | 'PPR + Suspense'
  | 'Route Handler'
  | 'Error Boundary'
  | 'Statisch'

export interface RouteSpec {
  path: string
  navigableHref?: string
  filePath: string
  routeGroup: string
  scope: RouteAccessScope
  renderMode: RouteRenderMode
  summary: string
  componentName: string
  propsSpec: string
  dataDependencies: string[]
  connectedFeatures: string[]
  connectedUiPrimitives: string[]
  connectedIntegrations: string[]
  securityNotes: string
}

export interface UiPrimitiveSpec {
  name: string
  filePath: string
  propsInterface: string
  keyProps: string[]
  foundation: string
  summary: string
  usedIn: string[]
}

export interface FeatureModuleSpec {
  domain: string
  folderPath: string
  boundary: 'Server + Suspense' | 'Client' | 'Hybride (Server + Client)'
  propsInterfaces: string[]
  summary: string
  dataFlow: string
}

export interface ScopeBoundarySpec {
  title: string
  layer: string
  enforcement: string
  summary: string
  files: string[]
  guarantees: string[]
}

export interface PromisePatternSpec {
  title: string
  mechanism: string
  summary: string
  exampleFiles: string[]
  behavior: string
}

export type TimelineFlowId = 'home' | 'movie-detail' | 'trending' | 'search' | 'admin'

export type TimelineRoleView = 'guest' | 'user' | 'admin'

export type TimelineGateStatus =
  | 'direct'
  | 'waiting'
  | 'parallel'
  | 'cached'
  | 'short-circuit'
  | 'interactive'

export type TimelineComponentRole =
  | 'Proxy'
  | 'Layout Shell'
  | 'Page Shell'
  | 'Suspense Boundary'
  | 'Server Content'
  | 'Client Component'
  | 'Error / 404 Boundary'

export interface TimelineBlockPromise {
  call: string
  status: TimelineGateStatus
  statusText: string
}

export interface TimelineComponentBlock {
  id: string
  name: string
  filePath: string
  role: TimelineComponentRole
  status: TimelineGateStatus
  statusLabel: string
  microNote: string
  summary?: string
  fallback?: string
  promises?: TimelineBlockPromise[]
  proceedsWhen: string
  childrenLayout?: 'stack' | 'parallel'
  childrenLabel?: string
  children?: TimelineComponentBlock[]
}

export interface TimelineStageVariant {
  title?: string
  subtitle?: string
  gateTrigger?: string
  layout?: 'single' | 'parallel'
  blocks?: TimelineComponentBlock[]
}

export interface TimelineStageSpec {
  id: string
  order: string
  title: string
  subtitle: string
  gateTrigger: string
  layout: 'single' | 'parallel'
  connectFromBlockIds?: string[]
  blocks: TimelineComponentBlock[]
  variantsByRole?: Partial<Record<TimelineRoleView, TimelineStageVariant>>
}

export interface TimelineFlowSpec {
  id: TimelineFlowId
  routePath: string
  routeHref?: string
  label: string
  badge: string
  scopeTone: 'emerald' | 'brand' | 'violet'
  summary: string
  keyTakeaway: string
  stages: TimelineStageSpec[]
}

export interface IntegrationSpec {
  name: string
  category: 'Database & Auth' | 'Externe API' | 'Media CDN' | 'Hosting & CDN' | 'CI & Release'
  summary: string
  files: string[]
  contracts: string[]
}
