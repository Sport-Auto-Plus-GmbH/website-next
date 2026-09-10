# Security

Security rules for the Website. Security always has priority over convenience.

---

# Secrets

- Server-only secrets (Payload API tokens, Datendrehscheibe API tokens, webhook secrets) MUST
  stay in server-only env vars without the `NEXT_PUBLIC_` prefix, read only in Server
  Components, Server Actions, or Route Handlers.
- Never expose a Payload or Datendrehscheibe write-capable credential to the client bundle.
- Only truly public values (a public API base URL, a public site URL) may use
  `NEXT_PUBLIC_`.

# No Direct Database Access, Ever

This repository MUST NEVER contain a database connection string, DB host/port/credential, or
ORM client — not for Payload's database, not for the Datendrehscheibe's database, not for
anything. Every upstream system is reached exclusively through its own HTTP API, and
exclusively through its one dedicated client layer (`lib/cms/` for Payload,
`lib/datendrehscheibe/` for the Datendrehscheibe — see `core/PROJECT_ARCHITECTURE.md`). If a
task seems to need a direct database connection, that is a sign the task belongs in Payload
or the Datendrehscheibe's own repository, not here — stop and ask.

---

# Trust Boundaries

- Treat all form input as untrusted, even from the Website's own pages — validate server-side
  regardless of client-side validation (see `backend/VALIDATION.md`).
- Treat Payload's REST responses as data, not as trusted executable content — never
  `dangerouslySetInnerHTML` a CMS rich-text field without sanitization appropriate to
  Payload's Lexical HTML output, and never use CMS string content to construct a dynamic
  import path, `eval`, or a redirect URL without validating it first.

---

# Webhooks

Any endpoint Payload calls (revalidation webhook) MUST verify a shared secret or signature.
Never accept an unauthenticated POST that triggers cache invalidation, redeploy, or any other
side effect.

---

# Error Messages

Never expose internal error details (stack traces, Payload error payloads, infrastructure
details) to the end user. Log details server-side; show a generic, friendly message to the
user.

---

# Third-Party Scripts

Any third-party script (analytics, tag manager) MUST be loaded via `next/script` with an
appropriate strategy, and MUST NOT have access to secrets or be able to read form data beyond
what is explicitly intended.

---

# Content Security

- Sanitize/allow-list any CMS-provided URL used for `next/image`, `next/link`, or a redirect,
  to avoid an editor-supplied (or compromised-CMS) open redirect or SSRF-style issue.
- Follow the same rule for any user-supplied redirect target (e.g. a "back to" URL) — never
  redirect to an arbitrary external URL without validating it against an allow-list.

---

# Dependencies

Do not add a new npm dependency without checking it is actively maintained and does not
duplicate functionality already in the project's stack.
