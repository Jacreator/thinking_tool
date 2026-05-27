import { redirect } from "next/navigation"
import { AccessDenied } from "@/components/editor/access-denied"
import { EditorWorkspaceShell } from "@/components/editor/editor-workspace-shell"
import { checkProjectAccess, getCurrentClerkIdentity } from "@/lib/project-access"
import { getProjectsForUser } from "@/lib/projects"

interface EditorWorkspacePageProps {
  params: Promise<{ roomId: string }>
}

export default async function EditorWorkspacePage({ params }: EditorWorkspacePageProps) {
  const identity = await getCurrentClerkIdentity()
  if (!identity) {
    redirect("/sign-in")
  }

  const { roomId } = await params
  const access = await checkProjectAccess(roomId, identity)

  if (!access.hasAccess || !access.project) {
    return <AccessDenied />
  }

  const { owned, shared } = await getProjectsForUser(identity.userId, identity.primaryEmail)

  return (
    <EditorWorkspaceShell
      project={access.project}
      ownedProjects={owned}
      sharedProjects={shared}
      isOwner={access.isOwner}
    />
  )
}
