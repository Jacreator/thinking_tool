# Workspace Shell with Server-Side Access Checks

Build the `/editor/[roomId]` workspace shell with server-side access checks. No canvas logic yet.

## Access

`/editor/[roomId]` must be a server component.

Before rendering:

- unauthenticated users redirect to `/sign-in`
- users without project access see `AccessDenied`
- non-existent projects also show `AccessDenied`

Create `components/editor/access-denied.tsx` with:

- centered layout
- lock icon
- short message
- link back to `/editor`

## Access Helpers

Create `lib/project-access.ts` with helpers for:

- getting current Clerk identity: `userId` + primary email
- checking project access by owner or collaborator

## Layout

Build a full-viewport workspace layout with:

- fixed top navbar, about 64px tall, with a dark black surface and bottom border
- navbar left area with sidebar toggle icon, project name as the primary label, and `Workspace` as a muted subtitle
- navbar actions on the right:
  - compact dark `Share` button with share icon
  - bright cyan `AI` toggle button with bot/spark icon
  - Clerk user menu at the far right
- content area below the navbar with visible gutters between three framed panels
- existing `ProjectSidebar` on the left, docked as a rounded framed panel
- current room highlighted in the sidebar
- central canvas placeholder as the largest rounded framed panel
- right sidebar placeholder for future AI chat as a rounded framed panel

The canvas area should fill the remaining space.

### Workspace Visual Target

Match the attached screen:

- overall background is near-black
- left project panel has a rounded border, `Projects` header, close icon, tabs, active cyan-tinted project row, and a cyan `New Project` footer button
- active project row includes a small cyan status dot and uses the current project name
- canvas panel has:
  - very dark surface
  - subtle grid lines
  - soft teal glow near the top center
  - soft purple/indigo glow near the bottom right
  - centered placeholder content
  - small bordered icon tile with cyan icon
  - eyebrow `WORKSPACE SHELL`
  - headline `Canvas and collaboration tooling land here next.`
  - supporting copy explaining that canvas, AI workflows, and presence are intentionally out of scope for now
- right AI panel has:
  - header `AI Copilot` and muted subtitle `Placeholder panel`
  - purple icon accent
  - top placeholder callout titled `Chat surface pending`
  - bottom placeholder callout titled `FUTURE HOOKS`
- keep the layout dense and app-like; do not introduce a marketing hero or explanatory landing page

## Scope

Do not add real canvas logic, Liveblocks, AI chat, or sharing behavior yet.

## Check When Done

- `/editor/[roomId]` builds successfully
- access helper exists outside the page component
- `AccessDenied` is used for missing or unauthorized projects
- workspace layout renders with current project context
- no TypeScript errors
