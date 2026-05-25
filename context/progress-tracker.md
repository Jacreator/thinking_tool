# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 03 (pending spec)

## Current Goal

- Define the immediate implementation goal here

## Completed

- Cleaned up Next.js boilerplate (stripped globals.css, removed SVGs, replaced page.tsx with minimal shell)
- Feature 01: Design system — shadcn/ui initialized (Tailwind v4 compatible), all 7 UI primitive components added (Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea), lucide-react installed, lib/utils.ts cn() helper created, globals.css updated with dark-only theme and project design tokens
- Feature 02: Editor chrome — EditorNavbar (fixed top bar, sidebar toggle with PanelLeftOpen/PanelLeftClose, z-40) and ProjectSidebar (floating overlay, slides from left, Tabs with My Projects/Shared placeholder states, New Project button) created in components/editor/; dialog pattern confirmed ready via existing shadcn Dialog with title/description/footer exports

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

## Session Notes

- Project is ghost-ai (Next.js 16, Tailwind v4, TypeScript strict mode).
- globals.css uses @import "tailwindcss" + @import "tw-animate-css" + @import "shadcn/tailwind.css" (Tailwind v4 syntax, no tailwind.config.js).
- shadcn version: 4.8.0. Components live in components/ui/.
