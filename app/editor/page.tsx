import { redirect } from "next/navigation"
import { getProjectsForUser } from "@/lib/projects"
import { EditorShell } from "@/components/editor/editor-shell"
import { getCurrentClerkIdentity } from "@/lib/project-access"

export default async function EditorPage() {
  const identity = await getCurrentClerkIdentity()
  if (!identity) redirect("/sign-in")

  const { owned, shared } = await getProjectsForUser(identity.userId, identity.primaryEmail)

  return <EditorShell ownedProjects={owned} sharedProjects={shared} />
}
