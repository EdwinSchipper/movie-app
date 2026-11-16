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

export interface IntegrationSpec {
  name: string
  category: 'Database & Auth' | 'Externe API' | 'Media CDN' | 'Hosting & CDN' | 'CI & Release'
  summary: string
  files: string[]
  contracts: string[]
}
