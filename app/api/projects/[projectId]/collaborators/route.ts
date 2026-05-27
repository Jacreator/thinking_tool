import { clerkClient } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import {
  checkProjectAccess,
  getCurrentClerkIdentity,
  isValidCollaboratorEmail,
  normalizeCollaboratorEmail,
} from "@/lib/project-access"

interface RouteContext {
  params: Promise<{ projectId: string }>
}

function serializeError(message: string, status: number) {
  return Response.json({ error: message }, { status })
}

async function getProjectForOwnerCheck(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, ownerId: true },
  })
}

async function enrichCollaborators(
  collaborators: Array<{ id: string; email: string; createdAt: Date }>
) {
  const emails = collaborators.map((collaborator) => collaborator.email)
  if (emails.length === 0) return []

  const client = await clerkClient()
  const users = await client.users.getUserList({
    emailAddress: emails,
    limit: emails.length,
  })
  const userByEmail = new Map(
    users.data.flatMap((user) =>
      user.emailAddresses.map((email) => [
        normalizeCollaboratorEmail(email.emailAddress),
        user,
      ])
    )
  )

  return collaborators.map((collaborator) => {
    const user = userByEmail.get(collaborator.email)

    return {
      id: collaborator.id,
      email: collaborator.email,
      createdAt: collaborator.createdAt.toISOString(),
      displayName: user?.fullName ?? null,
      avatarUrl: user?.imageUrl ?? null,
    }
  })
}

export async function GET(_request: Request, { params }: RouteContext) {
  const identity = await getCurrentClerkIdentity()
  if (!identity) return serializeError("Unauthorized", 401)

  const { projectId } = await params
  const access = await checkProjectAccess(projectId, identity)
  if (!access.project) return serializeError("Not found", 404)
  if (!access.hasAccess) return serializeError("Forbidden", 403)

  const collaborators = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true, createdAt: true },
  })

  return Response.json({
    collaborators: await enrichCollaborators(collaborators),
    canManage: access.isOwner,
  })
}

export async function POST(request: Request, { params }: RouteContext) {
  const identity = await getCurrentClerkIdentity()
  if (!identity) return serializeError("Unauthorized", 401)

  const { projectId } = await params
  const project = await getProjectForOwnerCheck(projectId)
  if (!project) return serializeError("Not found", 404)
  if (project.ownerId !== identity.userId) return serializeError("Forbidden", 403)

  const body = await request.json().catch(() => ({}))
  const email = typeof body.email === "string" ? body.email : ""
  if (!isValidCollaboratorEmail(email)) {
    return serializeError("Valid email is required", 400)
  }

  const collaboratorEmail = normalizeCollaboratorEmail(email)

  try {
    const collaborator = await prisma.projectCollaborator.create({
      data: { projectId, email: collaboratorEmail },
      select: { id: true, email: true, createdAt: true },
    })

    const [enriched] = await enrichCollaborators([collaborator])
    return Response.json({ collaborator: enriched }, { status: 201 })
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: unknown }).code === "P2002"
    ) {
      return serializeError("Collaborator already invited", 409)
    }
    throw error
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const identity = await getCurrentClerkIdentity()
  if (!identity) return serializeError("Unauthorized", 401)

  const { projectId } = await params
  const project = await getProjectForOwnerCheck(projectId)
  if (!project) return serializeError("Not found", 404)
  if (project.ownerId !== identity.userId) return serializeError("Forbidden", 403)

  const body = await request.json().catch(() => ({}))
  const collaboratorId = typeof body.collaboratorId === "string" ? body.collaboratorId : ""
  if (!collaboratorId) {
    return serializeError("collaboratorId is required", 400)
  }

  const deleted = await prisma.projectCollaborator.deleteMany({
    where: { id: collaboratorId, projectId },
  })
  if (deleted.count === 0) return serializeError("Collaborator not found", 404)

  return new Response(null, { status: 204 })
}
