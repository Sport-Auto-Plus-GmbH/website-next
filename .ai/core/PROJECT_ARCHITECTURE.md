# Project Architecture

This document defines the architectural principles of the Website project.

Every AI-generated implementation MUST respect this architecture.

---

# Architectural Philosophy

The Website is a **decoupled Next.js frontend**. It renders UI and talks to the Payload CMS
over HTTP. It owns no database and no business data — Payload is the single source of truth
for content, and the Website is the single source of truth for presentation.

---

# High-Level Architecture

```
                User
                 │
                 ▼
          React Components
                 │
                 ▼
            Custom Hooks
                 │
        ┌────────┴────────┐
        ▼                 ▼
   Zustand Stores     lib/cms/ (CMS client)
    (client UI state)      │
                            ▼
                  Payload REST API (/api/<collection>)
                            │
                            ▼
                     Payload CMS (separate repo)
```

Data always flows downward. Dependencies always point downward. Lower layers never depend on
higher layers.

---

# Layer Responsibilities

## Components

Render UI: displaying data, rendering layouts, handling user interaction, composing other
components.

Components MUST NOT:

- call `fetch` against Payload directly (route through `lib/cms/`)
- contain CMS response-mapping logic
- contain complex business/derivation logic (extract into `lib/` or a hook)

## Hooks

Encapsulate UI logic: local state, derived state, interaction logic, coordinating Zustand
stores and CMS client calls.

Hooks MUST NOT render UI or embed CMS-response mapping logic that belongs in `lib/cms/`.

## Zustand Stores (`stores/`)

Own **client-only, cross-component UI state**: open/closed panels, filters the user is
actively editing, cart/wishlist-style ephemeral state, theme toggles.

Stores MUST NOT be used to cache server/CMS data. Server data belongs in Next.js's own
fetch caching (`fetch` with `next: { revalidate | tags }`) inside Server Components,
Server Actions, or Route Handlers.

## `lib/cms/` (CMS Client / Service Layer)

The only layer allowed to call Payload's REST API.

Responsible for:

- building requests against `/api/<collection>` (query params, `depth`, `locale`, draft mode)
- mapping raw Payload REST responses into Website-owned view types (`types/cms/`)
- centralizing error handling for CMS failures

→ See `backend/CMS_CLIENT.md`.

## Server Actions (`actions/`)

Execute server-side mutations initiated by the Website itself (e.g. contact/lead forms that
POST to Payload's form-submission endpoint, or a third-party integration). Validate input,
call `lib/cms/` or an external service, return typed results. Keep thin — non-trivial mapping
logic still belongs in `lib/`.

## Route Handlers (`app/api/.../route.ts`)

Expose HTTP endpoints the Website itself needs (e.g. revalidation webhooks called by Payload,
sitemap/robots generation, health checks). Validate requests, authenticate when required,
delegate to `lib/`. Must not contain business logic inline.

---

# Dependency Rules

Allowed:

```
Component → Hook → Zustand Store
Component → Hook → lib/cms/ → Payload REST API
Server Action / Route Handler → lib/cms/ → Payload REST API
```

Forbidden:

```
Component → fetch() directly against Payload
Component → Zustand store used as a server-data cache
Zustand Store → lib/cms/ (stores hold state, they don't fetch)
```

---

# Domain Isolation

Each domain (a product/site topic, e.g. `vehicle`, `blog`, `career`) should stay cohesive
across layers:

- `components/<surface>/<domain>/<feature>/` (`surface` = `ui`, `layout`, `landing`, etc.)
- `types/<domain>/<feature>/`
- `lib/cms/<domain>/`
- `hooks/<domain>/`
- `stores/<domain>/`

There is no top-level `domains/` folder — see `core/FOLDER_STRUCTURE.md`.

---

# State

Keep state as close as possible to where it is needed:

```
Component State → Hook State → Zustand
```

Only promote state upward when necessary. Global client state should remain minimal. Server
data does not belong in global state — re-fetch or rely on Next.js caching/revalidation.

---

# Business Logic

Business/presentation logic (formatting, view-model mapping, derived values) belongs in
`lib/` or hooks — never inline in JSX, never duplicated across components.

---

# Validation

Validate all data at system boundaries:

- data returned from Payload before trusting its shape (Payload can return partially filled
  drafts, deleted relationships, or locale fallbacks)
- user input in forms before submitting to a Server Action or Payload endpoint

→ See `backend/VALIDATION.md`.

---

# Circular Dependencies

Circular dependencies are strictly forbidden. If two modules depend on each other, the
architecture is incorrect — refactor responsibilities.

---

# Simplicity

Do not introduce architecture the project does not need. Prefer simple components, simple
data fetching, simple state. Architecture should reduce complexity, never increase it.

---

# AI Decision Process

Before creating new code ask:

1. Which architectural layer owns this responsibility?
2. Does this responsibility already exist?
3. Can an existing implementation be extended?
4. Is the dependency direction correct (nothing reaches into Payload except `lib/cms/`)?
5. Is the architecture becoming simpler?

If any answer is uncertain: stop, analyze further.

---

# Final Architecture Rule

The architecture exists to make future development easier. Every change should strengthen
the boundary between "the Website" and "the CMS," never blur it.
