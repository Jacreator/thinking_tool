# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 11 (complete)

## Current Goal

- None. Feature 11 delivered and verified.

## Completed

- Cleaned up Next.js boilerplate (stripped globals.css, removed SVGs, replaced page.tsx with minimal shell)
- Feature 01: Design system — shadcn/ui initialized (Tailwind v4 compatible), all 7 UI primitive components added (Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea), lucide-react installed, lib/utils.ts cn() helper created, globals.css updated with dark-only theme and project design tokens
- Feature 02: Editor chrome — EditorNavbar (fixed top bar, sidebar toggle with PanelLeftOpen/PanelLeftClose, z-40) and ProjectSidebar (floating overlay, slides from left, Tabs with My Projects/Shared placeholder states, New Project button) created in components/editor/; dialog pattern confirmed ready via existing shadcn Dialog with title/description/footer exports
- Feature 03: Auth — ClerkProvider wraps root layout with dark theme + CSS variable overrides (no hardcoded colors); two-panel sign-in/sign-up pages (left: logo/tagline/feature list on lg+, right: Clerk form); root `/` redirects authenticated → `/editor`, unauthenticated → `/sign-in`; UserButton added to EditorNavbar right section; proxy.ts uses env vars (NEXT_PUBLIC_CLERK_SIGN_IN_URL / NEXT_PUBLIC_CLERK_SIGN_UP_URL) for public route matching, all other routes protected by default
- Feature 04: Project dialogs — editor home screen (heading, description, New Project button); Create/Rename/Delete dialogs; `useProjectDialogs` hook managing dialog/form/loading state; ProjectSidebar updated with project items (rename+delete actions for owned projects only, hidden for shared), mobile backdrop scrim; all wired to mock data (lib/mock-projects.ts); no API calls or persistence
- Feature 05: Prisma models and config — `prisma/models/project.prisma` with `Project` and `ProjectCollaborator` models (status enum, cascade delete, indexes); `lib/prisma.ts` cached singleton branching on `prisma+postgres://` (accelerateUrl) vs direct (`@prisma/adapter-pg`); first migration `20260526215241_init` applied to cloud Prisma Postgres; `npm run build` passes
- Feature 06: Project REST API — `app/api/projects/route.ts` (GET list by owner, POST create with default name "Untitled Project"); `app/api/projects/[projectId]/route.ts` (PATCH rename, DELETE delete); 401 for unauthenticated, 403 for non-owner mutations; Clerk `isAuthenticated`/`userId` via `auth()` from `@clerk/nextjs/server`; `params` awaited as Promise per Next.js 16; no UI wiring
- Feature 07: Wire editor home — `lib/projects.ts` server-side helper fetches owned + shared projects via Prisma; `app/editor/page.tsx` is now an async server component that passes real project lists to `EditorShell`; `hooks/use-project-actions.ts` manages dialog state and calls POST/PATCH/DELETE API routes (create slugifies name + random suffix as room ID, navigates to `/editor/[roomId]`; rename calls PATCH + refresh; delete calls DELETE + redirect if active else refresh); all dialogs and sidebar updated to use `ProjectSummary` type; `mock-projects.ts` and old `use-project-dialogs.ts` deleted; `npm run build` passes
- Feature 08: Workspace shell — `app/editor/[roomId]/page.tsx` server component redirects unauthenticated users to `/sign-in`, uses `lib/project-access.ts` for Clerk identity + owner/collaborator access checks, renders `AccessDenied` for missing/unauthorized projects, and passes current project context into `EditorWorkspaceShell`; workspace layout includes project navbar title/subtitle, share/AI toggle actions, docked rounded ProjectSidebar with active cyan room highlight, framed grid canvas placeholder, right AI Copilot placeholder panel; `08-editor-workspace-shell.md` updated to capture the attached visual target; `npm run build` passes
- Feature 09: Share dialog — workspace Share button opens `ShareDialog`; owners can invite/remove collaborators and copy the project link with `Copied!` feedback; collaborators can view the enriched collaborator list read-only; `app/api/projects/[projectId]/collaborators/route.ts` lists/invites/removes collaborators with server-side ownership checks for mutations and Clerk Backend API enrichment for display names/avatars; collaborator email lookups normalize and skip invalid/missing emails; `npm run build` passes
- Feature 10: Liveblocks setup — `liveblocks.config.ts` at project root defines `Presence` (cursor position + `isThinking`) and `UserMeta` (id, name, avatar, color) types; `lib/liveblocks.ts` exports cached `Liveblocks` node client and `getCursorColor(userId)` that deterministically maps a user ID to a fixed 10-color palette via hash; `POST /api/liveblocks-auth` requires Clerk auth, verifies project access via `checkProjectAccess`, creates room if absent via `getOrCreateRoom`, issues an access-token session with user name/avatar/cursor color; returns 403 for unauthorized access; `@liveblocks/node`, `@liveblocks/client`, `@liveblocks/react` installed; `LIVEBLOCKS_SECRET_KEY` placeholder added to `.env.local`; `npm run build` passes
- Feature 11: Base canvas — `types/canvas.ts` defines `NodeData` (label/color/shape), `CanvasNode`, `CanvasEdge`, `NODE_COLORS` (8 dark palette pairs), `NODE_SHAPES` (6 shapes), `DEFAULT_NODE_COLOR`; `liveblocks.config.ts` Storage updated with `flow: LiveblocksFlow` key; `components/canvas/canvas-room.tsx` client wrapper sets up `LiveblocksProvider` + `RoomProvider` (initialPresence cursor/isThinking, initialStorage with LiveObject/LiveMap flow structure) + `ClientSideSuspense` loading spinner + inline `CanvasErrorBoundary` error fallback; `components/canvas/canvas-flow.tsx` uses `useLiveblocksFlow({ suspense: true })` with empty initial nodes/edges, renders `ReactFlow` with `ConnectionMode.Loose`, `fitView`, dot-pattern `Background`, styled `MiniMap`, `Cursors`; `editor-workspace-shell.tsx` placeholder replaced with `<CanvasRoom roomId={project.id} />`; `npm run build` passes

## In Progress

- None.

## Next Up

- Feature 12 (TBD).

## Open Questions

- None yet.

## Architecture Decisions

- Dark-only theme: no light mode. All colors defined as CSS custom properties in globals.css, mapped to Tailwind tokens via @theme inline.
- shadcn/ui component files in components/ui/ are not to be modified after generation.
- shadcn CSS vars (--background, --foreground, etc.) are set to dark theme values in :root — no .dark block needed.
- Project design tokens (--bg-base, --text-primary, etc.) live alongside shadcn vars in :root and are exposed as Tailwind utilities via @theme inline (bg-base, text-copy-primary, border-surface-border, etc.).
- Prisma v7: `url` must NOT appear in `prisma/schema.prisma` — it lives in `prisma.config.ts` only. The IDE language server shows a spurious diagnostic about the missing url; ignore it.
- `prisma.config.ts` reads `DIRECT_DATABASE_URL` first (direct TCP, needed for `migrate dev` shadow DB), falls back to `DATABASE_URL`. `.env` holds the direct cloud URL; `.env.local` holds the `prisma+postgres://` proxy URL for the app.
- `lib/prisma.ts` branches: `prisma+postgres://` URL → `PrismaClient({ accelerateUrl })`, otherwise → `PrismaClient({ adapter: PrismaPg })`. Import path: `../app/generated/prisma/client`.

## Session Notes

- Project is ghost-ai (Next.js 16, Tailwind v4, TypeScript strict mode).
- globals.css uses @import "tailwindcss" + @import "tw-animate-css" + @import "shadcn/tailwind.css" (Tailwind v4 syntax, no tailwind.config.js).
- shadcn version: 4.8.0. Components live in components/ui/.
