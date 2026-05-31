"use client"

import { ReactFlow, Background, BackgroundVariant, MiniMap, ConnectionMode } from "@xyflow/react"
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow"
import "@xyflow/react/dist/style.css"
import "@liveblocks/react-flow/styles.css"

export function CanvasFlow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow({ suspense: true })

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
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
  )
}
