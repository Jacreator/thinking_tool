"use client"

import { useState } from "react"
import { Bot, Compass, Sparkles } from "lucide-react"
import { EditorNavbar } from "./editor-navbar"
import { ProjectSidebar } from "./project-sidebar"
import { CreateProjectDialog } from "./create-project-dialog"
import { RenameProjectDialog } from "./rename-project-dialog"
import { DeleteProjectDialog } from "./delete-project-dialog"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { ProjectSummary } from "@/lib/projects"

interface EditorWorkspaceShellProps {
  project: ProjectSummary
  ownedProjects: ProjectSummary[]
  sharedProjects: ProjectSummary[]
}

export function EditorWorkspaceShell({
  project,
  ownedProjects,
  sharedProjects,
}: EditorWorkspaceShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [aiSidebarOpen, setAiSidebarOpen] = useState(true)
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
          <section className="relative flex min-w-0 flex-1 items-center justify-center overflow-hidden rounded-3xl border border-surface-border bg-[#0b0b0f] p-8">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:96px_96px]" />
            <div className="absolute left-1/2 top-0 h-72 w-[48rem] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-80 w-[34rem] rounded-full bg-ai/[0.14] blur-3xl" />
            <div className="relative flex max-w-2xl flex-col items-center gap-6 text-center">
              <div className="flex size-20 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_0_40px_rgba(0,200,212,0.08)]">
                <Compass className="size-9 text-brand drop-shadow-[0_0_14px_rgba(0,200,212,0.65)]" />
              </div>
              <div className="space-y-5">
                <p className="text-xs font-semibold tracking-[0.45em] text-copy-faint">
                  WORKSPACE SHELL
                </p>
                <h1 className="text-balance text-3xl font-semibold leading-tight text-copy-primary md:text-4xl">
                  Canvas and collaboration tooling land here next.
                </h1>
                <p className="mx-auto max-w-xl text-balance text-base font-medium leading-8 text-copy-muted">
                  This room is ready for the shared architecture canvas, durable AI workflows, and
                  real-time presence. For now, the shell is wired with project context and
                  navigation only.
                </p>
              </div>
            </div>
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
    </div>
  )
}
