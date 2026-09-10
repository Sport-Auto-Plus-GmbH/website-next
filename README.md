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
registry token, set per-developer in your own global `~/.npmrc` (never in this project's
committed `.npmrc`, which only maps `@fortawesome` to FontAwesome's registry):

```
//npm.fontawesome.com/:_authToken=YOUR_TOKEN_HERE
```

Without it, `pnpm install` will fail to fetch the `@fortawesome/pro-*` packages. Ask whoever
manages the license for the token. See [`.ai/frontend/ICONS.md`](.ai/frontend/ICONS.md) for
usage rules.

See [`.ai/frontend/ICONS.md`](.ai/frontend/ICONS.md) for usage rules once installed.

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

| Command                     | What it does                                     |
| --------------------------- | ------------------------------------------------ |
| `pnpm dev`                  | Start the local dev server (port 3001)           |
| `pnpm build` / `pnpm start` | Build for production / run that production build |
| `pnpm lint`                 | Check the code for style/quality problems        |
| `pnpm format`               | Auto-format the code                             |
| `pnpm format:check`         | Check formatting without changing files          |
| `pnpm test`                 | Run the test suite once                          |
| `pnpm test:watch`           | Run tests in watch mode                          |

A pre-commit hook (via Husky + lint-staged) automatically lints and formats the files you're
committing.

## How the Project Is Organized

Everything application-specific lives under `src/`:

- **`src/app/`** — Next.js App Router pages, layouts, route handlers.
- **`src/components/ui/`** — shadcn/ui primitives (generated, treated as infrastructure).
- **`src/lib/cms/`** — the _only_ place allowed to call `payload-next`'s REST API. See
  `src/lib/cms/media/fetch-media-list.ts` for the pattern to follow.
- **`src/types/cms/`** — Website-owned view types describing what we actually consume from
  the CMS (not a copy of Payload's internal types).
- **`.ai/`** — the engineering playbook. Read it before making non-trivial changes,
  especially [`.ai/backend/CMS_CLIENT.md`](.ai/backend/CMS_CLIENT.md) before touching
  anything that talks to the CMS.

Tests live under the root `test/` folder, mirroring the `src/` structure (never colocated
with source files) — see `test/lib/cms/media/fetch-media-list.test.ts` for an example.

## Architecture in Short

This app never talks to a database. It fetches everything from `payload-next` over HTTP,
through `src/lib/cms/`, and maps the responses into its own view types. See
[`.ai/core/PROJECT_ARCHITECTURE.md`](.ai/core/PROJECT_ARCHITECTURE.md) for the full picture —
including where Zustand fits in (client-only UI state, never a cache for CMS data).
