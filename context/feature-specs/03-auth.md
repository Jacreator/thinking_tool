# Auth Specs

Clerk is already installed and connected. Wire it into the Next.js app: provider, auth pages, redirects, route protection, and user menu.

## Design

Use Clerk’s `dark` theme from `@clerk/ui/themes` as the base.

Override Clerk appearance variables using the app’s existing CSS variables. Do not hardcode colors.

### Sign-in and sign-up pages

- large screens: simple two-panel layout
- left: compact logo, tagline, short text-only feature list
- right: centered Clerk form
- small screens: form only
- no gradients
- no oversized hero sections
- no feature cards
- no scroll-heavy layouts

Keep the layout minimal and professional.

## Implementation

Wrap the root layout with `ClerkProvider` using Clerk’s `dark` theme.

Create sign-in and sign-up pages using Clerk components.

Use `proxy.ts` at the project root, not `middleware.ts`.

Define public routes using the existing sign-in and sign-up env vars. Protect everything else by default.

Update `/`:

- authenticated users redirect to `/editor`
- unauthenticated users redirect to `/sign-in`

Add Clerk’s built-in `UserButton` to the editor navbar right section for profile settings and logout.

Keep Clerk’s default user menu and profile flows intact. Do not rebuild or heavily customize Clerk internals.

Use existing Clerk env vars. Do not rename or invent new ones.

## Dependencies

install: @clerk/ui.

## Check When Done

- `proxy.ts` exists at the root
- all routes are protected except public auth paths
- auth pages use CSS variables with no hardcoded colors
- `ClerkProvider` wraps the root layout
- `npm run build` passes

---

## Fixes

### Fix 01 — Auth page layout and font

**Prompt given:**

> Review the screenshot, update the UI of our current application to look more like the one on the screenshot. It means a 50/50 left and right side layout with some kind of a color on the side to differentiate it from a dark background. We also need to fix the fonts so that it uses the ones outlined in our UI guidelines.

**Summary:**

The initial implementation used a fixed-width left panel (`w-115`) that left the right side filling the remainder rather than achieving a true 50/50 split. The left panel had no background differentiation from the right side, and the Clerk form was inheriting the browser default font instead of Geist Sans.

Changes made:

- Both panels set to `w-1/2`. On small screens the left panel is hidden (`hidden lg:flex`) and the form takes the full width.
- Left panel given `bg-surface` (`#111114`) with a `border-r border-surface-border` to visually separate it from the `bg-base` (`#080809`) right side.
- Left panel redesigned with a pinned top-left logo badge (cyan "G" avatar + "Ghost AI" label), a large `text-4xl font-bold` hero headline, a muted description paragraph, and three feature items each with a circular `bg-accent-dim` icon badge (Lucide icon in `text-brand`) plus bold title and muted description.
- `fontFamily: "var(--font-geist-sans)"` added to the Clerk appearance `variables` in `app/layout.tsx` so the Clerk form inherits Geist Sans instead of the browser default.
