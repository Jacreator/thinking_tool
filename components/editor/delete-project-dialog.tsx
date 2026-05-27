"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { ProjectSummary } from "@/lib/projects"

interface DeleteProjectDialogProps {
  open: boolean
  project: ProjectSummary | null
  isLoading: boolean
  onConfirm: () => void
  onClose: () => void
}

export function DeleteProjectDialog({
  open,
  project,
  isLoading,
  onConfirm,
  onClose,
}: DeleteProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          {project && (
            <DialogDescription>
              &ldquo;{project.name}&rdquo; will be permanently deleted. This cannot be undone.
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button variant="destructive" disabled={isLoading} onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
