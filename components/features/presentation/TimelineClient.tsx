'use client'

import { useEffect, useState } from 'react'
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
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline'
import { UIButton } from '@/components/ui'
import type {
  TimelineComponentBlock,
  TimelineFlowId,
  TimelineGateStatus,
  TimelineRoleView,
  TimelineStageSpec,
} from '@/types'
import { TIMELINE_FLOW_SPECS } from './timelineData'

const ROLE_VIEWS: {
  id: TimelineRoleView
  label: string
  hint: string
}[] = [
  { id: 'guest', label: 'Bezoeker', hint: 'user === null' },
  { id: 'user', label: 'Gebruiker', hint: "role: 'user'" },
  { id: 'admin', label: 'Admin', hint: "role: 'admin'" },
]

const STATUS_LEGEND: {
  label: string
  dotClass: string
}[] = [
  { label: 'Direct', dotClass: 'bg-fg-muted' },
  { label: 'Wacht af', dotClass: 'bg-accent-coral' },
  { label: 'Parallel', dotClass: 'bg-accent-emerald' },
  { label: 'Gecacht 1×', dotClass: 'bg-accent-blue-hover' },
  { label: 'Kortgesloten', dotClass: 'bg-accent-violet' },
  { label: 'Client', dotClass: 'bg-brand' },
]

const NODE_HEIGHT = 136
const HORIZONTAL_STEP = 385
const VERTICAL_GAP = 28

type ArchitectureNodeData = {
  block: TimelineComponentBlock
  stageOrder: string
  hasIncoming: boolean
  hasOutgoing: boolean
}

type ArchitectureNode = Node<ArchitectureNodeData, 'componentNode'>

interface FlattenedDiagramNode {
  stageOrder: string
  stageTitle: string
  block: TimelineComponentBlock
}

function getStatusVisuals(status: TimelineGateStatus): {
  dotClass: string
  barClass: string
  barWidthClass: string
  textClass: string
  badgeClass: string
  stripeClass: string
  strokeColor: string
  edgePillBg: string
  edgePillText: string
} {
  switch (status) {
    case 'direct':
      return {
        dotClass: 'bg-fg-muted',
        barClass: 'bg-fg-muted',
        barWidthClass: 'w-full',
        textClass: 'text-fg-secondary',
        badgeClass: 'bg-surface-hover text-fg-secondary',
        stripeClass: 'border-l-border-default',
        strokeColor: '#8e8e93',
        edgePillBg: '#2e2e2e',
        edgePillText: '#f5f5f5',
      }
    case 'waiting':
      return {
        dotClass: 'bg-accent-coral',
        barClass: 'bg-accent-coral',
        barWidthClass: 'w-3/5',
        textClass: 'text-accent-coral',
        badgeClass: 'bg-accent-coral/15 text-accent-coral',
        stripeClass: 'border-l-accent-coral/70',
        strokeColor: '#ff4d2d',
        edgePillBg: '#ff4d2d',
        edgePillText: '#ffffff',
      }
    case 'parallel':
      return {
        dotClass: 'bg-accent-emerald',
        barClass: 'bg-accent-emerald',
        barWidthClass: 'w-full',
        textClass: 'text-accent-emerald',
        badgeClass: 'bg-accent-emerald/15 text-accent-emerald',
        stripeClass: 'border-l-accent-emerald/70',
        strokeColor: '#12b76a',
        edgePillBg: '#12b76a',
        edgePillText: '#ffffff',
      }
    case 'cached':
      return {
        dotClass: 'bg-accent-blue-hover',
        barClass: 'bg-accent-blue-hover',
        barWidthClass: 'w-full',
        textClass: 'text-accent-blue-hover',
        badgeClass: 'bg-accent-blue/20 text-accent-blue-hover',
        stripeClass: 'border-l-accent-blue-hover/70',
        strokeColor: '#3b82f6',
        edgePillBg: '#2563eb',
        edgePillText: '#ffffff',
      }
    case 'short-circuit':
      return {
        dotClass: 'bg-accent-violet',
        barClass: 'bg-accent-violet',
        barWidthClass: 'w-1/4',
        textClass: 'text-accent-violet',
        badgeClass: 'bg-accent-violet/20 text-accent-violet',
        stripeClass: 'border-l-accent-violet/70',
        strokeColor: '#8b5cf6',
        edgePillBg: '#8b5cf6',
        edgePillText: '#ffffff',
      }
    case 'interactive':
      return {
        dotClass: 'bg-brand',
        barClass: 'bg-brand',
        barWidthClass: 'w-5/6',
        textClass: 'text-brand',
        badgeClass: 'bg-brand/15 text-brand',
        stripeClass: 'border-l-brand/70',
        strokeColor: '#e2ff32',
        edgePillBg: '#e2ff32',
        edgePillText: '#111111',
      }
  }
}

function resolveStageForRole(
  stage: TimelineStageSpec,
  roleView: TimelineRoleView
): TimelineStageSpec {
  const variant = stage.variantsByRole?.[roleView]
  if (!variant) return stage

  return {
    ...stage,
    title: variant.title ?? stage.title,
    subtitle: variant.subtitle ?? stage.subtitle,
    gateTrigger: variant.gateTrigger ?? stage.gateTrigger,
    layout: variant.layout ?? stage.layout,
    blocks: variant.blocks ?? stage.blocks,
  }
}

function collectBlockNodes(
  blocks: TimelineComponentBlock[],
  stageOrder: string,
  stageTitle: string
): FlattenedDiagramNode[] {
  const collected: FlattenedDiagramNode[] = []
  for (const block of blocks) {
    collected.push({ stageOrder, stageTitle, block })
    if (block.children && block.children.length > 0) {
      collected.push(...collectBlockNodes(block.children, stageOrder, stageTitle))
    }
  }
  return collected
}

function measureSubtreeHeight(block: TimelineComponentBlock): number {
  const children = block.children ?? []
  if (children.length === 0) {
    return NODE_HEIGHT
  }

  if (block.childrenLayout === 'parallel') {
    const childHeights = children.map(measureSubtreeHeight)
    const total =
      childHeights.reduce((sum, height) => sum + height, 0) +
      Math.max(0, children.length - 1) * VERTICAL_GAP
    return Math.max(NODE_HEIGHT, total)
  }

  const maxChild = Math.max(...children.map(measureSubtreeHeight))
  return Math.max(NODE_HEIGHT, maxChild)
}

function measureSubtreeColumns(block: TimelineComponentBlock): number {
  const children = block.children ?? []
  if (children.length === 0) {
    return 1
  }

  if (block.childrenLayout === 'parallel') {
    return 1 + Math.max(...children.map(measureSubtreeColumns))
  }

  return 1 + children.reduce((sum, child) => sum + measureSubtreeColumns(child), 0)
}

function buildFlowEdge(
  id: string,
  source: string,
  target: string,
  status: TimelineGateStatus,
  pillLabel: string
): Edge {
  const visuals = getStatusVisuals(status)
  const isAnimated =
    status === 'waiting' ||
    status === 'parallel' ||
    status === 'cached' ||
    status === 'interactive'

  return {
    id,
    source,
    target,
    label: pillLabel,
    labelStyle: {
      fill: visuals.edgePillText,
      fontSize: 11,
      fontWeight: 600,
    },
    labelBgStyle: {
      fill: visuals.edgePillBg,
      stroke: 'transparent',
    },
    labelBgPadding: [8, 3],
    labelBgBorderRadius: 999,
    animated: isAnimated,
    style: {
      stroke: visuals.strokeColor,
      strokeWidth: status === 'short-circuit' ? 1.5 : 2,
      strokeDasharray: '5 5',
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 14,
      height: 14,
      color: visuals.strokeColor,
    },
  }
}

function buildHorizontalGraphForStages(
  stages: TimelineStageSpec[],
  selectedBlockId: string
): { nodes: ArchitectureNode[]; edges: Edge[] } {
  const rawNodes: ArchitectureNode[] = []
  const rawEdges: Edge[] = []
  const incomingNodeIds = new Set<string>()
  const outgoingNodeIds = new Set<string>()
  const placedNodeIds = new Set<string>()
  const placedCenterY = new Map<string, number>()

  const placeSubtree = (
    block: TimelineComponentBlock,
    stageOrder: string,
    startX: number,
    centerY: number
  ) => {
    placedNodeIds.add(block.id)
    placedCenterY.set(block.id, centerY)

    rawNodes.push({
      id: block.id,
      type: 'componentNode',
      position: { x: Math.round(startX), y: Math.round(centerY - NODE_HEIGHT / 2) },
      selected: block.id === selectedBlockId,
      data: {
        block,
        stageOrder,
        hasIncoming: false,
        hasOutgoing: false,
      },
    })

    const children = block.children ?? []
    if (children.length === 0) return

    if (block.childrenLayout === 'parallel') {
      const childHeights = children.map(measureSubtreeHeight)
      const totalHeight =
        childHeights.reduce((sum, height) => sum + height, 0) +
        Math.max(0, children.length - 1) * VERTICAL_GAP

      let cursorY = centerY - totalHeight / 2
      children.forEach((child, childIndex) => {
        const childHeight = childHeights[childIndex]
        const childCenterY = cursorY + childHeight / 2
        const childX = startX + HORIZONTAL_STEP

        placeSubtree(child, stageOrder, childX, childCenterY)

        rawEdges.push(
          buildFlowEdge(
            `edge-${block.id}-${child.id}`,
            block.id,
            child.id,
            child.status,
            child.statusLabel
          )
        )
        outgoingNodeIds.add(block.id)
        incomingNodeIds.add(child.id)

        cursorY += childHeight + VERTICAL_GAP
      })
      return
    }

    let previousId = block.id
    let cursorX = startX + HORIZONTAL_STEP
    children.forEach((child) => {
      placeSubtree(child, stageOrder, cursorX, centerY)

      rawEdges.push(
        buildFlowEdge(
          `edge-${previousId}-${child.id}`,
          previousId,
          child.id,
          child.status,
          child.statusLabel
        )
      )
      outgoingNodeIds.add(previousId)
      incomingNodeIds.add(child.id)

      previousId = child.id
      cursorX += measureSubtreeColumns(child) * HORIZONTAL_STEP
    })
  }

  let currentX = 0
  let previousStageRootIds: string[] = []

  stages.forEach((stage, stageIndex) => {
    const blockHeights = stage.blocks.map(measureSubtreeHeight)
    const stageHeight =
      blockHeights.reduce((sum, height) => sum + height, 0) +
      Math.max(0, stage.blocks.length - 1) * VERTICAL_GAP

    const configuredSources = (stage.connectFromBlockIds ?? []).filter((id) =>
      placedNodeIds.has(id)
    )
    const singleAlignedY =
      stage.blocks.length === 1 && configuredSources.length === 1
        ? placedCenterY.get(configuredSources[0])
        : undefined

    let cursorY =
      singleAlignedY !== undefined
        ? singleAlignedY - stageHeight / 2
        : -stageHeight / 2

    const stageRootIds: string[] = []
    let maxStageColumns = 1

    stage.blocks.forEach((block, blockIndex) => {
      const height = blockHeights[blockIndex]
      const centerY = cursorY + height / 2
      placeSubtree(block, stage.order, currentX, centerY)
      stageRootIds.push(block.id)
      maxStageColumns = Math.max(maxStageColumns, measureSubtreeColumns(block))
      cursorY += height + VERTICAL_GAP
    })

    if (stageIndex > 0) {
      const sourceIds =
        configuredSources.length > 0 ? configuredSources : previousStageRootIds

      sourceIds.forEach((sourceId, sourceIdx) => {
        const targetId =
          stageRootIds[Math.min(sourceIdx, stageRootIds.length - 1)]
        if (!targetId) return

        const targetBlock = stage.blocks.find((b) => b.id === targetId)
        rawEdges.push(
          buildFlowEdge(
            `stage-edge-${sourceId}-${targetId}`,
            sourceId,
            targetId,
            targetBlock?.status ?? 'direct',
            sourceIdx === 0 ? `${stage.order} · ${targetBlock?.statusLabel ?? 'Door'}` : targetBlock?.statusLabel ?? 'Door'
          )
        )
        outgoingNodeIds.add(sourceId)
        incomingNodeIds.add(targetId)
      })
    }

    previousStageRootIds = stageRootIds
    currentX += maxStageColumns * HORIZONTAL_STEP
  })

  const nodes: ArchitectureNode[] = rawNodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      hasIncoming: incomingNodeIds.has(node.id),
      hasOutgoing: outgoingNodeIds.has(node.id),
    },
  }))

  return { nodes, edges: rawEdges }
}

function ComponentFlowNode({ data, selected }: NodeProps<ArchitectureNode>) {
  const { block, stageOrder, hasIncoming, hasOutgoing } = data
  const visuals = getStatusVisuals(block.status)
  const isShortCircuit = block.status === 'short-circuit'
  const promiseCount = block.promises?.length ?? 0

  return (
    <div
      className={`w-68 rounded-tile border transition-all px-4 py-3.5 shadow-xl ${
        selected
          ? 'bg-surface-hover border-brand ring-2 ring-brand/40'
          : isShortCircuit
            ? 'bg-surface/55 border-border-subtle opacity-75'
            : 'bg-surface border-border-default hover:border-fg-muted'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={false}
        className={
          hasIncoming
            ? 'size-2.5! border-2! border-brand! bg-canvas!'
            : 'opacity-0! pointer-events-none!'
        }
      />

      <div className="space-y-1">
        <p className="text-sm font-semibold text-fg-primary leading-snug truncate">
          {block.name}
        </p>
        <p className="font-mono text-2xs text-fg-muted truncate">
          {block.role} &middot; {block.microNote}
        </p>
      </div>

      <div className="mt-2.5 h-1.5 w-full rounded-pill bg-canvas overflow-hidden">
        <div className={`h-full rounded-pill ${visuals.barClass} ${visuals.barWidthClass}`} />
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="flex items-center gap-4 text-2xs">
          <div>
            <span className="block text-fg-muted">Fase</span>
            <span className="font-mono font-semibold text-fg-primary">
              {stageOrder}
            </span>
          </div>
          <div>
            <span className="block text-fg-muted">Promises</span>
            <span className="font-mono font-semibold text-fg-primary">
              {promiseCount}
            </span>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 text-2xs font-semibold ${visuals.badgeClass}`}
        >
          <span
            aria-hidden="true"
            className={`size-1.5 rounded-full ${visuals.dotClass}`}
          />
          {block.statusLabel}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={false}
        className={
          hasOutgoing
            ? 'size-2.5! border-2! border-brand! bg-canvas!'
            : 'opacity-0! pointer-events-none!'
        }
      />
    </div>
  )
}

const FLOW_NODE_TYPES = {
  componentNode: ComponentFlowNode,
}

interface TimelineFlowCanvasProps {
  stages: TimelineStageSpec[]
  routePath: string
  selectedBlockId: string
  onSelectBlock: (blockId: string) => void
}

function TimelineFlowCanvas({
  stages,
  routePath,
  selectedBlockId,
  onSelectBlock,
}: TimelineFlowCanvasProps) {
  const initialGraph = buildHorizontalGraphForStages(stages, selectedBlockId)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialGraph.nodes)
  const [edges, , onEdgesChange] = useEdgesState(initialGraph.edges)

  useEffect(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        selected: node.id === selectedBlockId,
      }))
    )
  }, [selectedBlockId, setNodes])

  return (
    <div className="h-132 md:h-148 w-full rounded-card border border-border-default bg-canvas overflow-hidden">
      <ReactFlow<ArchitectureNode, Edge>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => onSelectBlock(node.id)}
        nodeTypes={FLOW_NODE_TYPES}
        forceColorMode="dark"
        fitView
        fitViewOptions={{ padding: 0.16 }}
        minZoom={0.35}
        maxZoom={1.5}
        nodesConnectable={false}
        elementsSelectable
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
            Dataflow:{' '}
            <code className="font-mono font-bold text-brand">{routePath}</code>
            <span className="hidden sm:inline text-fg-muted ml-2">
              &bull; Links naar rechts &middot; Klik een blok voor details
            </span>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}

export default function TimelineClient() {
  const [selectedFlowId, setSelectedFlowId] = useState<TimelineFlowId>('movie-detail')
  const [selectedRole, setSelectedRole] = useState<TimelineRoleView>('user')
  const [selectedBlockId, setSelectedBlockId] = useState<string>('movie-detail-content')

  const activeFlow =
    TIMELINE_FLOW_SPECS.find((flow) => flow.id === selectedFlowId) ??
    TIMELINE_FLOW_SPECS[0]

  const resolvedStages = activeFlow.stages.map((stage) =>
    resolveStageForRole(stage, selectedRole)
  )

  const allNodes: FlattenedDiagramNode[] = resolvedStages.flatMap((stage) =>
    collectBlockNodes(stage.blocks, stage.order, stage.title)
  )

  const activeIndex = allNodes.findIndex((item) => item.block.id === selectedBlockId)
  const resolvedIndex = activeIndex >= 0 ? activeIndex : 0
  const activeNode = allNodes[resolvedIndex]

  const handleSelectFlow = (flowId: TimelineFlowId) => {
    setSelectedFlowId(flowId)
    const nextFlow = TIMELINE_FLOW_SPECS.find((flow) => flow.id === flowId)
    const firstStage = nextFlow?.stages[0]
    const resolvedFirst = firstStage ? resolveStageForRole(firstStage, selectedRole) : null
    const firstBlockId = resolvedFirst?.blocks[0]?.id
    if (firstBlockId) {
      setSelectedBlockId(firstBlockId)
    }
  }

  const handleSelectRole = (role: TimelineRoleView) => {
    setSelectedRole(role)
    const nextStages = activeFlow.stages.map((stage) =>
      resolveStageForRole(stage, role)
    )
    const nextNodes = nextStages.flatMap((stage) =>
      collectBlockNodes(stage.blocks, stage.order, stage.title)
    )
    const stillExists = nextNodes.some((item) => item.block.id === selectedBlockId)
    if (!stillExists && nextNodes.length > 0) {
      setSelectedBlockId(nextNodes[nextNodes.length - 1].block.id)
    }
  }

  const activeRoleMeta = ROLE_VIEWS.find((item) => item.id === selectedRole)
  const activeVisuals = activeNode ? getStatusVisuals(activeNode.block.status) : null

  return (
    <section
      aria-labelledby="timeline-heading"
      className="w-full max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14 space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <p className="label-tech text-brand">Dataflow</p>
          <h1 id="timeline-heading" className="h1">
            Dataflow &amp; Componenten per Route
          </h1>
          <p className="text-sm md:text-base text-fg-secondary">
            Volg van links naar rechts welke componenten starten, welke Promises
            wachten en waar auth kortsluit.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          {activeFlow.routeHref && (
            <UIButton href={activeFlow.routeHref} variant="outline" size="sm">
              Open {activeFlow.routePath}
              <ArrowTopRightOnSquareIcon className="icon-xs" aria-hidden="true" />
            </UIButton>
          )}
          <UIButton href="/presentatie" variant="outline" size="sm">
            Presentatiekaart
          </UIButton>
        </div>
      </div>

      <div className="rounded-card bg-surface/80 p-4 md:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {TIMELINE_FLOW_SPECS.map((flow) => {
            const isSelected = flow.id === activeFlow.id
            return (
              <UIButton
                key={flow.id}
                type="button"
                size="sm"
                variant={isSelected ? 'primary' : 'outline'}
                onClick={() => handleSelectFlow(flow.id)}
              >
                <span>{flow.label}</span>
                <span className="font-mono text-2xs opacity-75">{flow.routePath}</span>
              </UIButton>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-2xs font-mono text-fg-muted mr-1">
            Rol ({activeRoleMeta?.hint}):
          </span>
          {ROLE_VIEWS.map((roleOption) => {
            const isSelected = roleOption.id === selectedRole
            return (
              <UIButton
                key={roleOption.id}
                type="button"
                size="xs"
                variant={isSelected ? 'secondary' : 'outline'}
                onClick={() => handleSelectRole(roleOption.id)}
              >
                {roleOption.label}
              </UIButton>
            )
          })}
        </div>
      </div>

      <ul
        aria-label="Legenda statuskleuren"
        className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-fg-secondary px-1"
      >
        {STATUS_LEGEND.map((item) => (
          <li key={item.label} className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`size-2 rounded-full ${item.dotClass}`}
            />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>

      <ReactFlowProvider>
        <TimelineFlowCanvas
          key={`${activeFlow.id}-${selectedRole}`}
          stages={resolvedStages}
          routePath={activeFlow.routePath}
          selectedBlockId={activeNode?.block.id ?? ''}
          onSelectBlock={setSelectedBlockId}
        />
      </ReactFlowProvider>

      <aside
        aria-label="Inspectiepaneel geselecteerde component"
        className="rounded-card bg-surface p-6 md:p-7 space-y-6"
      >
        {activeNode && activeVisuals ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-subtle">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-fg-muted">
                  Blok {resolvedIndex + 1} van {allNodes.length} &middot;{' '}
                  <strong className="text-brand">{activeNode.stageOrder}</strong>
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-medium ${activeVisuals.badgeClass}`}
                >
                  <span
                    aria-hidden="true"
                    className={`size-2 rounded-full ${activeVisuals.dotClass}`}
                  />
                  {activeNode.block.statusLabel}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <UIButton
                  type="button"
                  size="xs"
                  variant="outline"
                  disabled={resolvedIndex === 0}
                  onClick={() =>
                    setSelectedBlockId(allNodes[resolvedIndex - 1].block.id)
                  }
                  aria-label="Vorig blok in diagram"
                >
                  <ArrowLeftIcon className="icon-xs" aria-hidden="true" />
                  Vorige
                </UIButton>
                <UIButton
                  type="button"
                  size="xs"
                  variant="outline"
                  disabled={resolvedIndex >= allNodes.length - 1}
                  onClick={() =>
                    setSelectedBlockId(allNodes[resolvedIndex + 1].block.id)
                  }
                  aria-label="Volgend blok in diagram"
                >
                  Volgende
                  <ArrowRightIcon className="icon-xs" aria-hidden="true" />
                </UIButton>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-2.5">
                <span className="label-tech block">{activeNode.block.role}</span>
                <h2 className="h3">{activeNode.block.name}</h2>
                <p className="font-mono text-xs text-brand break-all">
                  {activeNode.block.filePath}
                </p>
                {activeNode.block.summary && (
                  <p className="text-sm leading-relaxed text-fg-secondary pt-1">
                    {activeNode.block.summary}
                  </p>
                )}
                {activeNode.block.fallback && (
                  <div className="rounded-tile bg-canvas/70 px-3.5 py-2.5 space-y-1 mt-2">
                    <span className="label-tech block">Tijdelijke Skeleton UI</span>
                    <code className="font-mono text-xs font-semibold text-fg-primary">
                      {activeNode.block.fallback}
                    </code>
                  </div>
                )}
              </div>

              <div className="space-y-2.5">
                <h3 className="label-tech">Data &amp; Promises in dit blok</h3>
                {activeNode.block.promises && activeNode.block.promises.length > 0 ? (
                  <ul className="space-y-2.5">
                    {activeNode.block.promises.map((promiseItem) => {
                      const pVisuals = getStatusVisuals(promiseItem.status)
                      return (
                        <li
                          key={`${activeNode.block.id}-${promiseItem.call}`}
                          className={`rounded-control bg-canvas/60 border-l-2 px-4 py-3 space-y-1 ${pVisuals.stripeClass}`}
                        >
                          <code className="block font-mono text-xs font-semibold text-fg-primary break-all">
                            {promiseItem.call}
                          </code>
                          <p className={`text-xs ${pVisuals.textClass}`}>
                            {promiseItem.statusText}
                          </p>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="text-xs text-fg-muted leading-relaxed">
                    Dit blok wacht niet zelf op asynchrone data en voert geen directe queries uit.
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="rounded-tile bg-canvas/85 p-4 space-y-1.5">
                  <span className={`label-tech block ${activeVisuals.textClass}`}>
                    Wanneer gaat het door?
                  </span>
                  <p className="text-sm leading-relaxed text-fg-primary">
                    {activeNode.block.proceedsWhen}
                  </p>
                </div>

                {activeNode.block.children && activeNode.block.children.length > 0 && (
                  <div className="space-y-2">
                    <span className="label-tech block">
                      {activeNode.block.childrenLabel ?? 'Hangt rechts onder dit blok'}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeNode.block.children.map((childBlock) => (
                        <UIButton
                          key={childBlock.id}
                          type="button"
                          size="xs"
                          variant="outline"
                          onClick={() => setSelectedBlockId(childBlock.id)}
                        >
                          {childBlock.name}
                        </UIButton>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-border-subtle space-y-1">
                  <span className="label-tech block">
                    Kernprincipe van {activeFlow.routePath}
                  </span>
                  <p className="text-xs leading-relaxed text-fg-secondary">
                    {activeFlow.keyTakeaway}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </aside>
    </section>
  )
}
