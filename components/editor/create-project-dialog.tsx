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

interface CreateProjectDialogProps {
  open: boolean
  formName: string
  roomIdPreview: string
  isLoading: boolean
  error: string | null
  onNameChange: (name: string) => void
  onSubmit: () => void
  onClose: () => void
}

export function CreateProjectDialog({
  open,
  formName,
  roomIdPreview,
  isLoading,
  error,
  onNameChange,
  onSubmit,
  onClose,
}: CreateProjectDialogProps) {
  const canSubmit = formName.trim().length > 0 && roomIdPreview.length > 0 && !isLoading

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-primary">New Project</DialogTitle>
          <DialogDescription>
            Give your architecture workspace a name.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Input
            autoFocus
            placeholder="Project name"
            className="text-white"
            value={formName}
            onChange={(e) => onNameChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canSubmit) onSubmit()
            }}
          />
          {formName.trim() && (
            <p className="font-mono text-xs text-copy-muted">
              room: <span className="text-copy-secondary">{roomIdPreview || "…"}</span>
            </p>
          )}
          {error && (
            <p className="text-xs text-error">{error}</p>
          )}
        </div>
        <DialogFooter showCloseButton>
          <Button disabled={!canSubmit} onClick={onSubmit}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
