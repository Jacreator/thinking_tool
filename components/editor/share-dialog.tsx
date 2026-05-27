"use client"

import { useEffect, useMemo, useState } from "react"
import { Check, Copy, Mail, Trash2, UserPlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Collaborator {
  id: string
  email: string
  createdAt: string
  displayName: string | null
  avatarUrl: string | null
}

interface ShareDialogProps {
  open: boolean
  projectId: string
  projectName: string
  canManage: boolean
  onClose: () => void
}

async function extractError(res: Response, fallback: string): Promise<string> {
  const data = await res.json().catch(() => null)
  return typeof data?.error === "string" ? data.error : fallback
}

export function ShareDialog({
  open,
  projectId,
  projectName,
  canManage,
  onClose,
}: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const projectUrl = useMemo(() => {
    if (typeof window === "undefined") return ""
    return `${window.location.origin}/editor/${projectId}`
  }, [projectId])

  useEffect(() => {
    if (!open) return

    let active = true
    setIsLoading(true)
    setError(null)

    fetch(`/api/projects/${projectId}/collaborators`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await extractError(res, "Failed to load collaborators"))
        return res.json() as Promise<{ collaborators: Collaborator[] }>
      })
      .then((data) => {
        if (active) setCollaborators(data.collaborators)
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Failed to load collaborators")
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [open, projectId])

  useEffect(() => {
    if (!copied) return
    const timeout = window.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(timeout)
  }, [copied])

  async function handleInvite() {
    if (!email.trim() || isSaving) return

    setIsSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (!res.ok) {
        setError(await extractError(res, "Failed to invite collaborator"))
        return
      }

      const data = (await res.json()) as { collaborator: Collaborator }
      setCollaborators((current) => [...current, data.collaborator])
      setEmail("")
    } catch (inviteError) {
      setError(inviteError instanceof Error ? inviteError.message : "Failed to invite collaborator")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleRemove(collaboratorId: string) {
    if (removingId) return

    setRemovingId(collaboratorId)
    setError(null)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collaboratorId }),
      })
      if (!res.ok) {
        setError(await extractError(res, "Failed to remove collaborator"))
        return
      }

      setCollaborators((current) =>
        current.filter((collaborator) => collaborator.id !== collaboratorId)
      )
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Failed to remove collaborator")
    } finally {
      setRemovingId(null)
    }
  }

  async function handleCopyLink() {
    if (!projectUrl) return
    await navigator.clipboard.writeText(projectUrl)
    setCopied(true)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <DialogContent className="sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle className="text-primary">Share {projectName}</DialogTitle>
          <DialogDescription>
            Manage who can open this workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input readOnly value={projectUrl} className="font-mono text-xs text-copy-secondary" />
            <Button variant="outline" className="gap-2" onClick={handleCopyLink}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>

          {canManage && (
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="teammate@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleInvite()
                }}
              />
              <Button className="gap-2" disabled={!email.trim() || isSaving} onClick={handleInvite}>
                <UserPlus className="size-4" />
                Invite
              </Button>
            </div>
          )}

          {!canManage && (
            <p className="rounded-lg border border-surface-border bg-subtle/60 px-3 py-2 text-sm text-copy-muted">
              You can view collaborators, but only the project owner can manage access.
            </p>
          )}

          {error && <p className="text-sm text-error">{error}</p>}

          <div className="rounded-xl border border-surface-border">
            <div className="border-b border-surface-border px-3 py-2 text-sm font-medium text-copy-primary">
              Collaborators
            </div>
            <div className="max-h-72 overflow-y-auto p-2">
              {isLoading ? (
                <p className="px-2 py-6 text-center text-sm text-copy-muted">Loading collaborators...</p>
              ) : collaborators.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {collaborators.map((collaborator) => (
                    <div
                      key={collaborator.id}
                      className="flex items-center gap-3 rounded-lg px-2 py-2"
                    >
                      {collaborator.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={collaborator.avatarUrl}
                          alt=""
                          className="size-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex size-9 items-center justify-center rounded-full bg-subtle text-copy-muted">
                          <Mail className="size-4" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-copy-primary">
                          {collaborator.displayName ?? collaborator.email}
                        </p>
                        {collaborator.displayName && (
                          <p className="truncate text-xs text-copy-muted">{collaborator.email}</p>
                        )}
                      </div>
                      {canManage && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled={removingId === collaborator.id}
                          onClick={() => handleRemove(collaborator.id)}
                          title="Remove collaborator"
                        >
                          <Trash2 className="size-4 text-error" />
                          <span className="sr-only">Remove collaborator</span>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="px-2 py-6 text-center text-sm text-copy-muted">
                  No collaborators yet.
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  )
}
