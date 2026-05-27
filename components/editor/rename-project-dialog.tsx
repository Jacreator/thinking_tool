"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { ProjectSummary } from "@/lib/projects"

interface RenameProjectDialogProps {
  open: boolean
  project: ProjectSummary | null
  formName: string
  isLoading: boolean
  onNameChange: (name: string) => void
  onSubmit: () => void
  onClose: () => void
}

export function RenameProjectDialog({
  open,
  project,
  formName,
  isLoading,
  onNameChange,
  onSubmit,
  onClose,
}: RenameProjectDialogProps) {
  const canSubmit = formName.trim().length > 0 && !isLoading

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-primary">Rename Project</DialogTitle>
          {project && (
            <DialogDescription>
              Renaming &ldquo;{project.name}&rdquo;
            </DialogDescription>
          )}
        </DialogHeader>
        <Input
          autoFocus
          className="text-white"
          placeholder="Project name"
          value={formName}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canSubmit) onSubmit()
          }}
        />
        <DialogFooter showCloseButton>
          <Button disabled={!canSubmit} onClick={onSubmit}>
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
