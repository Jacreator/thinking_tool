# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 07 (complete)

## Current Goal

- None. Feature 07 delivered and verified.

## Completed

- Cleaned up Next.js boilerplate (stripped globals.css, removed SVGs, replaced page.tsx with minimal shell)
- Feature 01: Design system — shadcn/ui initialized (Tailwind v4 compatible), all 7 UI primitive components added (Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea), lucide-react installed, lib/utils.ts cn() helper created, globals.css updated with dark-only theme and project design tokens
- Feature 02: Editor chrome — EditorNavbar (fixed top bar, sidebar toggle with PanelLeftOpen/PanelLeftClose, z-40) and ProjectSidebar (floating overlay, slides from left, Tabs with My Projects/Shared placeholder states, New Project button) created in components/editor/; dialog pattern confirmed ready via existing shadcn Dialog with title/description/footer exports
- Feature 03: Auth — ClerkProvider wraps root layout with dark theme + CSS variable overrides (no hardcoded colors); two-panel sign-in/sign-up pages (left: logo/tagline/feature list on lg+, right: Clerk form); root `/` redirects authenticated → `/editor`, unauthenticated → `/sign-in`; UserButton added to EditorNavbar right section; proxy.ts uses env vars (NEXT_PUBLIC_CLERK_SIGN_IN_URL / NEXT_PUBLIC_CLERK_SIGN_UP_URL) for public route matching, all other routes protected by default
- Feature 04: Project dialogs — editor home screen (heading, description, New Project button); Create/Rename/Delete dialogs; `useProjectDialogs` hook managing dialog/form/loading state; ProjectSidebar updated with project items (rename+delete actions for owned projects only, hidden for shared), mobile backdrop scrim; all wired to mock data (lib/mock-projects.ts); no API calls or persistence
- Feature 05: Prisma models and config — `prisma/models/project.prisma` with `Project` and `ProjectCollaborator` models (status enum, cascade delete, indexes); `lib/prisma.ts` cached singleton branching on `prisma+postgres://` (accelerateUrl) vs direct (`@prisma/adapter-pg`); first migration `20260526215241_init` applied to cloud Prisma Postgres; `npm run build` passes
- Feature 06: Project REST API — `app/api/projects/route.ts` (GET list by owner, POST create with default name "Untitled Project"); `app/api/projects/[projectId]/route.ts` (PATCH rename, DELETE delete); 401 for unauthenticated, 403 for non-owner mutations; Clerk `isAuthenticated`/`userId` via `auth()` from `@clerk/nextjs/server`; `params` awaited as Promise per Next.js 16; no UI wiring
- Feature 07: Wire editor home — `lib/projects.ts` server-side helper fetches owned + shared projects via Prisma; `app/editor/page.tsx` is now an async server component that passes real project lists to `EditorShell`; `hooks/use-project-actions.ts` manages dialog state and calls POST/PATCH/DELETE API routes (create slugifies name + random suffix as room ID, navigates to `/editor/[roomId]`; rename calls PATCH + refresh; delete calls DELETE + redirect if active else refresh); all dialogs and sidebar updated to use `ProjectSummary` type; `mock-projects.ts` and old `use-project-dialogs.ts` deleted; `npm run build` passes

## In Progress

- None.

## Next Up

- Add the next planned feature unit here.

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
