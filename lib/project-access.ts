import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import type { ProjectSummary } from "@/lib/projects"

export interface ClerkIdentity {
  userId: string
  primaryEmail: string
}

export interface ProjectAccessResult {
  project: ProjectSummary | null
  hasAccess: boolean
  isOwner: boolean
}

export async function getCurrentClerkIdentity(): Promise<ClerkIdentity | null> {
  const { isAuthenticated, userId } = await auth()
  if (!isAuthenticated || !userId) {
    return null
  }

  const user = await currentUser()
  const primaryEmail =
    user?.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    ""

  return { userId, primaryEmail }
}

export async function checkProjectAccess(
  projectId: string,
  identity: ClerkIdentity
): Promise<ProjectAccessResult> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      ownerId: true,
      collaborators: {
        where: { email: identity.primaryEmail },
        select: { id: true },
        take: 1,
      },
    },
  })

  if (!project) {
    return { project: null, hasAccess: false, isOwner: false }
  }

  const isOwner = project.ownerId === identity.userId
  const isCollaborator = project.collaborators.length > 0

  return {
    project: { id: project.id, name: project.name },
    hasAccess: isOwner || isCollaborator,
    isOwner,
  }
}
