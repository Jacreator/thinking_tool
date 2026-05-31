"use client"

import { useCallback, useRef, type DragEvent } from "react"
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  MiniMap,
  ConnectionMode,
  Handle,
  Position,
  useReactFlow,
  type NodeChange,
  type NodeProps,
  type NodeTypes,
} from "@xyflow/react"
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow"
import { Circle, Cylinder, Diamond, Hexagon, Pill, RectangleHorizontal } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import {
  DEFAULT_NODE_COLOR,
  NODE_SHAPES,
  type CanvasEdge,
  type CanvasNode,
  type NodeShape,
} from "@/types/canvas"
import "@xyflow/react/dist/style.css"
import "@liveblocks/react-flow/styles.css"

const SHAPE_DRAG_TYPE = "application/x-ghost-shape"

type ShapeDragPayload = {
  shape: NodeShape
  width: number
  height: number
}

const SHAPE_DEFAULT_SIZES: Record<NodeShape, { width: number; height: number }> = {
  rectangle: { width: 160, height: 88 },
  diamond: { width: 144, height: 112 },
  circle: { width: 112, height: 112 },
  pill: { width: 160, height: 72 },
  cylinder: { width: 144, height: 104 },
  hexagon: { width: 152, height: 96 },
}

const SHAPE_ICONS: Record<NodeShape, LucideIcon> = {
  rectangle: RectangleHorizontal,
  diamond: Diamond,
  circle: Circle,
  pill: Pill,
  cylinder: Cylinder,
  hexagon: Hexagon,
}

const nodeTypes = {
  canvasNode: CanvasNodeRenderer,
} satisfies NodeTypes

function isShapeDragPayload(value: unknown): value is ShapeDragPayload {
  if (!value || typeof value !== "object") {
    return false
  }

  const payload = value as Partial<ShapeDragPayload>
  return (
    typeof payload.shape === "string" &&
    NODE_SHAPES.includes(payload.shape as NodeShape) &&
    typeof payload.width === "number" &&
    typeof payload.height === "number"
  )
}

function getShapeDragPayload(event: DragEvent<HTMLDivElement>) {
  const rawPayload = event.dataTransfer.getData(SHAPE_DRAG_TYPE)

  if (!rawPayload) {
    return null
  }

  try {
    const payload = JSON.parse(rawPayload)
    return isShapeDragPayload(payload) ? payload : null
  } catch {
    return null
  }
}

function CanvasNodeRenderer({ data, width, height, selected }: NodeProps<CanvasNode>) {
  const nodeWidth = width ?? 160
  const nodeHeight = height ?? 88
  const color = data.color ?? DEFAULT_NODE_COLOR.fill

  return (
    <div
      className="group relative flex items-center justify-center rounded-xl border border-subtle-border px-4 text-center text-sm font-medium shadow-lg"
      style={{
        width: nodeWidth,
        height: nodeHeight,
        backgroundColor: color,
        color: DEFAULT_NODE_COLOR.text,
        boxShadow: selected ? "0 0 0 2px var(--accent-primary)" : undefined,
      }}
    >
      <Handle
        className="!h-2 !w-2 !border !border-base !bg-copy-primary !opacity-0 transition-opacity group-hover:!opacity-100"
        type="target"
        position={Position.Top}
      />
      <Handle
        className="!h-2 !w-2 !border !border-base !bg-copy-primary !opacity-0 transition-opacity group-hover:!opacity-100"
        type="source"
        position={Position.Right}
      />
      <Handle
        className="!h-2 !w-2 !border !border-base !bg-copy-primary !opacity-0 transition-opacity group-hover:!opacity-100"
        type="source"
        position={Position.Bottom}
      />
      <Handle
        className="!h-2 !w-2 !border !border-base !bg-copy-primary !opacity-0 transition-opacity group-hover:!opacity-100"
        type="target"
        position={Position.Left}
      />
      <span className="line-clamp-2">{data.label}</span>
    </div>
  )
}

function ShapeToolbar() {
  const handleDragStart = (event: DragEvent<HTMLButtonElement>, shape: NodeShape) => {
    const size = SHAPE_DEFAULT_SIZES[shape]
    const payload: ShapeDragPayload = { shape, ...size }

    event.dataTransfer.effectAllowed = "copy"
    event.dataTransfer.setData(SHAPE_DRAG_TYPE, JSON.stringify(payload))
    event.dataTransfer.setData("text/plain", shape)
  }

  return (
    <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-surface-border bg-elevated/95 p-1.5 shadow-2xl backdrop-blur">
      {NODE_SHAPES.map((shape) => {
        const Icon = SHAPE_ICONS[shape]

        return (
          <button
            key={shape}
            type="button"
            draggable
            onDragStart={(event) => handleDragStart(event, shape)}
            className="flex h-10 w-10 cursor-grab items-center justify-center rounded-full text-copy-secondary transition hover:bg-accent-dim hover:text-brand active:cursor-grabbing"
            aria-label={`Drag ${shape} shape`}
            title={shape}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}

function CanvasFlowContent() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({ suspense: true })
  const { screenToFlowPosition } = useReactFlow<CanvasNode, CanvasEdge>()
  const nodeCounterRef = useRef(0)

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer.types.includes(SHAPE_DRAG_TYPE)) {
      return
    }

    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
  }, [])

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      const payload = getShapeDragPayload(event)

      if (!payload) {
        return
      }

      event.preventDefault()

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })
      const id = `${payload.shape}-${Date.now()}-${nodeCounterRef.current++}`
      const node: CanvasNode = {
        id,
        type: "canvasNode",
        position: {
          x: position.x - payload.width / 2,
          y: position.y - payload.height / 2,
        },
        width: payload.width,
        height: payload.height,
        data: {
          label: "",
          color: DEFAULT_NODE_COLOR.fill,
          shape: payload.shape,
        },
      }
      const changes: NodeChange<CanvasNode>[] = [{ type: "add", item: node }]

      onNodesChange(changes)
    },
    [onNodesChange, screenToFlowPosition]
  )

  return (
    <div className="relative h-full w-full" onDragOver={handleDragOver} onDrop={handleDrop}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        connectionMode={ConnectionMode.Loose}
        fitView
        colorMode="dark"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="rgba(255,255,255,0.12)" />
        <MiniMap
          nodeColor="#1F1F1F"
          maskColor="rgba(8,8,9,0.7)"
          style={{ background: "#111114", border: "1px solid #2a2a30", borderRadius: 12 }}
        />
        <Cursors />
      </ReactFlow>
      <ShapeToolbar />
    </div>
  )
}

export function CanvasFlow() {
  return (
    <ReactFlowProvider>
      <CanvasFlowContent />
    </ReactFlowProvider>
  )
}
