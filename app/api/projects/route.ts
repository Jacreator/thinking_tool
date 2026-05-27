import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId! },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(projects);
}

export async function POST(request: Request) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : "Untitled Project";
  const id = typeof body.id === "string" && body.id.trim() ? body.id.trim() : undefined;

  if (id !== undefined) {
    if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) {
      return Response.json({ error: "Invalid project ID format" }, { status: 400 });
    }
    const existing = await prisma.project.findUnique({ where: { id } });
    if (existing) {
      return Response.json({ error: "Project ID already exists, please try again" }, { status: 409 });
    }
  }

  try {
    const project = await prisma.project.create({
      data: {
        ...(id && { id }),
        ownerId: userId!,
        name,
      },
    });
    return Response.json(project, { status: 201 });
  } catch (e: unknown) {
    if (
      typeof e === "object" && e !== null &&
      "code" in e && (e as { code: unknown }).code === "P2002"
    ) {
      return Response.json({ error: "Project ID already exists, please try again" }, { status: 409 });
    }
    throw e;
  }
}
