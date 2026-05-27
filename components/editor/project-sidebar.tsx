"use client"

import { Pencil, Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { ProjectSummary } from "@/lib/projects"

interface ProjectItemProps {
  project: ProjectSummary
  owned: boolean
  onRename: (project: ProjectSummary) => void
  onDelete: (project: ProjectSummary) => void
}

function ProjectItem({ project, owned, onRename, onDelete }: ProjectItemProps) {
  return (
    <div className="group flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-subtle">
      <span className="flex-1 truncate text-copy-secondary">{project.name}</span>
      {owned && (
        <div className="flex shrink-0 gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onRename(project)}
            title="Rename"
          >
            <Pencil className="size-3" />
            <span className="sr-only">Rename</span>
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete(project)}
            title="Delete"
          >
            <Trash2 className="size-3 text-error" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      )}
    </div>
  )
}

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  ownedProjects: ProjectSummary[]
  sharedProjects: ProjectSummary[]
  onOpenCreate: () => void
  onOpenRename: (project: ProjectSummary) => void
  onOpenDelete: (project: ProjectSummary) => void
}

export function ProjectSidebar({
  isOpen,
  onClose,
  ownedProjects,
  sharedProjects,
  onOpenCreate,
  onOpenRename,
  onOpenDelete,
}: ProjectSidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[49] bg-black/60 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-surface-border bg-elevated transition-transform duration-200 ease-in-out",
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
          <TabsContent value="my-projects" className="flex-1 overflow-y-auto px-2 py-3">
            {ownedProjects.length > 0 ? (
              <div className="flex flex-col gap-0.5">
                {ownedProjects.map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    owned
                    onRename={onOpenRename}
                    onDelete={onOpenDelete}
                  />
                ))}
              </div>
            ) : (
              <p className="px-4 text-center text-sm text-copy-muted">No projects yet.</p>
            )}
          </TabsContent>
          <TabsContent value="shared" className="flex-1 overflow-y-auto px-2 py-3">
            {sharedProjects.length > 0 ? (
              <div className="flex flex-col gap-0.5">
                {sharedProjects.map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    owned={false}
                    onRename={onOpenRename}
                    onDelete={onOpenDelete}
                  />
                ))}
              </div>
            ) : (
              <p className="px-4 text-center text-sm text-copy-muted">No shared projects.</p>
            )}
          </TabsContent>
        </Tabs>

        <div className="border-t border-surface-border p-4">
          <Button variant="outline" className="w-full gap-2" onClick={onOpenCreate}>
            <Plus className="size-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}
