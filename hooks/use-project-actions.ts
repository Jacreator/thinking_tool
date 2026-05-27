"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import type { ProjectSummary } from "@/lib/projects"

type DialogType = "create" | "rename" | "delete" | null

function toSlug(name: string): string {
  let result = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
  if (result === "") {
    result = `project-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
  }
  return result
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 7)
}

async function extractError(res: Response, fallback: string): Promise<string> {
  const data = await res.json().catch(() => null)
  return (typeof data?.error === "string" && data.error) ? data.error : fallback
}

interface UseProjectActionsReturn {
  dialog: DialogType
  selectedProject: ProjectSummary | null
  formName: string
  roomIdPreview: string
  isLoading: boolean
  error: string | null
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
  const [error, setError] = useState<string | null>(null)

  const slug = useMemo(() => toSlug(formName), [formName])
  const roomIdPreview = formName.trim() ? `${slug}-${suffix}` : ""

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
    setError(null)
  }

  async function handleCreate() {
    if (!formName.trim() || !slug) return
    setError(null)
    setIsLoading(true)

    let currentSuffix = suffix
    const MAX_ATTEMPTS = 5

    try {
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const roomId = `${slug}-${currentSuffix}`
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formName.trim(), id: roomId }),
        })

        if (res.status === 409) {
          currentSuffix = randomSuffix()
          setSuffix(currentSuffix)
          continue
        }

        if (!res.ok) {
          setError(await extractError(res, "Failed to create project"))
          return
        }

        closeDialog()
        router.push(`/editor/${roomId}`)
        return
      }
      setError("Project ID already exists, please try again")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error — please try again")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRename() {
    if (!selectedProject || !formName.trim()) return
    setError(null)
    setIsLoading(true)
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName.trim() }),
      })
      if (!res.ok) {
        setError(await extractError(res, "Failed to rename project"))
        return
      }
      closeDialog()
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error — please try again")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (!selectedProject) return
    setError(null)
    setIsLoading(true)
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        setError(await extractError(res, "Failed to delete project"))
        return
      }
      closeDialog()
      if (activeProjectId === selectedProject.id) {
        router.push("/editor")
      } else {
        router.refresh()
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error — please try again")
    } finally {
      setIsLoading(false)
    }
  }

  return {
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
  }
}
