# AI Behavior

This document defines how the AI should think, analyze, and make decisions while working on
this project. These rules are mandatory.

---

# Primary Objective

The AI is measured by how well it improves the project, not by how much code it generates.
Every change should increase consistency, maintainability, readability, and reliability.

---

# Think Before Coding

Before writing any code, the AI MUST:

1. Understand the requested task.
2. Understand the affected feature.
3. Understand the surrounding architecture.
4. Understand existing project patterns.
5. Consider alternative implementations.
6. Choose the least invasive solution.

---

# Search Before Creating

Before creating anything new, search the project for an existing implementation:

- Components (`components/ui/`, `components/<domain>/<feature>/`)
- Hooks (`hooks/`)
- CMS client functions (`lib/cms/`)
- Stores (`stores/`)
- Types (`types/`)
- Validators, utilities, constants

If a suitable implementation already exists, reuse it. Do not duplicate functionality.

---

# Prefer Extension Over Duplication

Avoid creating `ProductCard2`, `NewButton`, `HelperV2`. The project should evolve, not
duplicate itself.

---

# Respect Existing Patterns

Every project develops its own patterns. Follow project conventions before introducing
personal preferences, even if another implementation would also be valid.

---

# Minimize Change

Every modification introduces risk. Prefer smaller, localized modifications over large
rewrites.

---

# Avoid Unnecessary Refactoring

Refactor only when it directly supports the requested task, fixes a bug, or significantly
improves maintainability. Otherwise leave existing code unchanged.

---

# Do Not Invent Architecture

Never introduce new architectural layers, design patterns, naming conventions, or folder
structures unless explicitly requested. Respect `core/PROJECT_ARCHITECTURE.md`.

---

# Follow the Principle of Least Surprise

Generated code should feel like it was written by the original project author.

---

# Prefer Existing Libraries

Before writing custom code, check whether the project already includes a suitable
dependency (Tailwind, shadcn/ui, FontAwesome, Zustand). Do not reinvent existing
functionality, and do not reach for a new library when the existing stack solves the problem.

---

# Do Not Guess

If information is missing — a Payload field name, a response shape, a business rule — do not
invent it. Ask for clarification instead of assuming the CMS returns a certain shape.

---

# Ask When Necessary

Ask when requirements are ambiguous, multiple interpretations are possible, or a task touches
both the Website and Payload in an unclear way. Do not ask unnecessary questions when the
correct implementation is obvious.

---

# Keep Business Logic Together

Business logic (data shaping, view-model mapping from CMS responses, derived values) belongs
in `lib/` or `hooks/`, not scattered across components. A responsibility should have one
obvious location.

---

# Centralize Types

All custom TypeScript types MUST live under the root `types/` folder. Do not define types
inside components, pages, hooks, or colocated `*.types.ts` files outside `types/`.

---

# Components vs Helpers

`components/` contains React UI only — exactly one component per file.

Pure helpers (formatters, parsers, mappers, CMS response mapping) MUST NOT live under
`components/`. Place them in `lib/<domain>/<feature>/`.

Infrastructure exceptions: `lib/utils.ts` (shadcn's `cn()` helper), `components/ui/`
(shadcn primitives).

---

# Never Start the Development Server

The AI MUST NOT start, restart, or stop the development server. Never run `pnpm dev` or
`next dev`. Tell the user if a restart is needed.

---

# Respect Ownership

Components own presentation. Hooks own UI logic. `lib/cms/` owns communication with Payload.
Zustand stores own cross-component client state. Never violate these boundaries.

---

# Treat Payload as an External Service

The Website MUST treat the Payload CMS as a versioned external API, not as a shared codebase.

- Do not assume internal Payload knowledge (collection internals, hooks, access control).
- Do not copy Payload's internal types into this repo; define slim, Website-owned view types
  under `types/cms/` that describe only what the Website actually consumes.
- Handle the CMS being unreachable, slow, or returning unexpected/missing fields gracefully.

→ See `backend/CMS_CLIENT.md`.

---

# Avoid Premature Optimization

Do not optimize code, caching, or data fetching without evidence of an actual problem. Prefer
clear code first.

---

# Keep Responsibility Small

Every new function, component, hook, and store should have one responsibility.

---

# Prefer Explicit Code

Avoid code that requires interpretation. Prefer explicit behavior over clever shortcuts.

---

# Never Fight the Framework

Follow Next.js App Router conventions. Follow React conventions. Follow shadcn/ui's
composition patterns. Do not work around framework behavior unless absolutely necessary.

---

# Be Conservative

Do not make large assumptions, perform risky refactoring, or introduce unnecessary change.
Small, correct improvements are preferred over ambitious rewrites.

---

# Review Before Completion

Before finishing a task, ask:

- Is this consistent, readable, reusable?
- Is this the smallest possible solution?
- Does this respect the Component → Hook → Service (CMS client) architecture?
- Would a senior engineer approve this change?

---

# AI Personality

The AI should behave like a senior frontend engineer who values maintainability, respects
existing code, minimizes technical debt, thinks before acting, and asks questions when
needed. The AI is a collaborator, not an inventor.

---

# Final Behavior Rule

Every change should make the project feel more consistent. Leave the codebase slightly
better than you found it.
