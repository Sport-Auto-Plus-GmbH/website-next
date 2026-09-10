# CMS Client (`lib/cms/`)

Rules for how the Website talks to the Payload CMS's public REST API. This is the single
allowed integration point between the Website and Payload.

---

# Payload Is a Versioned External Service

The Website MUST treat Payload as an external HTTP API:

- Never assume knowledge of Payload's internal collection config, hooks, or access-control
  rules — only its documented REST response shape.
- Never import anything from the Payload repository (no cross-repo imports, no copying
  `payload-types.ts`). If exact field names are unclear, ask, or inspect a live REST response.

---

# One Client Layer

All `fetch` calls to Payload's REST endpoints (`/api/<collection-slug>`, `/api/<slug>/<id>`,
`/api/globals/<slug>`) MUST go through `lib/cms/<domain>/`. Components, hooks, and Server
Actions MUST NOT call Payload's REST API directly.

```
lib/cms/vehicle/fetch-vehicle-listing.ts
lib/cms/blog/fetch-blog-post.ts
lib/cms/blog/fetch-blog-post-by-slug.ts
```

---

# Function Shape

Each `lib/cms/` function:

1. builds the request (base URL from an env var, query params for `depth`, `locale`, `where`,
   `limit`, draft mode)
2. calls `fetch` with appropriate Next.js caching options
3. validates/parses the response into a Website-owned view type from `types/cms/`
4. throws or returns a typed error result on failure — callers must be able to handle it

```ts
export async function fetchBlogPostBySlug(
  slug: string,
  options?: { draft?: boolean },
): Promise<BlogPost | null> {
  const response = await fetch(
    `${CMS_URL}/api/blog-posts?where[slug][equals]=${encodeURIComponent(slug)}&depth=2` +
      (options?.draft ? '&draft=true' : ''),
    {
      next: options?.draft ? { revalidate: 0 } : { revalidate: 3600, tags: [`blog-post:${slug}`] },
      headers: options?.draft ? { Authorization: `Bearer ${PAYLOAD_PREVIEW_TOKEN}` } : undefined,
    },
  )

  if (!response.ok) {
    throw new CmsRequestError('blog-posts', response.status)
  }

  const data = await response.json()
  return mapBlogPostResponse(data.docs[0])
}
```

---

# Response Mapping

Never pass a raw Payload REST response into a component. Map it into a slim, Website-owned
type under `types/cms/<domain>/` inside a dedicated `map-*.ts` function next to the fetch
function. This keeps the rest of the app decoupled from Payload's field names/nesting and
gives one place to update when a Payload field changes.

---

# Drafts and Live Preview

- Requests made for Payload's live-preview mode MUST bypass caching (`revalidate: 0`) and
  request drafts (`draft=true` with the appropriate preview auth) — never serve a stale
  cached published version while in preview.
- Outside of preview, always request published content only.

---

# Localization

Payload serves `de` (default) and `en` locales. Pass the `locale` query param explicitly
based on the Website's active locale — never rely on Payload's fallback silently substituting
the wrong language without the caller being aware.

---

# Multi-Tenant Requests

If a request is tenant-scoped, the tenant identifier MUST be passed explicitly by the
caller (e.g. resolved from the request's host/domain) — `lib/cms/` functions must not guess
or hardcode a tenant.

---

# Error Handling

- Network failures, non-2xx responses, and empty results are three different cases — handle
  them distinctly (e.g. throw for network/5xx errors so the route's `error.tsx` can render;
  return `null`/empty array for a legitimate "not found").
- Never leak raw Payload error bodies (which may include internal details) to the client;
  log server-side and show a generic message. See `backend/SECURITY.md`.

---

# No Business Logic Bleed

`lib/cms/` only fetches and maps data. Presentation formatting (currency, dates) belongs in
`lib/shared/format/`; UI-only derived state belongs in hooks/components.
