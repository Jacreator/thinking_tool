# Current Issues

Log of bugs and fixes discovered after feature implementation.

---

## Resolved

### Issue 01 — 404 on `/editor` after sign-in / sign-up

**Reported:** After a successful sign-in or sign-up, Clerk redirects to `/editor` (set via `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` and `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`). The route did not exist, so Next.js returned a 404.

**Root cause:** Feature 03 wired the post-auth redirect to `/editor` but the editor route was not yet created. The redirect target was correct; the destination page was missing.

**Fix:** Created two files:

- `components/editor/editor-shell.tsx` — `"use client"` component that owns `sidebarOpen` state and renders `EditorNavbar` + `ProjectSidebar` (both built in Feature 02).
- `app/editor/page.tsx` — server component that renders `EditorShell`. Protected automatically by the `proxy.ts` middleware; unauthenticated users are redirected to `/sign-in` before reaching it.

**Status:** Resolved. `/editor` is a static route in the build output. Build passes.

---

### Issue 02 — Hydration mismatch on `<html>` and `<body>` caused by browser extensions

**Reported:** Console hydration warning on every page load:

> A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.

The diff showed attributes being added to `<html>` (`data-lt-installed="true"` from LanguageTool, `suppresshydrationwarning="true"`) and `<body>` (`cz-shortcut-listen="true"` from ColorZilla) that were not present in the server-rendered markup.

**Root cause:** Browser extensions mutate `<html>` and `<body>` attributes before React's hydration runs. Because the server rendered none of those attributes, React sees a mismatch and logs the warning. This is not a bug in application code — it is an environmental side-effect of installed extensions.

**Fix:** Added `suppressHydrationWarning` to both `<html>` and `<body>` in `app/layout.tsx`. This is the standard Next.js recommendation for extension-caused hydration mismatches; it silences the warning for those two elements only and does not suppress deeper component mismatches.

**Status:** Resolved.
