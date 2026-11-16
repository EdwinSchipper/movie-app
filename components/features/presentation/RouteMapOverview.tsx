'use client'

import { createContext, useContext, useState } from 'react'
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MarkerType,
  Panel,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  ArrowTopRightOnSquareIcon,
  CpuChipIcon,
  CubeTransparentIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ServerStackIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { UIButton } from '@/components/ui'
import type { IntegrationSpec, RouteSpec } from '@/types'
import { INTEGRATION_SPECS, ROUTE_SPECS } from './presentationData'

interface RouteGroupBranch {
  id: string
  title: string
  subtitle: string
  badgeClass: string
  y: number
  paths: string[]
}

const ROUTE_MAP_BRANCHES: RouteGroupBranch[] = [
  {
    id: 'group-public',
    title: 'Publiek & Ontdekken',
    subtitle: 'Basis Route Group (PPR)',
    badgeClass: 'badge-emerald',
    y: 0,
    paths: ['/', '/trending', '/movies/[id]', '/tv/[id]', '/recommendations'],
  },
  {
    id: 'group-auth',
    title: 'Authenticatie & PKCE',
    subtitle: '(auth) Route Group',
    badgeClass: 'badge-surface',
    y: 180,
    paths: ['/login', '/register', '/auth/callback'],
  },
  {
    id: 'group-user',
    title: 'Persoonlijke Scope',
    subtitle: '(user) + Watchlist RLS',
    badgeClass: 'badge-brand',
    y: 320,
    paths: ['/watchlist', '/account', '/account/profile', '/account/settings', '/account/watchlist'],
  },
  {
    id: 'group-admin',
    title: 'Admin RBAC & Systeem',
    subtitle: '(admin) + Error / 404',
    badgeClass: 'badge-violet',
    y: 495,
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

function findBranchIdForPath(path: string): string {
  const match = ROUTE_MAP_BRANCHES.find((branch) => branch.paths.includes(path))
  return match?.id ?? 'group-public'
}

interface RouteMapSelectionContextValue {
  selectedPath: string
  onSelectPath: (path: string) => void
}

const RouteMapSelectionContext = createContext<RouteMapSelectionContextValue>({
  selectedPath: '/movies/[id]',
  onSelectPath: () => {},
})

type RootNodeData = {
  title: string
  subtitle: string
}

type RouteGroupNodeData = {
  branch: RouteGroupBranch
  isActiveBranch: boolean
}

type RouteDetailKind = 'shell' | 'components' | 'promises' | 'security'

type RouteDetailNodeData = {
  kind: RouteDetailKind
  route: RouteSpec
}

type IntegrationNodeData = {
  integration: IntegrationSpec
  isConnected: boolean
}

type RootFlowNode = Node<RootNodeData, 'rootNode'>
type RouteGroupFlowNodeType = Node<RouteGroupNodeData, 'routeGroupNode'>
type RouteDetailFlowNodeType = Node<RouteDetailNodeData, 'routeDetailNode'>
type IntegrationFlowNodeType = Node<IntegrationNodeData, 'integrationNode'>

type RouteMapFlowNode =
  | RootFlowNode
  | RouteGroupFlowNodeType
  | RouteDetailFlowNodeType
  | IntegrationFlowNodeType

function RootShellNode({ data }: NodeProps<RootFlowNode>) {
  return (
    <div className="w-60 rounded-tile border border-brand/50 bg-surface p-4 shadow-xl">
      <div className="flex items-start gap-3">
        <span className="icon-tile shrink-0 text-brand">
          <GlobeAltIcon className="icon-md" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <span className="label-tech block text-2xs">Ingang &amp; Shell</span>
          <p className="text-sm font-bold text-fg-primary leading-snug mt-0.5">
            {data.title}
          </p>
        </div>
      </div>
      <p className="mt-2.5 text-2xs leading-relaxed text-fg-secondary">
        {data.subtitle}
      </p>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={false}
        className="size-2.5! border-2! border-brand! bg-canvas!"
      />
    </div>
  )
}

function RouteGroupFlowNode({ data }: NodeProps<RouteGroupFlowNodeType>) {
  const { branch, isActiveBranch } = data
  const { selectedPath, onSelectPath } = useContext(RouteMapSelectionContext)

  return (
    <div
      className={`w-80 rounded-tile border p-3.5 shadow-lg transition-colors ${
        isActiveBranch
          ? 'border-brand/60 bg-surface-hover/90'
          : 'border-border-default bg-surface/95'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={false}
        className="size-2.5! border-2! border-border-default! bg-canvas!"
      />

      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className={branch.badgeClass}>{branch.title}</span>
        <span className="font-mono text-2xs text-fg-muted">{branch.subtitle}</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 nodrag nopan">
        {branch.paths.map((path) => {
          const isSelected = path === selectedPath
          return (
            <UIButton
              key={path}
              type="button"
              size="xs"
              variant={isSelected ? 'primary' : 'outline'}
              onClick={() => onSelectPath(path)}
              className="w-full justify-between"
            >
              <span className="truncate font-mono">{path}</span>
            </UIButton>
          )
        })}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={false}
        className={
          isActiveBranch
            ? 'size-2.5! border-2! border-brand! bg-canvas!'
            : 'size-2! border! border-border-default! bg-canvas!'
        }
      />
    </div>
  )
}

function RouteDetailFlowNode({ data }: NodeProps<RouteDetailFlowNodeType>) {
  const { kind, route } = data

  if (kind === 'shell') {
    return (
      <div className="w-72 rounded-tile border border-border-default bg-surface p-4 shadow-lg">
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={false}
          className="size-2.5! border-2! border-brand! bg-canvas!"
        />
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg-primary">
          <CubeTransparentIcon className="icon-sm text-brand" aria-hidden="true" />
          1. Shell &amp; Props
        </span>
        <p className="mt-2 font-mono text-xs font-semibold text-brand truncate">
          {route.componentName}
        </p>
        <p className="mt-1 font-mono text-2xs leading-relaxed text-fg-secondary line-clamp-3">
          {route.propsSpec}
        </p>
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={false}
          className="opacity-0! pointer-events-none!"
        />
      </div>
    )
  }

  if (kind === 'components') {
    return (
      <div className="w-72 rounded-tile border border-border-default bg-surface p-4 shadow-lg">
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={false}
          className="size-2.5! border-2! border-brand! bg-canvas!"
        />
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg-primary">
          <CpuChipIcon className="icon-sm text-accent-violet" aria-hidden="true" />
          2. Componenten
        </span>
        <ul className="mt-2 space-y-0.5">
          {route.connectedFeatures.slice(0, 4).map((feature) => (
            <li key={feature} className="font-mono text-2xs text-fg-secondary truncate">
              &bull; {feature}
            </li>
          ))}
        </ul>
        {route.connectedUiPrimitives.length > 0 && (
          <p className="mt-1.5 border-t border-border-subtle pt-1.5 font-mono text-2xs text-fg-muted truncate">
            UI: {route.connectedUiPrimitives.join(', ')}
          </p>
        )}
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={false}
          className="opacity-0! pointer-events-none!"
        />
      </div>
    )
  }

  if (kind === 'promises') {
    return (
      <div className="w-72 rounded-tile border border-border-default bg-surface p-4 shadow-lg">
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={false}
          className="size-2.5! border-2! border-brand! bg-canvas!"
        />
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg-primary">
          <ServerStackIcon className="icon-sm text-accent-emerald" aria-hidden="true" />
          3. Promises &amp; Data
        </span>
        <ul className="mt-2 space-y-1">
          {route.dataDependencies.slice(0, 3).map((dep) => (
            <li key={dep} className="font-mono text-2xs leading-snug text-fg-secondary">
              &bull; {dep}
            </li>
          ))}
        </ul>
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={false}
          className="size-2.5! border-2! border-accent-emerald! bg-canvas!"
        />
      </div>
    )
  }

  return (
    <div className="w-72 rounded-tile border border-border-default bg-surface p-4 shadow-lg">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={false}
        className="size-2.5! border-2! border-brand! bg-canvas!"
      />
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg-primary">
          <LockClosedIcon className="icon-sm text-accent-coral" aria-hidden="true" />
          4. Scope &amp; Guard
        </span>
        <span className="badge-surface">{route.scope}</span>
      </div>
      <p className="mt-2 text-2xs leading-relaxed text-fg-secondary line-clamp-3">
        {route.securityNotes}
      </p>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={false}
        className="size-2.5! border-2! border-brand! bg-canvas!"
      />
    </div>
  )
}

function IntegrationFlowNode({ data }: NodeProps<IntegrationFlowNodeType>) {
  const { integration, isConnected } = data

  return (
    <div
      className={`w-60 rounded-tile border p-3.5 transition-all ${
        isConnected
          ? 'border-brand/70 bg-surface shadow-lg opacity-100'
          : 'border-border-subtle bg-surface/40 opacity-45'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={false}
        className={
          isConnected
            ? 'size-2.5! border-2! border-accent-emerald! bg-canvas!'
            : 'size-2! border! border-border-default! bg-canvas!'
        }
      />
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-fg-primary leading-snug">
          {integration.name}
        </span>
        {isConnected && (
          <ShieldCheckIcon className="icon-xs text-brand shrink-0" aria-hidden="true" />
        )}
      </div>
      <p className="mt-1 font-mono text-2xs text-fg-muted">{integration.category}</p>
    </div>
  )
}

const ROUTE_MAP_NODE_TYPES = {
  rootNode: RootShellNode,
  routeGroupNode: RouteGroupFlowNode,
  routeDetailNode: RouteDetailFlowNode,
  integrationNode: IntegrationFlowNode,
}

function buildRouteMapGraph(activeRoute: RouteSpec): {
  nodes: RouteMapFlowNode[]
  edges: Edge[]
} {
  const activeBranchId = findBranchIdForPath(activeRoute.path)

  const rootNode: RootFlowNode = {
    id: 'root-shell',
    type: 'rootNode',
    position: { x: 0, y: 245 },
    data: {
      title: 'proxy.ts -> RootLayout',
      subtitle:
        'Ververst sessie via updateSession() en rendert HeaderSearch, MainNav, UserNav & Footer.',
    },
  }

  const groupNodes: RouteGroupFlowNodeType[] = ROUTE_MAP_BRANCHES.map((branch) => ({
    id: branch.id,
    type: 'routeGroupNode',
    position: { x: 310, y: branch.y },
    data: {
      branch,
      isActiveBranch: branch.id === activeBranchId,
    },
  }))

  const detailNodes: RouteDetailFlowNodeType[] = [
    {
      id: 'detail-shell',
      type: 'routeDetailNode',
      position: { x: 705, y: 0 },
      data: { kind: 'shell', route: activeRoute },
    },
    {
      id: 'detail-components',
      type: 'routeDetailNode',
      position: { x: 705, y: 170 },
      data: { kind: 'components', route: activeRoute },
    },
    {
      id: 'detail-promises',
      type: 'routeDetailNode',
      position: { x: 705, y: 350 },
      data: { kind: 'promises', route: activeRoute },
    },
    {
      id: 'detail-security',
      type: 'routeDetailNode',
      position: { x: 705, y: 515 },
      data: { kind: 'security', route: activeRoute },
    },
  ]

  const integrationNodes: IntegrationFlowNodeType[] = INTEGRATION_SPECS.map(
    (integration, index) => ({
      id: `integration-${integration.name}`,
      type: 'integrationNode',
      position: { x: 1065, y: index * 126 + 20 },
      data: {
        integration,
        isConnected: activeRoute.connectedIntegrations.includes(integration.name),
      },
    })
  )

  const edges: Edge[] = []

  ROUTE_MAP_BRANCHES.forEach((branch) => {
    const isActive = branch.id === activeBranchId
    edges.push({
      id: `root-to-${branch.id}`,
      source: 'root-shell',
      target: branch.id,
      animated: isActive,
      style: {
        stroke: isActive ? '#e2ff32' : '#4a4a52',
        strokeWidth: isActive ? 2.25 : 1.25,
      },
      markerEnd: isActive
        ? { type: MarkerType.ArrowClosed, width: 15, height: 15, color: '#e2ff32' }
        : undefined,
    })
  })

  detailNodes.forEach((detailNode) => {
    edges.push({
      id: `${activeBranchId}-to-${detailNode.id}`,
      source: activeBranchId,
      target: detailNode.id,
      animated: true,
      style: {
        stroke: '#e2ff32',
        strokeWidth: 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 15,
        height: 15,
        color: '#e2ff32',
      },
    })
  })

  INTEGRATION_SPECS.forEach((integration) => {
    const isConnected = activeRoute.connectedIntegrations.includes(integration.name)
    if (!isConnected) return

    const sourceId =
      integration.category === 'Hosting & CDN' || integration.category === 'CI & Release'
        ? 'detail-security'
        : 'detail-promises'

    edges.push({
      id: `${sourceId}-to-${integration.name}`,
      source: sourceId,
      target: `integration-${integration.name}`,
      animated: true,
      style: {
        stroke: '#12b76a',
        strokeWidth: 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 15,
        height: 15,
        color: '#12b76a',
      },
    })
  })

  return {
    nodes: [rootNode, ...groupNodes, ...detailNodes, ...integrationNodes],
    edges,
  }
}

export default function RouteMapOverview() {
  const [selectedPath, setSelectedPath] = useState<string>('/movies/[id]')

  const activeRoute = routeByPath.get(selectedPath) ?? ROUTE_SPECS[0]
  const initialGraph = buildRouteMapGraph(activeRoute)

  const [nodes, setNodes, onNodesChange] = useNodesState<RouteMapFlowNode>(
    initialGraph.nodes
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialGraph.edges)

  const handleSelectPath = (path: string) => {
    const nextRoute = routeByPath.get(path) ?? ROUTE_SPECS[0]
    const nextGraph = buildRouteMapGraph(nextRoute)
    const nextNodeById = new Map<string, RouteMapFlowNode>(
      nextGraph.nodes.map((node) => [node.id, node])
    )

    setSelectedPath(path)
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        const updated = nextNodeById.get(node.id)
        if (!updated) return node
        return {
          ...node,
          data: updated.data,
        } as RouteMapFlowNode
      })
    )
    setEdges(nextGraph.edges)
  }

  return (
    <RouteMapSelectionContext.Provider
      value={{ selectedPath: activeRoute.path, onSelectPath: handleSelectPath }}
    >
      <div className="space-y-6">
        <div className="rounded-card border border-border-subtle bg-surface p-5 md:p-7 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="h2">Visuele Route &amp; Architectuurkaart</h2>
              <p className="mt-1 text-sm text-fg-secondary">
                Klik direct op een route binnen de React Flow groepen om alle verbonden
                architectuur-nodes en externe koppelingen live te laten oplichten.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
              <span className="badge-brand font-mono">
                Actief: {activeRoute.path}
              </span>
              {activeRoute.navigableHref && (
                <UIButton href={activeRoute.navigableHref} variant="outline" size="xs">
                  Open route
                  <ArrowTopRightOnSquareIcon className="icon-xs" aria-hidden="true" />
                </UIButton>
              )}
            </div>
          </div>

          <div className="h-148 lg:h-172 w-full rounded-tile border border-border-default bg-canvas overflow-hidden">
            <ReactFlowProvider>
              <ReactFlow<RouteMapFlowNode, Edge>
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={ROUTE_MAP_NODE_TYPES}
                forceColorMode="dark"
                fitView
                fitViewOptions={{ padding: 0.14 }}
                minZoom={0.4}
                maxZoom={1.5}
                nodesConnectable={false}
                elementsSelectable={false}
              >
                <Background
                  variant={BackgroundVariant.Dots}
                  gap={22}
                  size={1.2}
                  color="rgba(255, 255, 255, 0.14)"
                />
                <Controls showInteractive={false} />
                <Panel position="top-left">
                  <div className="rounded-pill border border-border-subtle bg-surface/90 px-3 py-1.5 text-xs text-fg-secondary backdrop-blur">
                    Bestand:{' '}
                    <code className="font-mono text-brand">{activeRoute.filePath}</code>
                    <span className="hidden sm:inline text-fg-muted ml-2">
                      &bull; Klik routes in de nodes, sleep of zoom
                    </span>
                  </div>
                </Panel>
              </ReactFlow>
            </ReactFlowProvider>
          </div>

          <div className="rounded-tile border border-border-subtle bg-canvas/70 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-fg-secondary">
            <p>
              <strong className="text-fg-primary">{activeRoute.path}:</strong>{' '}
              {activeRoute.summary}
            </p>
            <span className="badge-surface shrink-0 font-mono">{activeRoute.renderMode}</span>
          </div>
        </div>
      </div>
    </RouteMapSelectionContext.Provider>
  )
}
