import Link from "next/link"
import { LockKeyhole } from "lucide-react"

export function AccessDenied() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base px-6">
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-full border border-surface-border bg-elevated text-copy-secondary">
          <LockKeyhole className="size-5" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-copy-primary">Access denied</h1>
          <p className="text-sm text-copy-muted">
            This project does not exist, or you do not have permission to open it.
          </p>
        </div>
        <Link
          href="/editor"
          className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Back to editor
        </Link>
      </div>
    </main>
  )
}
