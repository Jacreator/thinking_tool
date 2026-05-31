import { currentUser } from "@clerk/nextjs/server";
import { getCursorColor, liveblocks } from "@/lib/liveblocks";
import {
  checkProjectAccess,
  getCurrentClerkIdentity,
} from "@/lib/project-access";

export async function POST(request: Request) {
  const identity = await getCurrentClerkIdentity();
  if (!identity) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const room = typeof body.room === "string" ? body.room : "";
  if (!room) {
    return new Response("room is required", { status: 400 });
  }

  const access = await checkProjectAccess(room, identity);
  if (!access.hasAccess) {
    return new Response("Forbidden", { status: 403 });
  }

  await liveblocks.getOrCreateRoom(room, { defaultAccesses: [] });

  const user = await currentUser();
  const name =
    user?.fullName ??
    user?.username ??
    identity.primaryEmail ??
    "Anonymous";
  const avatar = user?.imageUrl ?? "";
  const color = getCursorColor(identity.userId);

  const session = liveblocks.prepareSession(identity.userId, {
    userInfo: { name, avatar, color },
  });
  session.allow(room, session.FULL_ACCESS);

  const { body: tokenBody, status } = await session.authorize();
  return new Response(tokenBody, { status });
}
