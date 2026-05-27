import { prisma } from "@/lib/prisma"

export interface ProjectSummary {
  id: string
  name: string
}

export async function getProjectsForUser(
  userId: string,
  userEmail: string
): Promise<{ owned: ProjectSummary[]; shared: ProjectSummary[] }> {
  const [owned, shared] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true },
    }),
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
