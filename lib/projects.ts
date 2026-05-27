import { prisma } from "@/lib/prisma"
import { isValidCollaboratorEmail } from "@/lib/project-access"

export interface ProjectSummary {
  id: string
  name: string
}

export async function getProjectsForUser(
  userId: string,
  userEmail: string | null
): Promise<{ owned: ProjectSummary[]; shared: ProjectSummary[] }> {
  const ownedPromise = prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
  })

  if (!isValidCollaboratorEmail(userEmail)) {
    return { owned: await ownedPromise, shared: [] }
  }

  const [owned, shared] = await Promise.all([
    ownedPromise,
    prisma.project.findMany({
      where: {
        ownerId: { not: userId },
        collaborators: { some: { email: userEmail } },
      },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true },
    }),
  ])

  return { owned, shared }
}
