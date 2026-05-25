"use client"

import { useState } from "react"
import type { MockProject } from "@/lib/mock-projects"

type DialogType = "create" | "rename" | "delete" | null

interface UseProjectDialogsReturn {
  dialog: DialogType
  selectedProject: MockProject | null
  formName: string
  isLoading: boolean
  openCreate: () => void
  openRename: (project: MockProject) => void
  openDelete: (project: MockProject) => void
  closeDialog: () => void
  setFormName: (name: string) => void
  handleCreate: () => void
  handleRename: () => void
  handleDelete: () => void
}

export function useProjectDialogs(): UseProjectDialogsReturn {
  const [dialog, setDialog] = useState<DialogType>(null)
  const [selectedProject, setSelectedProject] = useState<MockProject | null>(null)
  const [formName, setFormName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  function openCreate() {
    setFormName("")
    setSelectedProject(null)
    setDialog("create")
  }

  function openRename(project: MockProject) {
    setFormName(project.name)
    setSelectedProject(project)
    setDialog("rename")
  }

  function openDelete(project: MockProject) {
    setSelectedProject(project)
    setDialog("delete")
  }

  function closeDialog() {
    setDialog(null)
    setSelectedProject(null)
    setFormName("")
    setIsLoading(false)
  }

  function handleCreate() {
    closeDialog()
  }

  function handleRename() {
    closeDialog()
  }

  function handleDelete() {
    closeDialog()
  }

  return {
    dialog,
    selectedProject,
    formName,
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
