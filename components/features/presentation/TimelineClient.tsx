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

const NODE_WIDTH = 248
const HORIZONTAL_GAP = 36
const VERTICAL_LEVEL_GAP = 148
const STAGE_GAP = 176

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
  textClass: string
  pillBgClass: string
  stripeClass: string
  strokeColor: string
} {
  switch (status) {
    case 'direct':
      return {
        dotClass: 'bg-fg-muted',
        textClass: 'text-fg-secondary',
        pillBgClass: 'bg-canvas/70',
        stripeClass: 'border-l-border-default',
        strokeColor: '#8e8e93',
      }
    case 'waiting':
      return {
        dotClass: 'bg-accent-coral',
        textClass: 'text-accent-coral',
        pillBgClass: 'bg-accent-coral/15',
        stripeClass: 'border-l-accent-coral/70',
        strokeColor: '#ff4d2d',
      }
    case 'parallel':
      return {
        dotClass: 'bg-accent-emerald',
        textClass: 'text-accent-emerald',
        pillBgClass: 'bg-accent-emerald/15',
        stripeClass: 'border-l-accent-emerald/70',
        strokeColor: '#12b76a',
      }
    case 'cached':
      return {
        dotClass: 'bg-accent-blue-hover',
        textClass: 'text-accent-blue-hover',
        pillBgClass: 'bg-accent-blue/15',
        stripeClass: 'border-l-accent-blue-hover/70',
        strokeColor: '#3b82f6',
      }
    case 'short-circuit':
      return {
        dotClass: 'bg-accent-violet',
        textClass: 'text-accent-violet',
        pillBgClass: 'bg-accent-violet/15',
        stripeClass: 'border-l-accent-violet/70',
        strokeColor: '#8b5cf6',
      }
    case 'interactive':
      return {
        dotClass: 'bg-brand',
        textClass: 'text-brand',
        pillBgClass: 'bg-brand/15',
        stripeClass: 'border-l-brand/70',
        strokeColor: '#e2ff32',
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

function measureSubtreeWidth(block: TimelineComponentBlock): number {
  const children = block.children ?? []
  if (children.length === 0) {
    return NODE_WIDTH
  }

  if (block.childrenLayout === 'parallel') {
    const childWidths = children.map(measureSubtreeWidth)
    const total =
      childWidths.reduce((sum, width) => sum + width, 0) +
      Math.max(0, children.length - 1) * HORIZONTAL_GAP
    return Math.max(NODE_WIDTH, total)
  }

  const maxChild = Math.max(...children.map(measureSubtreeWidth))
  return Math.max(NODE_WIDTH, maxChild)
}

function measureSubtreeDepth(block: TimelineComponentBlock): number {
  const children = block.children ?? []
  if (children.length === 0) {
    return 1
  }

  if (block.childrenLayout === 'parallel') {
    return 1 + Math.max(...children.map(measureSubtreeDepth))
  }

  return 1 + children.reduce((sum, child) => sum + measureSubtreeDepth(child), 0)
}

function buildGraphForStages(
  stages: TimelineStageSpec[],
  selectedBlockId: string
): { nodes: ArchitectureNode[]; edges: Edge[] } {
  const rawNodes: ArchitectureNode[] = []
  const rawEdges: Edge[] = []
  const incomingNodeIds = new Set<string>()
  const outgoingNodeIds = new Set<string>()
  const placedNodeIds = new Set<string>()

  const placeSubtree = (
    block: TimelineComponentBlock,
    stageOrder: string,
    centerX: number,
    startY: number
  ) => {
    placedNodeIds.add(block.id)
    rawNodes.push({
      id: block.id,
      type: 'componentNode',
      position: { x: Math.round(centerX - NODE_WIDTH / 2), y: Math.round(startY) },
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
      const childWidths = children.map(measureSubtreeWidth)
      const totalWidth =
        childWidths.reduce((sum, width) => sum + width, 0) +
        Math.max(0, children.length - 1) * HORIZONTAL_GAP

      let cursorX = centerX - totalWidth / 2
      children.forEach((child, childIndex) => {
        const childWidth = childWidths[childIndex]
        const childCenterX = cursorX + childWidth / 2
        const childY = startY + VERTICAL_LEVEL_GAP
        placeSubtree(child, stageOrder, childCenterX, childY)

        const visuals = getStatusVisuals(child.status)
        const isAnimated =
          child.status === 'waiting' ||
          child.status === 'parallel' ||
          child.status === 'cached' ||
          child.status === 'interactive'

        rawEdges.push({
          id: `edge-${block.id}-${child.id}`,
          source: block.id,
          target: child.id,
          animated: isAnimated,
          style: {
            stroke: visuals.strokeColor,
            strokeWidth: child.status === 'short-circuit' ? 1.5 : 2,
            strokeDasharray:
              child.status === 'short-circuit' ? '5 5' : undefined,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 15,
            height: 15,
            color: visuals.strokeColor,
          },
        })
        outgoingNodeIds.add(block.id)
        incomingNodeIds.add(child.id)

        cursorX += childWidth + HORIZONTAL_GAP
      })
      return
    }

    let previousId = block.id
    let cursorY = startY + VERTICAL_LEVEL_GAP
    children.forEach((child) => {
      placeSubtree(child, stageOrder, centerX, cursorY)

      const visuals = getStatusVisuals(child.status)
      const isAnimated =
        child.status === 'waiting' ||
        child.status === 'parallel' ||
        child.status === 'cached' ||
        child.status === 'interactive'

      rawEdges.push({
        id: `edge-${previousId}-${child.id}`,
        source: previousId,
        target: child.id,
        animated: isAnimated,
        style: {
          stroke: visuals.strokeColor,
          strokeWidth: child.status === 'short-circuit' ? 1.5 : 2,
          strokeDasharray:
            child.status === 'short-circuit' ? '5 5' : undefined,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 15,
          height: 15,
          color: visuals.strokeColor,
        },
      })
      outgoingNodeIds.add(previousId)
      incomingNodeIds.add(child.id)

      previousId = child.id
      cursorY += measureSubtreeDepth(child) * VERTICAL_LEVEL_GAP
    })
  }

  let currentY = 0
  let previousStageRootIds: string[] = []

  stages.forEach((stage, stageIndex) => {
    const blockWidths = stage.blocks.map(measureSubtreeWidth)
    const stageWidth =
      blockWidths.reduce((sum, width) => sum + width, 0) +
      Math.max(0, stage.blocks.length - 1) * HORIZONTAL_GAP

    let cursorX = -stageWidth / 2

    const stageRootIds: string[] = []
    let maxStageDepth = 1

    stage.blocks.forEach((block, blockIndex) => {
      const width = blockWidths[blockIndex]
      const centerX = cursorX + width / 2
      placeSubtree(block, stage.order, centerX, currentY)
      stageRootIds.push(block.id)
      maxStageDepth = Math.max(maxStageDepth, measureSubtreeDepth(block))
      cursorX += width + HORIZONTAL_GAP
    })

    if (stageIndex > 0) {
      const configuredSources = (stage.connectFromBlockIds ?? []).filter((id) =>
        placedNodeIds.has(id)
      )
      const sourceIds =
        configuredSources.length > 0 ? configuredSources : previousStageRootIds

      sourceIds.forEach((sourceId, sourceIdx) => {
        const targetId =
          stageRootIds[Math.min(sourceIdx, stageRootIds.length - 1)]
        if (!targetId) return

        const targetBlock = stage.blocks.find((b) => b.id === targetId)
        const visuals = getStatusVisuals(targetBlock?.status ?? 'direct')
        const isAnimated =
          targetBlock?.status === 'waiting' ||
          targetBlock?.status === 'parallel' ||
          targetBlock?.status === 'cached' ||
          targetBlock?.status === 'interactive'

        rawEdges.push({
          id: `stage-edge-${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
          label: sourceIdx === 0 ? `${stage.order} · ${stage.gateTrigger}` : undefined,
          labelStyle: {
            fill: '#d4d4d8',
            fontSize: 11,
            fontWeight: 500,
          },
          labelBgStyle: {
            fill: '#242424',
            stroke: 'rgba(255, 255, 255, 0.16)',
            strokeWidth: 1,
          },
          labelBgPadding: [8, 4],
          labelBgBorderRadius: 999,
          animated: isAnimated,
          style: {
            stroke: visuals.strokeColor,
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 15,
            height: 15,
            color: visuals.strokeColor,
          },
        })
        outgoingNodeIds.add(sourceId)
        incomingNodeIds.add(targetId)
      })
    }

    previousStageRootIds = stageRootIds
    currentY += (maxStageDepth - 1) * VERTICAL_LEVEL_GAP + STAGE_GAP
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

  return (
    <div
      className={`w-62 rounded-tile border transition-all px-4 py-3.5 shadow-lg ${
        selected
          ? 'bg-surface-hover border-brand ring-2 ring-brand/40'
          : isShortCircuit
            ? 'bg-surface/55 border-border-subtle opacity-75'
            : 'bg-surface border-border-default hover:border-fg-muted'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={false}
        className={
          hasIncoming
            ? 'size-2.5! border-2! border-brand! bg-canvas!'
            : 'opacity-0! pointer-events-none!'
        }
      />

      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-2xs font-bold text-brand">
          {stageOrder} &middot; {block.role}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 text-2xs font-semibold ${visuals.textClass}`}
        >
          <span
            aria-hidden="true"
            className={`size-1.5 rounded-full ${visuals.dotClass}`}
          />
          {block.statusLabel}
        </span>
      </div>

      <p className="mt-1.5 text-sm font-semibold text-fg-primary leading-snug truncate">
        {block.name}
      </p>

      <p className="mt-1 font-mono text-2xs text-fg-muted truncate">
        {block.microNote}
      </p>

      <Handle
        type="source"
        position={Position.Bottom}
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
  const initialGraph = buildGraphForStages(stages, selectedBlockId)
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
    <div className="h-140 lg:h-176 w-full rounded-card border border-border-default bg-canvas overflow-hidden">
      <ReactFlow<ArchitectureNode, Edge>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => onSelectBlock(node.id)}
        nodeTypes={FLOW_NODE_TYPES}
        forceColorMode="dark"
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.45}
        maxZoom={1.5}
        nodesConnectable={false}
        elementsSelectable
        proOptions={{ hideAttribution: false }}
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
            Route:{' '}
            <code className="font-mono font-bold text-brand">{routePath}</code>
            <span className="hidden sm:inline text-fg-muted ml-2">
              &bull; Sleep nodes of scroll om te zoomen
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
          <p className="label-tech text-brand">Data stroom</p>
          <h1 id="timeline-heading" className="h1">
            Data stroom &amp; Componenten per Route
          </h1>
          <p className="text-sm md:text-base text-fg-secondary">
            Interactief node-diagram: zie direct welke componenten vertakken, welke
            Promises lopen en klik op een blok voor de exacte werking.
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          <ReactFlowProvider>
            <TimelineFlowCanvas
              key={`${activeFlow.id}-${selectedRole}`}
              stages={resolvedStages}
              routePath={activeFlow.routePath}
              selectedBlockId={activeNode?.block.id ?? ''}
              onSelectBlock={setSelectedBlockId}
            />
          </ReactFlowProvider>
        </div>

        <aside
          aria-label="Inspectiepaneel geselecteerde component"
          className="lg:col-span-4 lg:sticky lg:top-24 rounded-card bg-surface p-6 space-y-6"
        >
          {activeNode && activeVisuals ? (
            <>
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-border-subtle">
                <span className="font-mono text-xs text-fg-muted">
                  Blok {resolvedIndex + 1} van {allNodes.length} &middot;{' '}
                  <strong className="text-brand">{activeNode.stageOrder}</strong>
                </span>

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

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="label-tech">{activeNode.block.role}</span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-medium ${activeVisuals.pillBgClass} ${activeVisuals.textClass}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`size-2 rounded-full ${activeVisuals.dotClass}`}
                    />
                    {activeNode.block.statusLabel}
                  </span>
                </div>

                <h2 className="h3">{activeNode.block.name}</h2>
                <p className="font-mono text-xs text-brand break-all">
                  {activeNode.block.filePath}
                </p>

                {activeNode.block.summary && (
                  <p className="text-sm leading-relaxed text-fg-secondary pt-1">
                    {activeNode.block.summary}
                  </p>
                )}
              </div>

              {activeNode.block.fallback && (
                <div className="rounded-tile bg-canvas/70 px-4 py-3 space-y-1">
                  <span className="label-tech block">Tijdelijke UI tijdens wachten</span>
                  <code className="font-mono text-xs font-semibold text-fg-primary">
                    {activeNode.block.fallback}
                  </code>
                </div>
              )}

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
                  <p className="text-xs text-fg-muted">
                    Dit blok wacht niet zelf op asynchrone data en voert geen directe queries uit.
                  </p>
                )}
              </div>

              <div className="rounded-tile bg-canvas/85 p-4 space-y-1.5">
                <span className={`label-tech block ${activeVisuals.textClass}`}>
                  Wanneer gaat het door?
                </span>
                <p className="text-sm leading-relaxed text-fg-primary">
                  {activeNode.block.proceedsWhen}
                </p>
              </div>

              {activeNode.block.children && activeNode.block.children.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-border-subtle">
                  <span className="label-tech block">
                    {activeNode.block.childrenLabel ?? 'Hangt onder dit blok'}
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
            </>
          ) : null}

          <div className="pt-4 border-t border-border-subtle space-y-1">
            <span className="label-tech block">Kernprincipe van {activeFlow.routePath}</span>
            <p className="text-xs leading-relaxed text-fg-secondary">
              {activeFlow.keyTakeaway}
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}
