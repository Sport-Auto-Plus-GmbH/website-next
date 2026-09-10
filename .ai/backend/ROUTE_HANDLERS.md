# Route Handlers

Rules for `app/api/.../route.ts` Route Handlers in this project.

---

# What Belongs Here

Route Handlers are for endpoints the Website itself must expose over HTTP:

- a revalidation webhook Payload calls after publishing content
  (`app/api/revalidate/route.ts`), verified with a shared secret
- `sitemap.xml` / `robots.txt` generation (prefer Next.js's built-in `sitemap.ts`/`robots.ts`
  file conventions over a hand-rolled route when possible)
- health checks
- any endpoint a third party (not the Payload CMS, not this Website's own client code) needs
  to call

---

# What Does Not Belong Here

- A generic proxy that just re-shapes and re-serves Payload's REST API to the Website's own
  client components — fetch directly from Server Components/Server Actions via `lib/cms/`
  instead.
- Business logic — delegate to `lib/`.

---

# Validate and Authenticate

- Validate the request method, body, and any query params before acting on them.
- Verify webhook calls from Payload with a shared secret (header or query param) — never
  trust an unauthenticated POST to trigger revalidation or any state change.

---

# Response Shape

Return typed JSON with explicit status codes. Never leak internal error details (stack
traces, Payload error bodies) in the response — log them server-side instead.

---

# Revalidation Webhook Example Shape

```ts
export async function POST(request: Request) {
  const secret = request.headers.get('x-revalidate-secret')
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { tag } = await request.json()
  revalidateTag(tag)
  return Response.json({ revalidated: true })
}
```
