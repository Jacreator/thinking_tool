"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { EditorNavbar } from "./editor-navbar"
import { ProjectSidebar } from "./project-sidebar"
import { CreateProjectDialog } from "./create-project-dialog"
import { RenameProjectDialog } from "./rename-project-dialog"
import { DeleteProjectDialog } from "./delete-project-dialog"
import { useProjectActions } from "@/hooks/use-project-actions"
import { Button } from "@/components/ui/button"
import type { ProjectSummary } from "@/lib/projects"

interface EditorShellProps {
  ownedProjects: ProjectSummary[]
  sharedProjects: ProjectSummary[]
}

export function EditorShell({ ownedProjects, sharedProjects }: EditorShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const {
    dialog,
    selectedProject,
    formName,
    roomIdPreview,
    isLoading,
    error,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    setFormName,
    handleCreate,
    handleRename,
    handleDelete,
  } = useProjectActions()

  return (
    <div className="flex h-screen flex-col bg-base">
      <EditorNavbar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      />
      <ProjectSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        onOpenCreate={openCreate}
        onOpenRename={openRename}
        onOpenDelete={openDelete}
      />

      <main className="flex flex-1 items-center justify-center pt-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-xl font-semibold text-copy-primary">
            Create a project or open an existing one
          </h1>
          <p className="max-w-xs text-sm text-copy-muted">
            Start a new architecture workspace, or choose a project from the sidebar.
          </p>
          <Button className="gap-2" onClick={openCreate}>
            <Plus className="size-4" />
            New Project
          </Button>
        </div>
      </main>

      <CreateProjectDialog
        open={dialog === "create"}
        formName={formName}
        roomIdPreview={roomIdPreview}
        isLoading={isLoading}
        error={error}
        onNameChange={setFormName}
        onSubmit={handleCreate}
        onClose={closeDialog}
      />
      <RenameProjectDialog
        open={dialog === "rename"}
        project={selectedProject}
        formName={formName}
        isLoading={isLoading}
        error={error}
        onNameChange={setFormName}
        onSubmit={handleRename}
        onClose={closeDialog}
      />
      <DeleteProjectDialog
        open={dialog === "delete"}
        project={selectedProject}
        isLoading={isLoading}
        error={error}
        onConfirm={handleDelete}
        onClose={closeDialog}
      />
    </div>
  )
}
