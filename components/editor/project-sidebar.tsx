"use client"

import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-elevated border-r border-surface-border transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
        <span className="text-sm font-medium text-copy-primary">Projects</span>
        <Button variant="ghost" size="icon-sm" onClick={onClose}>
          <X className="size-4" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </div>

      <Tabs defaultValue="my-projects" className="flex flex-1 flex-col gap-0 overflow-hidden">
        <div className="px-3 pt-3">
          <TabsList className="w-full">
            <TabsTrigger value="my-projects" className="flex-1">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex-1">
              Shared
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="my-projects" className="flex-1 overflow-y-auto px-4 py-6">
          <p className="text-center text-sm text-copy-muted">No projects yet.</p>
        </TabsContent>
        <TabsContent value="shared" className="flex-1 overflow-y-auto px-4 py-6">
          <p className="text-center text-sm text-copy-muted">No shared projects.</p>
        </TabsContent>
      </Tabs>

      <div className="border-t border-surface-border p-4">
        <Button variant="outline" className="w-full gap-2">
          <Plus className="size-4" />
          New Project
        </Button>
      </div>
    </aside>
  )
}
