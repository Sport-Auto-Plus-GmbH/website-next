# Error Handling

Rules for handling errors in this project.

---

# Never Swallow Errors

No empty `catch` blocks. Every caught error is either handled meaningfully (fallback,
retry, typed error result) or logged and re-thrown.

---

# CMS Failures Are Expected, Not Exceptional

Payload can be slow, temporarily unreachable, or return a 404/empty result for legitimate
reasons (unpublished content, a slug that no longer exists). `lib/cms/` functions and their
callers MUST distinguish:

- **"Not found"** (valid, expected) → render a proper empty/not-found state
  (`notFound()` in a Server Component, an empty-state UI in a list).
- **Infrastructure failure** (network error, 5xx, timeout) → let it propagate to the route's
  `error.tsx`, or handle it with a clear retry/fallback UI — never render a blank or broken
  page silently.

---

# User-Facing vs Logged Detail

Show the user a short, friendly message. Log the full detail (status code, endpoint,
correlation info) server-side. Never surface a raw Payload error body or stack trace to the
browser.

---

# Server Actions and Route Handlers

Return typed, explicit error results (`{ success: false, error: 'VALIDATION_ERROR', ... }`)
rather than throwing across the client/server boundary. See `backend/SERVER_ACTIONS.md`,
`backend/ROUTE_HANDLERS.md`.

---

# Client Components

Wrap client-side logic that can throw (e.g. a client-side computation on CMS-provided data)
so a single bad content entry cannot crash an entire page — prefer a local error boundary or
defensive checks over letting one broken component take down the route.
