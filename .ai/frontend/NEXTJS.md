# Next.js

Rules for using Next.js (App Router) in this project.

---

# App Router Only

The project uses the App Router (`app/`). The AI MUST NOT introduce the Pages Router
(`pages/`) or suggest patterns from it.

---

# Server Components by Default

Every component is a Server Component unless it needs interactivity, browser APIs, or a
Zustand store.

The AI MUST:

- default to Server Components
- add `"use client"` only when the component actually needs state, effects, event handlers,
  or a client-only library

The AI MUST NOT add `"use client"` to a component just to "be safe," and MUST NOT add it to a
whole layout/page when only a small interactive part needs it — extract that part into its
own client component instead.

---

# Data Fetching

Fetch CMS data in Server Components, Server Actions, or Route Handlers via `lib/cms/` —
never in Client Components with `useEffect`.

Use Next.js's built-in fetch caching and revalidation instead of a client-side data-fetching
library or a Zustand store:

```ts
fetch(url, { next: { revalidate: 3600, tags: ['blog-post:' + slug] } })
```

Prefer tag-based revalidation (`revalidateTag`) driven by a Payload webhook Route Handler
over blanket `revalidate: false` / manual redeploys, when the content changes on an
unpredictable schedule.

---

# Route Handlers

`app/api/.../route.ts` is for the Website's own endpoints only (revalidation webhooks,
sitemap/robots, health checks) — never a proxy that just re-exposes Payload's API 1:1
without adding value. See `backend/ROUTE_HANDLERS.md`.

---

# Rendering Strategy

- Prefer static rendering / ISR (`revalidate`) for content-driven pages (blog, vehicle
  listings, marketing pages).
- Use dynamic rendering only when the page genuinely requires per-request data (e.g.
  authenticated/tenant-specific views, live preview mode).
- Respect Payload's draft/live-preview mode: when `?preview=true` is present, bypass the
  cache and fetch drafts — do not cache preview responses.

---

# Metadata

Use the Next.js Metadata API (`generateMetadata`) fed from Payload's SEO fields (title,
description, canonical URL, structured data) rather than hand-rolled `<head>` tags.

---

# Images

Use `next/image` for all CMS-served images. Configure `remotePatterns` for the Payload
media/Azure Storage origin rather than disabling image optimization.

---

# Error and Loading States

Use `error.tsx` and `loading.tsx` at the appropriate route segment instead of manual
try/catch + spinner state scattered through components.

---

# Never Start the Development Server

The AI MUST NOT run `pnpm dev` / `next dev`. Tell the user when a restart is required.
