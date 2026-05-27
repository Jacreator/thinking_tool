"use client"

import { UserButton } from "@clerk/nextjs"
import { Bot, PanelLeftClose, PanelLeftOpen, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EditorNavbarProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
  projectName?: string
  subtitle?: string
  showWorkspaceActions?: boolean
  aiSidebarOpen?: boolean
  onToggleAiSidebar?: () => void
}

export function EditorNavbar({
  sidebarOpen,
  onToggleSidebar,
  projectName,
  subtitle,
  showWorkspaceActions = false,
  aiSidebarOpen = false,
  onToggleAiSidebar,
}: EditorNavbarProps) {
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 flex items-center border-b border-surface-border bg-[#0b0b0d]",
        showWorkspaceActions ? "h-16" : "h-12"
      )}
    >
      <div className="flex items-center px-4">
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn(showWorkspaceActions && "text-copy-muted hover:text-copy-primary")}
          onClick={onToggleSidebar}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="size-4" />
          ) : (
            <PanelLeftOpen className="size-4" />
          )}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
      {projectName && (
        <div className="min-w-0 flex-1 px-1">
          <h1 className="truncate text-sm font-semibold leading-5 text-copy-primary">
            {projectName}
          </h1>
          {subtitle && (
            <p className="truncate text-xs leading-4 text-copy-faint">{subtitle}</p>
          )}
        </div>
      )}
      {!projectName && <div className="flex-1" />}
      <div className="flex items-center gap-2 px-4">
        {showWorkspaceActions && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 bg-black/30 px-3 text-copy-secondary hover:bg-subtle hover:text-copy-primary"
              title="Share"
            >
              <Share2 className="size-4" />
              Share
            </Button>
            <Button
              variant="default"
              size="sm"
              className="gap-1.5 bg-brand px-3 text-primary-foreground hover:bg-brand/90"
              onClick={onToggleAiSidebar}
              aria-pressed={aiSidebarOpen}
              title="Toggle AI sidebar"
            >
              <Bot className="size-4" />
              AI
            </Button>
          </>
        )}
        <UserButton />
      </div>
    </header>
  )
}
