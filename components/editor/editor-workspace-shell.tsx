"use client"

import { useState } from "react"
import { Bot, Sparkles } from "lucide-react"
import { EditorNavbar } from "./editor-navbar"
import { ProjectSidebar } from "./project-sidebar"
import { CreateProjectDialog } from "./create-project-dialog"
import { RenameProjectDialog } from "./rename-project-dialog"
import { DeleteProjectDialog } from "./delete-project-dialog"
import { ShareDialog } from "./share-dialog"
import { CanvasRoom } from "@/components/canvas/canvas-room"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { ProjectSummary } from "@/lib/projects"

interface EditorWorkspaceShellProps {
  project: ProjectSummary
  ownedProjects: ProjectSummary[]
  sharedProjects: ProjectSummary[]
  isOwner: boolean
}

export function EditorWorkspaceShell({
  project,
  ownedProjects,
  sharedProjects,
  isOwner,
}: EditorWorkspaceShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [aiSidebarOpen, setAiSidebarOpen] = useState(true)
  const [shareOpen, setShareOpen] = useState(false)
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
  } = useProjectActions(project.id)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#070708]">
      <EditorNavbar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        projectName={project.name}
        subtitle="Workspace"
        aiSidebarOpen={aiSidebarOpen}
        onToggleAiSidebar={() => setAiSidebarOpen((o) => !o)}
        onOpenShare={() => setShareOpen(true)}
        showWorkspaceActions
      />

      <div className="flex min-h-0 flex-1 gap-3 p-3 pt-[76px]">
        <ProjectSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          activeProjectId={project.id}
          onOpenCreate={openCreate}
          onOpenRename={openRename}
          onOpenDelete={openDelete}
          docked
        />

        <main className="flex min-w-0 flex-1 gap-3">
          <section className="relative flex min-w-0 flex-1 overflow-hidden rounded-3xl border border-surface-border bg-[#0b0b0f]">
            <CanvasRoom roomId={project.id} />
          </section>

          {aiSidebarOpen && (
            <aside className="hidden w-80 shrink-0 overflow-hidden rounded-3xl border border-surface-border bg-[#0d0d10] lg:flex lg:flex-col xl:w-[400px]">
              <div className="flex items-center justify-between border-b border-surface-border px-6 py-6">
                <div>
                  <h2 className="text-base font-semibold text-copy-primary">AI Copilot</h2>
                  <p className="text-xs font-medium text-copy-faint">Placeholder panel</p>
                </div>
                <Sparkles className="size-5 text-ai-text" />
              </div>
              <div className="flex flex-1 flex-col justify-between p-7">
                <div className="rounded-3xl border border-surface-border bg-elevated/60 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ai/20 text-ai-text">
                      <Bot className="size-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-copy-primary">
                        Chat surface pending
                      </h3>
                      <p className="text-sm font-medium leading-6 text-copy-muted">
                        The toggle is wired. Messaging and generation are intentionally out of
                        scope here.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-surface-border bg-black/30 p-6">
                  <p className="mb-4 text-xs font-semibold tracking-[0.35em] text-copy-faint">
                    FUTURE HOOKS
                  </p>
                  <p className="text-sm font-medium leading-7 text-copy-muted">
                    Prompt composer, run status, and architecture guidance will attach to this
                    sidebar.
                  </p>
                </div>
              </div>
            </aside>
          )}
        </main>
      </div>

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
      <ShareDialog
        open={shareOpen}
        projectId={project.id}
        projectName={project.name}
        canManage={isOwner}
        onClose={() => setShareOpen(false)}
      />
    </div>
  )
}
