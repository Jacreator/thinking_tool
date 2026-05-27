"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { ProjectSummary } from "@/lib/projects"

type DialogType = "create" | "rename" | "delete" | null

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 7)
}

interface UseProjectActionsReturn {
  dialog: DialogType
  selectedProject: ProjectSummary | null
  formName: string
  roomIdPreview: string
  isLoading: boolean
  openCreate: () => void
  openRename: (project: ProjectSummary) => void
  openDelete: (project: ProjectSummary) => void
  closeDialog: () => void
  setFormName: (name: string) => void
  handleCreate: () => Promise<void>
  handleRename: () => Promise<void>
  handleDelete: () => Promise<void>
}

export function useProjectActions(activeProjectId?: string): UseProjectActionsReturn {
  const router = useRouter()
  const [dialog, setDialog] = useState<DialogType>(null)
  const [selectedProject, setSelectedProject] = useState<ProjectSummary | null>(null)
  const [formName, setFormName] = useState("")
  const [suffix, setSuffix] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const slug = toSlug(formName)
  const roomIdPreview = slug ? `${slug}-${suffix}` : ""

  function openCreate() {
    setFormName("")
    setSuffix(randomSuffix())
    setSelectedProject(null)
    setDialog("create")
  }

  function openRename(project: ProjectSummary) {
    setFormName(project.name)
    setSelectedProject(project)
    setDialog("rename")
  }

  function openDelete(project: ProjectSummary) {
    setSelectedProject(project)
    setDialog("delete")
  }

  function closeDialog() {
    setDialog(null)
    setSelectedProject(null)
    setFormName("")
    setIsLoading(false)
  }

  async function handleCreate() {
    if (!formName.trim() || !roomIdPreview) return
    setIsLoading(true)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName.trim(), id: roomIdPreview }),
      })
      if (!res.ok) throw new Error("Failed to create project")
      closeDialog()
      router.push(`/editor/${roomIdPreview}`)
    } catch {
      setIsLoading(false)
    }
  }

  async function handleRename() {
    if (!selectedProject || !formName.trim()) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName.trim() }),
      })
      if (!res.ok) throw new Error("Failed to rename project")
      closeDialog()
      router.refresh()
    } catch {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (!selectedProject) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete project")
      closeDialog()
      if (activeProjectId === selectedProject.id) {
        router.push("/editor")
      } else {
        router.refresh()
      }
    } catch {
      setIsLoading(false)
    }
  }

  return {
    dialog,
    selectedProject,
    formName,
    roomIdPreview,
    isLoading,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    setFormName,
    handleCreate,
    handleRename,
    handleDelete,
  }
}
