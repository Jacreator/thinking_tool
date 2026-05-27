import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getProjectsForUser } from "@/lib/projects"
import { EditorShell } from "@/components/editor/editor-shell"

export default async function EditorPage() {
  const { isAuthenticated, userId } = await auth()
  if (!isAuthenticated) redirect("/sign-in")

  const user = await currentUser()
  const userEmail = user?.emailAddresses[0]?.emailAddress ?? ""

  const { owned, shared } = await getProjectsForUser(userId!, userEmail)

  return <EditorShell ownedProjects={owned} sharedProjects={shared} />
}
