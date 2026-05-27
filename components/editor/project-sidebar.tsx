"use client"

import Link from "next/link"
import { Pencil, Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { ProjectSummary } from "@/lib/projects"

interface ProjectItemProps {
  project: ProjectSummary
  owned: boolean
  active: boolean
  onRename: (project: ProjectSummary) => void
  onDelete: (project: ProjectSummary) => void
}

function ProjectItem({ project, owned, active, onRename, onDelete }: ProjectItemProps) {
  return (
    <div
      className={cn(
        "group flex min-h-12 items-center gap-1 rounded-2xl border border-transparent text-sm hover:bg-subtle",
        active && "border-brand/10 bg-accent-dim shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]"
      )}
    >
      <Link
        href={`/editor/${project.id}`}
        className={cn(
          "flex min-w-0 flex-1 items-center gap-3 truncate rounded-2xl px-3 py-3 text-copy-secondary",
          active && "font-medium text-copy-primary"
        )}
      >
        {active && (
          <span className="size-2 shrink-0 rounded-full bg-brand shadow-[0_0_12px_rgba(0,200,212,0.75)]" />
        )}
        <span className="truncate">{project.name}</span>
      </Link>
      {owned && (
        <div className="flex shrink-0 gap-0.5 pr-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
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
  activeProjectId?: string
  onOpenCreate: () => void
  onOpenRename: (project: ProjectSummary) => void
  onOpenDelete: (project: ProjectSummary) => void
  docked?: boolean
}

export function ProjectSidebar({
  isOpen,
  onClose,
  ownedProjects,
  sharedProjects,
  activeProjectId,
  onOpenCreate,
  onOpenRename,
  onOpenDelete,
  docked = false,
}: ProjectSidebarProps) {
  return (
    <>
      {isOpen && !docked && (
        <div
          className="fixed inset-0 z-[49] bg-black/60 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "z-50 flex h-full w-72 shrink-0 flex-col border-r border-surface-border bg-elevated transition-transform duration-200 ease-in-out",
          docked
            ? "relative w-80 rounded-3xl border bg-[#0d0d10] xl:w-[380px]"
            : "fixed left-0 top-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          docked && !isOpen && "-ml-80 xl:-ml-[380px]"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between border-b border-surface-border px-4 py-3",
            docked && "px-5 py-5"
          )}
        >
          <span className="text-sm font-semibold text-copy-primary">Projects</span>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="size-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        <Tabs defaultValue="my-projects" className="flex flex-1 flex-col gap-0 overflow-hidden">
          <div className={cn("px-3 pt-3", docked && "px-4 pt-4")}>
            <TabsList className="h-10 w-full rounded-2xl bg-subtle p-1">
              <TabsTrigger value="my-projects" className="flex-1">
                My Projects
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex-1">
                Shared
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent
            value="my-projects"
            className={cn("flex-1 overflow-y-auto px-2 py-3", docked && "px-4 py-5")}
          >
            {ownedProjects.length > 0 ? (
              <div className="flex flex-col gap-2">
                {ownedProjects.map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    owned
                    active={project.id === activeProjectId}
                    onRename={onOpenRename}
                    onDelete={onOpenDelete}
                  />
                ))}
              </div>
            ) : (
              <p className="px-4 text-center text-sm text-copy-muted">No projects yet.</p>
            )}
          </TabsContent>
          <TabsContent
            value="shared"
            className={cn("flex-1 overflow-y-auto px-2 py-3", docked && "px-4 py-5")}
          >
            {sharedProjects.length > 0 ? (
              <div className="flex flex-col gap-2">
                {sharedProjects.map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    owned={false}
                    active={project.id === activeProjectId}
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

        <div
          className={cn("border-t border-surface-border p-4", docked && "flex items-center gap-2")}
        >
          <Button
            variant={docked ? "default" : "outline"}
            className={cn(
              "w-full gap-2",
              docked && "h-10 bg-brand text-primary-foreground hover:bg-brand/90"
            )}
            onClick={onOpenCreate}
          >
            <Plus className="size-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}
