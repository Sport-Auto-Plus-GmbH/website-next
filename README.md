# Website Frontend

**Repository:** `website-next`

This is the **public website** for Sport Auto Plus, built with [Next.js](https://nextjs.org/).
It has no CMS or database of its own — all content and structured data (vehicles, blog posts,
FAQs, ...) is fetched from a separate headless CMS project,
[`payload-next`](https://github.com/Sport-Auto-Plus-GmbH/payload-next), over its REST API.

If you're going to write code in this repository (including AI assistants), read
[`.ai/README.md`](.ai/README.md) first — it defines the engineering rules and conventions
this project follows.

## Tech Stack

| Purpose             | Technology                                                       | Version |
| ------------------- | ---------------------------------------------------------------- | ------- |
| Framework           | [Next.js](https://nextjs.org/) (App Router, `src/` layout)       | 16.3.4  |
| UI library          | [React](https://react.dev/)                                      | 19.2.8  |
| Language            | [TypeScript](https://www.typescriptlang.org/)                    | 5.x     |
| Styling             | [Tailwind CSS](https://tailwindcss.com/)                         | 4.x     |
| UI components       | [shadcn/ui](https://ui.shadcn.com/) (Radix primitives)           | —       |
| Icons               | FontAwesome Pro+ (licensed)                                      | 7.x     |
| Client state        | [Zustand](https://zustand.docs.pmnd.rs/)                         | 5.0.15  |
| Schema validation   | [Zod](https://zod.dev/)                                          | 4.x     |
| Git hooks           | [Husky](https://typicode.github.io/husky/) + lint-staged         | 9.x     |
| Formatting          | [Prettier](https://prettier.io/)                                 | 3.x     |
| Linting             | [ESLint](https://eslint.org/) (`eslint-config-next`)             | 9.x     |
| Testing             | [Vitest](https://vitest.dev/) + React Testing Library            | 5.x     |
| Package manager     | [pnpm](https://pnpm.io/)                                         | 10.x    |
| CMS (separate repo) | [Payload](https://payloadcms.com/) via `payload-next`'s REST API | —       |

Required Node.js version: developed and tested on Node 24. Required pnpm version: `10.x`.

### FontAwesome Pro+

The project has a valid FontAwesome Pro+ license, and the Pro icon packages are already
installed (`pro-regular`, `pro-solid`, `pro-duotone`). Fetching them requires a private npm
registry token:

```bash
cp .npmrc.example .npmrc
```

Then fill in your own token (ask whoever manages the license) in place of
`YOUR_FONTAWESOME_TOKEN_HERE`. `.npmrc` is gitignored — never commit it. Without a valid
token, `pnpm install` will fail to fetch the `@fortawesome/pro-*` packages. See
[`.ai/frontend/ICONS.md`](.ai/frontend/ICONS.md) for usage rules.

## What You Need Before You Start

- **Node.js** (developed on Node 24). Check yours with `node -v`.
- **pnpm** — install it once with `corepack enable` (ships with Node), or see
  [pnpm's install docs](https://pnpm.io/installation).
- **The `payload-next` CMS running locally** (see its own README) — this website has nothing
  to show without it. By default it's expected at `http://localhost:3000`.

## Setting Up the Project (Step by Step)

All commands below are run from inside this folder (`website-next/`).

1. **Copy the environment file:**

   ```bash
   cp .env.example .env
   ```

   The default `PAYLOAD_API_URL` already points at `payload-next` running locally on its
   default port. Change it only if you're running the CMS somewhere else.

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Make sure `payload-next` is running** (in its own terminal / folder — see its README).

4. **Start the dev server:**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3001](http://localhost:3001) — note the port: **3001**, not 3000,
   so it doesn't clash with `payload-next` running on 3000 at the same time.

   You should see a page confirming it successfully fetched data from the CMS (a media item
   count). If it errors instead, double-check `payload-next` is actually running and
   reachable at the URL in your `.env`.

## Everyday Commands

| Command                                | What it does                                                     |
| -------------------------------------- | ---------------------------------------------------------------- |
| `pnpm dev`                             | Start the local dev server (port 3001)                           |
| `pnpm build` / `pnpm start`            | Build for production / run that production build                 |
| `pnpm lint`                            | Check the code for style/quality problems                        |
| `pnpm format`                          | Auto-format the code                                             |
| `pnpm format:check`                    | Check formatting without changing files                          |
| `pnpm test`                            | Run the test suite once                                          |
| `pnpm test:watch`                      | Run tests in watch mode                                          |
| `pnpm test:coverage`                   | Run the test suite with coverage; fails under 80%                |
| `pnpm generate:datendrehscheibe-types` | Regenerate types from the vendored Datendrehscheibe OpenAPI spec |

A pre-commit hook (via Husky + lint-staged) automatically lints and formats the files you're
committing.

## How the Project Is Organized

Everything application-specific lives under `src/`:

- **`src/app/`** — Next.js App Router pages, layouts, route handlers.
- **`src/components/ui/`** — shadcn/ui primitives (generated, treated as infrastructure).
- **`src/components/landing/`** — homepage-only sections rendered from a Payload content
  block (e.g. `hero-teaser/`, rendering the `heroTeaser` block — see "Pages & Content
  Blocks" below).
- **`src/lib/cms/`** — the _only_ place allowed to call `payload-next`'s REST API. See
  `src/lib/cms/media/fetch-media-list.ts` for the pattern to follow.
- **`src/lib/datendrehscheibe/`** — the _only_ place allowed to call the Datendrehscheibe's
  HTTP API, via a typed client generated from its own OpenAPI spec (see
  `openapi/datendrehscheibe/` and the "Datendrehscheibe API Types" section below).
- **`src/types/cms/`** / **`src/types/datendrehscheibe/`** — Website-owned view types
  describing what we actually consume from each upstream system (never a copy of its
  internal types).
- **`.ai/`** — the engineering playbook. Read it before making non-trivial changes,
  especially [`.ai/backend/CMS_CLIENT.md`](.ai/backend/CMS_CLIENT.md) and
  [`.ai/backend/DATENDREHSCHEIBE_CLIENT.md`](.ai/backend/DATENDREHSCHEIBE_CLIENT.md) before
  touching anything that talks to an upstream system.

Tests live under the root `test/` folder, mirroring the `src/` structure (never colocated
with source files) — see `test/lib/cms/media/fetch-media-list.test.ts` for an example.

## Corporate Design

The site's brand colors and logo come from `payload-next`'s `corporate-identity` global, not
from hardcoded values:

- **`src/lib/cms/corporate-identity/fetch-corporate-identity.ts`** fetches the global and maps
  it into a `CorporateIdentity` view type (`src/types/cms/corporate-identity/`). It sanitizes
  the color fields (must be a valid `#rrggbb` hex) and resolves the logo to an absolute URL,
  falling back to the static `public/cd/logo/sport-auto-plus-logo.svg` if the CMS has no logo
  set or is unreachable.
- **`src/app/layout.tsx`** calls it and sets `--primary` / `--secondary` / `--destructive` as
  inline CSS custom properties on `<html>`, overriding the CD-default values already in
  `globals.css` — so changing a color in the Payload admin panel takes effect on the next
  request, no redeploy needed.
- **Fonts**: Bebas Neue (`--font-heading`, used by e.g. `CardTitle`) and Roboto (`--font-sans`,
  body text) are loaded via `next/font/google` in `layout.tsx`, per the CD document.
- **No dark mode.** `globals.css` keeps the `dark:` Tailwind variant scoped to a `.dark` class
  that's never applied anywhere, so shadcn's built-in `dark:` utility classes stay inert
  regardless of the visitor's OS color-scheme setting — deliberately light-only for now.

## Pages & Content Blocks

The homepage (`src/app/page.tsx`) isn't hardcoded — it renders whatever content blocks
editors added to the Payload page with slug **`home`** (`payload-next`'s `Pages` collection).
Renaming or deleting that page changes what `/` shows; there's no separate "is this the
homepage" flag yet.

Each block gets its own file at every layer, one per `blockType` — never one growing file
covering every block, since that only gets worse as more blocks are added:

- **`src/types/cms/page/blocks/<block>.types.ts`** — the block's Website-owned shape (e.g.
  `hero-teaser.types.ts`'s `HeroTeaserBlock`). `page.types.ts` itself only holds `Page` and
  the `PageBlock` union of every block type — it doesn't define any block's fields directly.
- **`src/lib/cms/page/blocks/<block>.ts`** — that block's raw Payload response shape and its
  `map<Block>Block()` function.
- **`src/components/landing/<block>/`** — one rendering component per block type. Currently:
  `hero-teaser/` for `heroTeaser` (headline/subheadline/description, each with
  editor-controlled text, font size, and color) and `vehicle-listing/` for `vehicleListing`
  (see "Vehicle Listing & Detail" below).

`fetch-page-by-slug.ts` itself never grows as blocks are added — it only knows the minimal
`RawBlock` shape (`id`/`blockType`, `types/cms/page/raw-block.types.ts`) and looks a mapper up
by `blockType` in **`src/lib/cms/page/blocks/index.ts`**'s `blockMappers` registry, skipping a
`blockType` with no entry (a block payload-next added that this Website doesn't render yet)
rather than crashing the page. `page-renderer.tsx` still needs one `case` per block in its
render switch (it's a short, human-scannable list of JSX, not worth a registry of its own the
same way).

Adding a second block type: a new file in each of the three `types`/`lib`/`components`
locations above, one entry in `blocks/index.ts`'s `blockMappers`, and a `case` in
`page-renderer.tsx`'s render switch — matching whatever block payload-next added under its
own `src/blocks/content/`.

### Live Preview

`page.tsx` fetches the raw (unmapped) page via `fetchRawPageBySlug` and hands it to
**`src/components/landing/page-renderer/page-renderer.tsx`**, a Client Component wrapping
`@payloadcms/live-preview-react`'s `useLivePreview`. Inside payload-next's admin Live Preview
iframe, this subscribes to the admin's `postMessage` protocol and re-renders with the
in-editor (unsaved) form state on every keystroke — mapped through the same `mapPage` function
`fetchPageBySlug` uses server-side, so there's exactly one mapping implementation either way.
Outside that iframe (a normal site visitor), no message ever arrives and `data` just stays the
server-fetched page — `useLivePreview`'s `isLoading` is intentionally never used to gate
rendering, since it never resolves for a plain visitor. `RefreshRouteOnSave` (same component)
triggers `router.refresh()` on an actual Save/Publish, so this tab picks up the change without
a manual reload.

Requires `NEXT_PUBLIC_PAYLOAD_API_URL` (same value as `PAYLOAD_API_URL`, but public —
`useLivePreview` runs client-side and needs the CMS's origin to verify the `postMessage` it
receives) and payload-next's `cors`/`csrf`/`serverURL` config (see its own README) — without
those, the browser blocks `useLivePreview`'s cross-origin request to populate relationship
data as a CORS error.

### Getting Fresh Content Without Waiting Out the Cache

`fetch-page-by-slug.ts` caches each page for up to an hour (`next: { revalidate: 3600, tags:
['page:<slug>'] }`) — normally that means an editor's save wouldn't show up here for up to an
hour. **`src/app/api/revalidate/route.ts`** is what closes that gap: payload-next's `Pages`
collection calls it (with a shared secret, `REVALIDATE_SECRET`) right after a save, which
revalidates that specific `page:<slug>` tag immediately. See `.ai/backend/ROUTE_HANDLERS.md`
and payload-next's own README for the other side of this.

## Redirects

Editor-managed redirects (payload-next's `redirects` collection, from its `@payloadcms/
plugin-redirects`) are applied by **`src/proxy.ts`** — Next.js 16 renamed `middleware.ts` to
`proxy.ts` (same mechanism, see `node_modules/next/dist/docs/.../proxy.md`), which now
defaults to the Node.js runtime, so it can use the same `fetch` + Data Cache as everything
else in `lib/cms/`.

- **`src/lib/cms/redirects/fetch-redirects.ts`** fetches every redirect (`?limit=0&depth=1` —
  no pagination, and `depth=1` so an internal-page target's `slug` is populated) and maps it
  to a plain `{ from, to }`. Cached for up to an hour, tag `redirects` — payload-next's
  `revalidateRedirectsAfterChange`/`AfterDelete` hooks hit `/api/revalidate` with that same
  tag, so a saved redirect takes effect immediately, same mechanism as Pages.
- **`src/lib/cms/redirects/resolve-redirect.ts`** does the actual path matching
  (case-insensitive, trailing-slash-insensitive) and a self-redirect-loop check — e.g. an
  absolute custom URL that happens to point at the same path it's attached to would otherwise
  redirect forever.
- `proxy.ts` itself stays thin: fetch the list, resolve a target, redirect (301) or let the
  request through. A lookup failure (CMS down, network error) is logged and swallowed —
  **it must never block rendering** — ported from the old Angular server's same "fail open"
  behavior (`Website-4.0/website/src/server.ts`).
- The `matcher` excludes `api`, `_next/static`, `_next/image`, and a few metadata files so
  Proxy doesn't run (and doesn't fetch redirects) for every asset request.

## Vehicle Listing & Detail

A demo feature showing live Datendrehscheibe vehicle data through a Payload-configured block,
plus a dedicated (non-Payload) detail route:

- **`vehicleListing` block** (payload-next) only holds editorial config — heading, subheading,
  `maxItems`. **`src/lib/cms/page/blocks/vehicle-listing.ts`** maps it the same way every other
  block does.
- **`src/app/page.tsx`** fetches the raw page, and only if it actually contains a
  `vehicleListing` block, also calls **`fetchVehicleListing()`** (`lib/datendrehscheibe/
vehicle/`) — Payload and the Datendrehscheibe are independent APIs, fetched separately and
  combined here (see `.ai/backend/DATENDREHSCHEIBE_CLIENT.md`'s "Combining With Payload
  Data"). The fetched list is passed down to `PageRenderer` as a plain prop.
- **`src/components/landing/vehicle-listing/vehicle-listing.tsx`** is a presentational,
  Live-Preview-safe component: it does `vehicles.slice(0, maxItems)` itself rather than
  re-fetching, so an editor changing `maxItems` in Payload updates the visible count
  immediately in the preview iframe, same as any text field — no new fetch needed since the
  Server Component already fetched a full list.
- **Filtering** (brand/fuel type/gearbox/max price) is entirely client-side, via
  **`stores/vehicle-filter.store.ts`** (Zustand — see `.ai/state/ZUSTAND.md`), read through
  **`hooks/vehicle/use-vehicle-filters.ts`** and applied by the pure
  **`lib/vehicle/filter-vehicles.ts`**, with the actual UI in
  **`components/vehicle/vehicle-filter-bar/`** (its dropdown options are derived from
  whatever's in the already-fetched vehicle list, not a fixed set). This project's usual
  vehicle-filter flow additionally syncs filters to the URL and re-fetches server-side (see
  `.ai/examples/PROJECT_EXAMPLES.md`'s "Vehicle Listing Filter Flow") — skipped here
  deliberately: the Datendrehscheibe's listing endpoint takes no query params at all (the
  full list is always fetched regardless), so there's nothing a server round-trip would buy
  over filtering the already-in-memory list directly.
- Each card links to **`src/app/fahrzeuge/[vehicleViewId]/page.tsx`** — a plain Next.js route,
  _not_ a Payload page (a vehicle has no editorial content, only live inventory data), backed
  by the new **`fetchVehicleDetail()`** (`GET /api/vehicle/v1.0/vehicles/{vehicleViewId}`,
  already in the vendored OpenAPI spec). Returns `notFound()` for an invalid id or a vehicle
  no longer in stock (a 404 is a legitimate result, not an error — see
  `.ai/backend/DATENDREHSCHEIBE_CLIENT.md`'s "Error Handling").
- `FontSize`/`StyledText` (and their Payload-side mapper `mapStyledText`/`mapFontSize`) moved
  from `hero-teaser.types.ts`/`hero-teaser.ts` into `types/cms/page/blocks/styled-text.types.ts`
  / `lib/cms/page/blocks/styled-text.ts` once `vehicleListing`'s heading/subheading needed the
  exact same shape — reuse that shared module for any future block needing "editable text with
  size + color" rather than redefining it. Each block still defines its **own**
  `FONT_SIZE_CLASSES` Tailwind mapping in its own component, though — the same `FontSize`
  enum intentionally maps to different pixel sizes for a full-page hero vs. a section heading.
- Vehicle photos come from the Datendrehscheibe's own CDN (HubSpot, signed URLs) but are
  never loaded from there directly — **`src/app/api/vehicles/[vehicleViewId]/image/route.ts`**
  fetches the actual upstream URL server-side and streams the bytes back, so the browser only
  ever sees this Website's own origin (`/api/vehicles/10/image`, `?index=1` for a gallery
  photo). **`src/lib/vehicle/vehicle-photo-url.ts`** builds that same-origin URL; components
  never touch `vehicle.mainImage`/`vehicle.images` directly as an `<Image src>`. Because the
  `src` next/image sees is always a relative, same-origin path, `next.config.ts` needs no
  HubSpot entry in `images.remotePatterns` at all — only the local Payload media pattern
  remains.
  - **`src/lib/vehicle/vehicle-photo-loader.ts`** is a custom next/image `loader` for these
    photos: instead of the default `/_next/image?url=<encoded>&w=...&q=...` wrapper, it
    appends `?w=`/`?q=` straight onto the proxy route's own URL (`/api/vehicles/10/image?w=
640&q=75`) — shorter, and next/image's own `/_next/image` optimizer never runs for these
    URLs at all. The proxy route does the actual resize itself (`sharp`, converting to WebP),
    clamping `w`/`q` to sane bounds since they're client-supplied.
  - A `loader` prop only works from a Client Component (next/image's own requirement), so
    **`src/components/vehicle/vehicle-photo/vehicle-photo.tsx`** is a small `'use client'`
    wrapper around `<Image loader={vehiclePhotoLoader} .../>` — this keeps the listing block
    and the detail page themselves Server Components (see `NEXTJS.md`'s "Server Components by
    Default"); only this one leaf component needs to be a Client Component.
  - The proxy route's own `Cache-Control` matches `fetchVehicleDetail`'s 300s revalidate
    window.
  - The old Angular project never optimized, proxied, or hid these images at all (plain
    `<img>` straight to the CDN, no allowlist anywhere in that codebase) — there's no
    precedent to preserve here.
- Without Datendrehscheibe running, a page with a `vehicleListing` block throws (matches this
  project's existing, documented behavior for any infrastructure failure — see
  `.ai/quality/ERROR_HANDLING.md` — not something new introduced by this feature).

## Datendrehscheibe API Types

The Datendrehscheibe publishes real OpenAPI specs. Rather than hand-writing types for its
responses, this project vendors the spec file(s) it actually uses and generates TypeScript
types from them:

```
openapi/datendrehscheibe/api-vehicles-v1.0.yaml   vendored copy (+ its common/ refs)
src/lib/datendrehscheibe/generated/vehicles.d.ts  generated — never hand-edit
```

### When the Datendrehscheibe's API changes

Requires the Datendrehscheibe repo checked out as a **sibling folder** — next to this repo,
under the same parent folder, not nested inside it:

```
<some-parent-folder>/
├── website-next/         ← this repo
└── Datendrehscheibe/     ← checked out right next to it
```

with its `tools/openapi-sync/` tool available (see its own README). `../Datendrehscheibe`
means "go up one level from this repo, then into `Datendrehscheibe`" — if you keep it
checked out somewhere else, or under a different folder name, this command won't find it.

1. Run one command:

   ```bash
   pnpm sync:datendrehscheibe
   ```

   This vendors the current spec, regenerates the TypeScript types, and formats the result —
   all in one step. Plain `node`/`npm`/`pnpm` under the hood, no bash or PowerShell, so it
   works the same on every OS.

2. Review the diff in `openapi/datendrehscheibe/` and
   `src/lib/datendrehscheibe/generated/vehicles.d.ts`.
3. Run `pnpm typecheck` — if the change affects anything `lib/datendrehscheibe/` relies on,
   this fails with clear errors pointing at exactly what to update.
4. Fix any resulting code, commit the updated spec, generated types, and code fixes together.

Without that sibling checkout, ask a teammate for the current spec, copy it into
`openapi/datendrehscheibe/` by hand, then run `pnpm generate:datendrehscheibe-types` and
`pnpm format`.

**While actively developing across both repos**, run `pnpm dev:sync-datendrehscheibe` in its
own terminal — it watches Datendrehscheibe's OpenAPI folder and re-runs the sync
automatically on every change, so you never have to remember to do it by hand.

See [`.ai/backend/DATENDREHSCHEIBE_CLIENT.md`](.ai/backend/DATENDREHSCHEIBE_CLIENT.md) for
the full pattern, including how to add a second API domain later.

## Architecture in Short

This app never talks to a database — not for `payload-next`, not for the Datendrehscheibe,
not for anything. It fetches everything over HTTP, through two dedicated client layers:

- `src/lib/cms/` — the only place allowed to call `payload-next`'s REST API
- `src/lib/datendrehscheibe/` — the only place allowed to call the Datendrehscheibe's HTTP
  API (e.g. live vehicle inventory/pricing)

Both map their responses into this app's own view types under `src/types/`. See
[`.ai/core/PROJECT_ARCHITECTURE.md`](.ai/core/PROJECT_ARCHITECTURE.md) for the full picture —
including where Zustand fits in (client-only UI state, never a cache for upstream data).

## CI/CD

`.github/workflows/` — carried over from the old `Website-4.0` repo, adapted for this
project's pnpm/Next.js stack (no deployment/workflow-shape changes):

- **`c_test.yml`** — runs `pnpm test:coverage` (see "Coverage" in `.ai/quality/TESTING.md`).
  Runs on every PR. No separate linting/formatting job — Husky's pre-commit/pre-push hooks
  already enforce format/lint locally before anything reaches a PR.
- **`release_actions.yml`** — manual deploy to any environment (`workflow_dispatch`); the
  only caller of `c_build_and_deploy.yml` in this repo.
- **`c_build_and_deploy.yml`** — the actual build+deploy: builds on the runner, then builds
  and pushes the Docker image and deploys it to Azure App Service via the shared
  `Sport-Auto-Plus-GmbH/infrastructure` action. The old repo's per-environment
  `build:dev`/`build:staging`/`build:production` scripts don't carry over — this app reads
  its config from environment variables at runtime (Next.js Server Components), not baked
  in at build time, so one build serves every environment. Requires the same secrets as the
  old repo (`FONTAWESOME_TOKEN`, `CONTAINER_REGISTRY_*`, `AZURE_*`) configured on this
  repo/its GitHub Environments — not something this repo can set up on its own.

The `Dockerfile` is a fresh Next.js one (the old repo's is Angular/nginx-specific and doesn't
apply here) — same pattern as `payload-next`'s: builds once on the runner, the image just
installs production dependencies and copies the pre-built `.next/standalone` output. Not
carried over: the old repo's Azure Web-Shell SSH debug access
(`docker-resources/azure-entrypoint.sh`) — add it deliberately if this project needs the
same SSH-into-the-container debugging setup.
