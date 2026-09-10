# Website Frontend

**Repository:** `website-next`

This is the **public website** for Sport Auto Plus, built with [Next.js](https://nextjs.org/).
It has no CMS or database of its own — all content and structured data (vehicles, blog posts,
FAQs, ...) is fetched from a separate headless CMS project,
[`payload-next`](https://github.com/Sport-Auto-Plus-GmbH/payload-next), over its REST API.

If you're going to write code in this repository (including AI assistants), read
[`.ai/README.md`](.ai/README.md) first — it defines the engineering rules and conventions
this project follows.

## Status

This repository currently only contains the AI engineering playbook (`.ai/`). The Next.js
project itself has not been scaffolded yet — this README will be filled in with the tech
stack, setup steps, and everyday commands once that happens.

## Planned Tech Stack

| Purpose         | Technology                                                    |
| ---------------- | ---------------------------------------------------------------- |
| Framework          | [Next.js](https://nextjs.org/) (App Router)                        |
| UI library         | [React](https://react.dev/)                                        |
| Language            | [TypeScript](https://www.typescriptlang.org/)                       |
| Styling             | [Tailwind CSS](https://tailwindcss.com/)                            |
| UI components       | [shadcn/ui](https://ui.shadcn.com/)                                  |
| Icons               | FontAwesome Pro+ (licensed)                                          |
| Client state        | [Zustand](https://zustand.docs.pmnd.rs/)                             |
| Git hooks           | [Husky](https://typicode.github.io/husky/)                          |
| Formatting          | [Prettier](https://prettier.io/)                                     |
| Testing             | [Vitest](https://vitest.dev/) + React Testing Library                |
| CMS (separate repo) | [Payload](https://payloadcms.com/) via `payload-next`'s REST API      |

Exact versions will be added here once the project is scaffolded and dependencies are pinned.
