# Server Actions

Rules for Next.js Server Actions in this project.

---

# Purpose

Server Actions handle mutations initiated by the Website itself: form submissions (contact,
lead, newsletter) that forward to Payload's form-builder submission endpoint or another
external service, and any other server-side action a client component triggers.

---

# Keep Them Thin

A Server Action MUST:

1. validate input with a Zod schema from `lib/validation/` or colocated `*.schema.ts` (see
   `backend/VALIDATION.md`)
2. call `lib/cms/` (or another `lib/` service) to perform the actual work
3. return a small, typed result (`{ success: true }` / `{ success: false, error: string }`)

Business/mapping logic does not belong inline in the action — extract it into `lib/` so it is
testable independently of the Server Action wrapper.

---

# Location

```
actions/<domain>/<feature>/submit-contact-form.action.ts
```

---

# Error Handling

- Never throw a raw error across the Server Action boundary to the client; catch it, log
  server-side, and return a typed error result the UI can render.
- Distinguish validation errors (show field-level feedback) from infrastructure errors (show
  a generic "please try again" message).

---

# Security

- Treat all input as untrusted, even though it originates from the Website's own forms —
  validate again on the server; do not rely solely on client-side validation.
- Never forward a client-provided value as an authentication credential to Payload; use
  server-held secrets/env vars for any Payload write access.

→ See `backend/SECURITY.md`.

---

# Revalidation

If a Server Action changes something the Website caches (rare, since Payload owns the data),
call `revalidatePath`/`revalidateTag` explicitly rather than expecting the user to reload.
