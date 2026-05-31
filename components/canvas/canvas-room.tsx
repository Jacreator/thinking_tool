"use client"

import { Component, type ReactNode } from "react"
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react"
import { LiveObject, LiveMap } from "@liveblocks/client"
import { CanvasFlow } from "./canvas-flow"

interface CanvasRoomProps {
  roomId: string
}

class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

function CanvasLoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
    </div>
  )
}

function CanvasErrorFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="text-sm font-medium text-copy-muted">
        Could not connect to the canvas. Check your connection and try again.
      </p>
    </div>
  )
}

export function CanvasRoom({ roomId }: CanvasRoomProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{ cursor: null, isThinking: false }}
        initialStorage={() => ({
          flow: new LiveObject({
            nodes: new LiveMap(),
            edges: new LiveMap(),
          }),
        })}
      >
        <CanvasErrorBoundary fallback={<CanvasErrorFallback />}>
          <ClientSideSuspense fallback={<CanvasLoadingFallback />}>
            <CanvasFlow />
          </ClientSideSuspense>
        </CanvasErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  )
}
