# Project Architecture

This document defines the architectural principles of the Website project.

Every AI-generated implementation MUST respect this architecture.

---

# Architectural Philosophy

The Website is a **decoupled Next.js frontend**. It renders UI and talks to upstream services
over HTTP — the Payload CMS, and the Datendrehscheibe data hub. It owns no database and no
business data of its own, and it MUST NEVER hold direct database credentials for any
database, anywhere. Every upstream system is reached exclusively through its HTTP API, and
exclusively through one dedicated client layer per system — never a raw `fetch` scattered
through components, and never a database connection string of any kind in this repository.

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
        ┌────────┴────────┬──────────────────────┐
        ▼                 ▼                      ▼
   Zustand Stores     lib/cms/            lib/datendrehscheibe/
    (client UI state)  (CMS client)          (data hub client)
                            │                      │
                            ▼                      ▼
                  Payload REST API        Datendrehscheibe HTTP API
                            │                      │
                            ▼                      ▼
                     Payload CMS            Datendrehscheibe
                    (separate repo)          (separate system)
```

Data always flows downward. Dependencies always point downward. Lower layers never depend on
higher layers. Both upstream systems are reached the same way: one dedicated client layer,
never a direct call from anywhere else, and never a database connection at all.

---

# Layer Responsibilities

## Components

Render UI: displaying data, rendering layouts, handling user interaction, composing other
components.

Components MUST NOT:

- call `fetch` against Payload or the Datendrehscheibe directly (route through `lib/cms/` or
  `lib/datendrehscheibe/`)
- contain response-mapping logic for either upstream system
- contain complex business/derivation logic (extract into `lib/` or a hook)

## Hooks

Encapsulate UI logic: local state, derived state, interaction logic, coordinating Zustand
stores and the upstream client layers.

Hooks MUST NOT render UI or embed response-mapping logic that belongs in `lib/cms/` /
`lib/datendrehscheibe/`.

## Zustand Stores (`stores/`)

Own **client-only, cross-component UI state**: open/closed panels, filters the user is
actively editing, cart/wishlist-style ephemeral state, theme toggles.

Stores MUST NOT be used to cache server data from either upstream system. Server data
belongs in Next.js's own fetch caching (`fetch` with `next: { revalidate | tags }`) inside
Server Components, Server Actions, or Route Handlers.

## `lib/cms/` (CMS Client / Service Layer)

The only layer allowed to call Payload's REST API.

Responsible for:

- building requests against `/api/<collection>` (query params, `depth`, `locale`, draft mode)
- mapping raw Payload REST responses into Website-owned view types (`types/cms/`)
- centralizing error handling for CMS failures

→ See `backend/CMS_CLIENT.md`.

## `lib/datendrehscheibe/` (Data Hub Client / Service Layer)

The only layer allowed to call the Datendrehscheibe's HTTP API (e.g. live vehicle
inventory/pricing data).

Responsible for:

- building requests against the Datendrehscheibe's API, including authentication
- mapping raw Datendrehscheibe responses into Website-owned view types
  (`types/datendrehscheibe/`)
- centralizing error handling for data hub failures

→ See `backend/DATENDREHSCHEIBE_CLIENT.md`.

## Server Actions (`actions/`)

Execute server-side mutations initiated by the Website itself (e.g. contact/lead forms that
POST to Payload's form-submission endpoint, or a third-party integration). Validate input,
call `lib/cms/`, `lib/datendrehscheibe/`, or another service, return typed results. Keep
thin — non-trivial mapping logic still belongs in `lib/`.

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
Component → Hook → lib/datendrehscheibe/ → Datendrehscheibe HTTP API
Server Action / Route Handler → lib/cms/ → Payload REST API
Server Action / Route Handler → lib/datendrehscheibe/ → Datendrehscheibe HTTP API
```

Forbidden:

```
Component → fetch() directly against Payload or the Datendrehscheibe
Component → Zustand store used as a server-data cache
Zustand Store → lib/cms/ or lib/datendrehscheibe/ (stores hold state, they don't fetch)
Anything in this repo → a direct database connection, to any database, for any reason
```

---

# Domain Isolation

Each domain (a product/site topic, e.g. `vehicle`, `blog`, `career`) should stay cohesive
across layers:

- `components/<surface>/<domain>/<feature>/` (`surface` = `ui`, `layout`, `landing`, etc.)
- `types/<domain>/<feature>/`
- `lib/cms/<domain>/` and/or `lib/datendrehscheibe/<domain>/`
- `hooks/<domain>/`
- `stores/<domain>/`

A domain that sources data from both systems (e.g. `vehicle`, if listings come from the
Datendrehscheibe but SEO/marketing content about them comes from Payload) has both a
`lib/cms/vehicle/` and a `lib/datendrehscheibe/vehicle/` — each still only talks to its own
upstream system, and a hook or Server Component composes the two.

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

- data returned from Payload or the Datendrehscheibe before trusting its shape (either can
  return partially filled, stale, or unexpectedly-shaped data)
- user input in forms before submitting to a Server Action or an upstream endpoint

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
4. Is the dependency direction correct (nothing reaches into Payload except `lib/cms/`;
   nothing reaches into the Datendrehscheibe except `lib/datendrehscheibe/`; nothing anywhere
   holds a database connection)?
5. Is the architecture becoming simpler?

If any answer is uncertain: stop, analyze further.

---

# Final Architecture Rule

The architecture exists to make future development easier, and to keep this repository free
of any direct database access. Every change should strengthen the boundary between "the
Website" and every upstream system it depends on, never blur it.
