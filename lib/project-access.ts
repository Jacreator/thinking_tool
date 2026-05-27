import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import type { ProjectSummary } from "@/lib/projects"

export interface ClerkIdentity {
  userId: string
  primaryEmail: string | null
}

export interface ProjectAccessResult {
  project: ProjectSummary | null
  hasAccess: boolean
  isOwner: boolean
}

export function isValidCollaboratorEmail(email: string | null | undefined): email is string {
  return typeof email === "string" && email.includes("@") && email.trim() === email
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
    null

  return {
    userId,
    primaryEmail: isValidCollaboratorEmail(primaryEmail) ? primaryEmail : null,
  }
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
    },
  })

  if (!project) {
    return { project: null, hasAccess: false, isOwner: false }
  }

  const isOwner = project.ownerId === identity.userId
  const isCollaborator =
    !isOwner && isValidCollaboratorEmail(identity.primaryEmail)
      ? (await prisma.projectCollaborator.count({
          where: { projectId, email: identity.primaryEmail },
        })) > 0
      : false

  return {
    project: { id: project.id, name: project.name },
    hasAccess: isOwner || isCollaborator,
    isOwner,
  }
}
