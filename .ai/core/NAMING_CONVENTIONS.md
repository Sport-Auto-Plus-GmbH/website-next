# Naming Conventions

Consistent naming is essential for a maintainable codebase. Names should communicate intent
immediately.

---

# Language

All identifiers MUST be written in English: variables, functions, components, types,
folders, files, enums, constants. Never mix languages. (User-facing copy/content itself may
be German — that content lives in Payload, not in identifiers.)

---

# File Names

Use **kebab-case** for all files.

Good: `vehicle-card.tsx`, `fetch-vehicle-listing.ts`, `use-vehicle-filters.ts`,
`vehicle-filter.schema.ts`

Bad: `VehicleCard.tsx`, `vehicleCard.tsx`, `vehicle_card.tsx`

## Review Document Names

Review artifacts under `reviews/` are an exception because they MUST be chronologically
sortable:

```
YYYY-MM-DD_HH-MM-<document-slug>.md
```

The parent folder MUST be the branch name with `/` replaced by `-` (e.g.
`reviews/feat-vehicle-filters/`).

Test files MUST use the same kebab-case base name with a `.test` suffix and live under the
root `test/` folder, mirroring the source path: `vehicle-card.test.tsx`.

---

# Folder Names

Folders MUST use kebab-case: `vehicle-listing`, `blog-post`, `user-profile`.

---

# React Components

Component names MUST use PascalCase and describe what they render.

Good: `VehicleCard`, `BlogPostHero`, `SiteHeader`
Avoid: `Card`, `Item`, `Component`

Component file names MUST match the component name in kebab-case: `VehicleCard` →
`vehicle-card.tsx`.

---

# Hooks

Hooks MUST begin with `use`: `useVehicleFilters()`, `useCurrentTenant()`. Never omit the
prefix.

---

# Zustand Stores

Store files MUST end with `.store.ts`: `vehicle-filter.store.ts`, `ui.store.ts`.

Store hook exports SHOULD read as `useXStore`: `useVehicleFilterStore`.

---

# CMS Client Functions (`lib/cms/`)

Function names MUST describe the fetch and the domain: `fetchVehicleListing()`,
`fetchBlogPostBySlug()`. Never a bare `get()` or `fetchData()`.

---

# Validators

Validation (Zod) files MUST end with `.schema.ts`: `contact-form.schema.ts`.

---

# Types

All type files MUST live under the root `types/` folder as `types/<domain>/<feature>/`.

```
types/cms/vehicle/vehicle-listing.types.ts
types/vehicle/filter/vehicle-filter.types.ts
```

Avoid vague root-level names such as `types.ts`, `interfaces.ts`, `models.ts`.

---

# Utility Files

Utility files MUST clearly describe their purpose.

Good: `lib/shared/format/format-price.ts`, `lib/shared/format/format-date.ts`

Bad: `lib/helpers.ts`, `lib/utils2.ts` — generic names become dumping grounds. (`lib/utils.ts`
is the one allowed infrastructure exception — the shadcn `cn()` helper.)

---

# Variables

Variables MUST describe their content: `currentUser`, `vehicleList`, `selectedFilters`.
Avoid `data`, `value`, `item`, `tmp`.

---

# Boolean Variables

Boolean variables SHOULD answer a question: `isLoading`, `isVisible`, `hasResults`,
`canSubmit`. Avoid `loading`, `visible`, `permission`.

---

# Functions

Functions MUST describe an action: `fetchVehicleListing()`, `formatPrice()`,
`calculateMonthlyRate()`. Avoid `run()`, `process()`, `helper()`.

---

# Event Handlers and Callback Props

Handlers use `handle...`: `handleSubmit()`, `handleClose()`.
Callback props use `on...`: `onSave`, `onClose`. Never `handleSave` inside props.

---

# Constants

Constants MUST use `UPPER_SNAKE_CASE`: `MAX_UPLOAD_SIZE`, `DEFAULT_PAGE_SIZE`.

---

# Interfaces and Type Aliases

Interfaces describe real concepts and avoid the `I` prefix: `VehicleListing`, not
`IVehicleListing`. Use type aliases for unions/primitives: `type Theme = "light" | "dark"`.

---

# Props

Props interfaces end with `Props`: `interface VehicleCardProps { ... }`.

---

# IDs

Identifier names end with `Id`: `vehicleId`, `tenantId`. Never `idVehicle`.

---

# Environment Variables

Environment variables MUST use `UPPER_SNAKE_CASE`. Client-exposed variables MUST use the
Next.js `NEXT_PUBLIC_` prefix: `NEXT_PUBLIC_SITE_URL`, `PAYLOAD_API_URL`.

---

# Abbreviations

Avoid abbreviations unless universally understood (`API`, `URL`, `HTTP`, `SEO`, `CMS`, `UUID`).
Avoid `cfg`, `usr`, `tmp`, `btn`.

---

# Naming Checklist

Before introducing a new name ask:

- Does it describe intent?
- Is it written in English?
- Does it match nearby code and existing project naming?
- Would a new developer understand it immediately?

If any answer is "No", choose a better name.
