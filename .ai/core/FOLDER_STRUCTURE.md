# Folder Structure Guide

This document establishes organizational principles for a predictable project layout. The
structure answers: *Where does this code belong?*, *Who owns this code?*, *What is its
responsibility?*

---

# Core Organization: Layer → Domain → Feature

The project is organized by **layer first** (what kind of code), then **domain** (which
topic), then **feature** (which slice):

```
<layer>/<domain>/<feature>/
```

This applies across `components/`, `types/`, `lib/`, `hooks/`, `stores/`, `actions/`.

---

# Top-Level Layout

```
app/                     Next.js App Router routes, layouts, route handlers
components/
  ui/                    shadcn/ui primitives (generated, treated as infrastructure)
  layout/                header, footer, navigation, site chrome
  landing/<feature>/     landing-page-only sections
  <domain>/<feature>/    domain UI (e.g. vehicle, blog, career)
hooks/
  <domain>/
lib/
  cms/
    <domain>/            Payload REST client + response mapping, one domain per folder
  datendrehscheibe/
    <domain>/            Datendrehscheibe HTTP client + response mapping, one domain per folder
  shared/
    format/               generic formatters (date, currency, stat values)
  utils.ts                shadcn cn() helper — infrastructure exception
stores/
  <domain>.store.ts
actions/
  <domain>/<feature>/
types/
  cms/<domain>/          Website-owned view types derived from Payload responses
  datendrehscheibe/<domain>/  Website-owned view types derived from Datendrehscheibe responses
  <domain>/<feature>/    other domain types
test/                    mirrors the application structure, never colocated
reviews/<branch-folder>/ written branch reviews (see quality/CODE_REVIEW.md)
```

---

# Components

Components use product UI surfaces as domains where there is no content domain yet (`ui/`,
`layout/`), and content/product domains where one exists (`vehicle`, `blog`, `career`).

```
components/ui/button.tsx
components/layout/site-header.tsx
components/landing/world-stats/world-stats-panel.tsx
components/vehicle/listing/vehicle-listing-grid.tsx
components/blog/post/blog-post-hero.tsx
```

The AI MUST place exactly one React component per component file.

---

# Types

All custom type files MUST live under the root `types/` folder as `types/<domain>/<feature>/`.
Upstream-derived view types live under `types/cms/<domain>/` (Payload) or
`types/datendrehscheibe/<domain>/` (Datendrehscheibe) and MUST be Website-owned (only the
fields the Website actually renders), never a copy-paste of the upstream system's own types.

```
types/cms/vehicle/vehicle-listing.types.ts
types/cms/blog/blog-post.types.ts
types/datendrehscheibe/vehicle/vehicle-inventory.types.ts
types/vehicle/filter/vehicle-filter.types.ts
```

---

# lib/cms/ and lib/datendrehscheibe/

`lib/cms/` is the only place allowed to know Payload's REST shape (endpoints, query params,
draft mode). `lib/datendrehscheibe/` is the only place allowed to know the Datendrehscheibe's
HTTP API shape. Neither ever holds a database connection — both only ever speak HTTP. Each is
organized by domain, mirroring the domains used elsewhere.

```
lib/cms/vehicle/fetch-vehicle-listing.ts
lib/cms/blog/fetch-blog-post.ts
lib/datendrehscheibe/vehicle/fetch-vehicle-inventory.ts
```

---

# Tests

Tests MUST mirror the application structure under a dedicated root `test/` folder, never
colocated with source files.

```
test/components/vehicle/listing/vehicle-listing-grid.test.tsx
test/lib/cms/vehicle/fetch-vehicle-listing.test.ts
test/lib/datendrehscheibe/vehicle/fetch-vehicle-inventory.test.ts
```

---

# Allowed Exceptions

- `components/ui/` — shadcn/ui primitives, generated via the shadcn CLI
- `lib/utils.ts` — shadcn's `cn()` helper
- `app/` — Next.js routing structure follows Next.js conventions, not the domain pattern
- Generated code (`.next/`, shadcn output before customization)

---

# File Organization Principles

- Use singular domain names (`vehicle`, not `vehicles`)
- Use kebab-case for all folder and file names (see `core/NAMING_CONVENTIONS.md`)
- Create a folder only when multiple related files justify it
- Avoid deeply nested structures
- Share code only when genuinely reusable across multiple domains

A developer should be able to locate any file in under 10 seconds.
