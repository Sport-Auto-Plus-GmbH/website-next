# Components

Rules for structuring components in this project.

---

# Folder Placement

```
components/ui/              shadcn/ui primitives (generated, do not hand-roll duplicates)
components/layout/          header, footer, nav, site chrome
components/landing/<feature>/  landing-page-only sections
components/<domain>/<feature>/ domain UI (vehicle, blog, career, faq, ...)
```

A component belongs to a domain folder as soon as a second file (a subcomponent, a
domain-specific hook) is needed alongside it. A single, self-contained component may start
as one file directly under its domain folder.

---

# One Component, One Job

A component either renders a **layout/structure**, a **domain view**, or a **UI primitive** —
never a mix. Domain data mapping/formatting belongs in `lib/`, not inline in the component.

---

# Server vs Client Components

Keep the client boundary as small as possible: wrap only the interactive leaf (a filter
dropdown, a slider, a form) in `"use client"`, and keep the surrounding layout as a Server
Component. See `frontend/NEXTJS.md`.

---

# Composing shadcn/ui Primitives

Build domain components by composing `components/ui/*` primitives — do not duplicate a
primitive's internal styling by hand. If a primitive needs project-wide visual changes,
change it once in `components/ui/`, not per usage. See `frontend/SHADCN.md`.

---

# Props Over Configuration Objects

Prefer explicit, individually named props over a single loosely-typed `config` object,
unless the component genuinely has many optional, independent settings (e.g. a generic
data-table).

---

# Presentational vs Container Split

For non-trivial domain features, prefer:

- a "container" (Server Component or a thin client wrapper) that owns data/state and
  delegates to hooks/`lib/cms/`
- one or more "presentational" components that only receive props and render UI

Do not force this split for simple, self-contained components — do not over-engineer.

---

# Accessibility Is Not Optional

Every interactive component MUST be usable via keyboard and screen reader. See
`frontend/ACCESSIBILITY.md` before shipping a new interactive component.

---

# Loading and Empty States

Every component rendering a list or async data MUST define what it renders when the list is
empty and, where relevant to its own boundary, what a loading skeleton looks like — do not
leave a bare `undefined`/blank render.
