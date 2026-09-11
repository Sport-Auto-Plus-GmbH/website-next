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

A CMS domain built from Payload content blocks (a `Page`'s `layout` field, or similar) MUST
split each block into its own file rather than growing one file that defines every block:

```
types/cms/page/page.types.ts              Page + the PageBlock union only — no block fields
types/cms/page/raw-block.types.ts         RawBlock: the minimal { id, blockType } shape
types/cms/page/blocks/hero-teaser.types.ts  one block's shape, one file
lib/cms/page/blocks/hero-teaser.ts        that block's raw shape + its map*Block() function
lib/cms/page/blocks/index.ts              the blockMappers registry (see below)
lib/cms/page/fetch-page-by-slug.ts        fetches, then looks a mapper up in blockMappers
```

**Dispatch by registry, never by a growing `switch`.** A `switch (block.blockType) { case ... }`
in the fetch/orchestration file is exactly the kind of file every new block would have to
edit — the same problem this whole section exists to prevent, just moved from "one big types
file" to "one big switch." Instead:

- `fetch-page-by-slug.ts` (or the equivalent for another block-based domain) only knows the
  minimal `RawBlock` shape and does `blockMappers[block.blockType]?.(block) ?? null` — it MUST
  NOT import any individual block's own type or mapper, and MUST NOT change when a block is
  added or removed. Its own tests only need to cover the lookup/skip-unknown-blockType
  behavior, not grow a case per block either.
- `lib/cms/page/blocks/index.ts` is the **only** file that changes when a block is added: one
  import plus one `blockMappers` entry. Each block's own `map*Block()` function keeps its own
  strict, block-specific parameter type (e.g. `PayloadHeroTeaserBlock`) — never loosen it to
  `RawBlock` just to fit the registry. Bridge the two with a small generic helper local to the
  registry file (`asMapper<T extends RawBlock>(map: (raw: T) => PageBlock): BlockMapper`) that
  casts once, at registration, rather than threading a cast through every block file or back
  into the orchestration file.

A *rendering* dispatch (which component renders each block, e.g. `page-renderer.tsx`) is a
separate concern from this data-mapping one — either a small `switch` or a
`Record<string, Component>` lookup (see `examples/PROJECT_EXAMPLES.md`'s "Rendering a Payload
Page Built From Blocks") is fine there, since it's a short, component-per-block list either
way. The registry rule above is specifically about the fetch/mapping dispatch, which is where
unbounded per-block growth actually tends to happen.

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
