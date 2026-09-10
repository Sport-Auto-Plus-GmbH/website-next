# AI Rules

These rules define the mandatory behavior for every AI assistant working on this project.

These rules take precedence over all technology-specific guidelines.

Every generated code change must comply with these standards.

---

# Rule Keywords

## MUST

A mandatory rule. Violating a MUST rule is considered an incorrect implementation.

## SHOULD

A strong recommendation. Only deviate when there is a clear technical justification.

## MAY

Optional guidance. Use professional judgment.

## MUST NOT

A prohibited behavior. Never violate these rules unless explicitly instructed.

---

# Core Principles

## Rule 1

MUST prioritize correctness over speed.

## Rule 2

MUST prioritize readability over cleverness.

## Rule 3

MUST write code for humans first. The code will be read far more often than it will be written.

## Rule 4

MUST optimize for long-term maintainability.

## Rule 5

MUST keep the codebase consistent. Consistency is more valuable than personal preference.

---

# This Is a Frontend, Not a Backend

The Website has no database and no ORM — for Payload's data, the Datendrehscheibe's data, or
anything else. It never connects to a database directly, under any circumstances.

The AI MUST NOT:

- add Prisma, Drizzle, or any database driver to this project
- query a database directly from this repository, for any system
- add a connection string, DB host, DB credential, or ORM client for any database, anywhere
  in this repo (not even server-side, not even in an env var)
- assume it can see Payload's internal types, collections, or hooks, or the
  Datendrehscheibe's internal services or database schema

All structured content comes from two upstream HTTP APIs at runtime: Payload's REST API
(via `lib/cms/`) and the Datendrehscheibe's HTTP API (via `lib/datendrehscheibe/`). Neither
is ever called directly from anywhere else in the codebase — see the single-client-layer
rule in `core/PROJECT_ARCHITECTURE.md`.

→ See `core/PROJECT_ARCHITECTURE.md`, `backend/CMS_CLIENT.md`, and
`backend/DATENDREHSCHEIBE_CLIENT.md`.

---

# Understanding the Task

Before generating code the AI MUST:

- Understand the requested task.
- Understand the existing implementation.
- Understand the affected architecture (Component → Hook → Service → CMS client).
- Understand the surrounding code.

Never start coding before understanding the context.

---

# Existing Code

The AI MUST:

- reuse existing solutions
- follow existing patterns
- preserve existing conventions
- integrate naturally into the project

The AI MUST NOT introduce new patterns without a compelling reason.

---

# Scope

The AI MUST only modify code required for the requested task.

The AI MUST NOT:

- refactor unrelated files
- rename unrelated variables
- change formatting outside the task
- move files without justification

Every change must have a clear purpose.

---

# Simplicity

The AI MUST choose the simplest solution that correctly solves the problem.

Avoid unnecessary abstractions, generic code, design patterns, and configuration.

Complexity must always be justified.

---

# Reusability

Before writing new code the AI MUST search for existing components, hooks, `lib/` helpers,
CMS client functions, stores, validators, and types.

Reuse existing code whenever practical. Do not duplicate functionality.

---

# Architecture

The AI MUST respect the existing architecture (see `core/PROJECT_ARCHITECTURE.md`).

The AI MUST NOT bypass architectural layers (e.g. a component fetching from Payload directly
instead of going through a service/CMS-client function).

Never create circular dependencies.

---

# Production Quality

Every generated code change MUST be production ready. Generated code must:

- compile
- be type-safe
- be formatted (Prettier)
- pass linting
- be understandable

Incomplete implementations are not acceptable.

---

# Technical Debt

The AI MUST NOT introduce technical debt to complete a task faster.

Temporary workarounds are only acceptable when explicitly requested.

---

# Dependencies

The AI MUST NOT introduce new dependencies unless:

- existing libraries cannot solve the problem
- the dependency provides significant value
- the dependency is explicitly requested

Always prefer the project's existing stack: Next.js, React, Tailwind CSS, shadcn/ui,
FontAwesome Pro+, Zustand.

---

# UI Components: shadcn/ui Only

shadcn/ui is the only component library in this project. For every UI need — buttons,
dialogs, forms, dropdowns, tables, tabs, and so on:

The AI MUST:

- use an existing `components/ui/` primitive if one already covers the need
- add a new one via the shadcn CLI (`pnpm dlx shadcn@latest add <component>`) if shadcn
  provides it but it hasn't been added yet

The AI MUST NOT:

- add a second component library (Material UI, Ant Design, Headless UI, Chakra, Radix
  used directly instead of through shadcn, etc.), even for a single one-off component
- hand-roll a custom component that duplicates what a shadcn/ui primitive already does
  (a custom modal instead of `Dialog`, a custom dropdown instead of `DropdownMenu`/`Select`)

If shadcn/ui genuinely has no primitive for a need, build the smallest possible composition
of existing primitives first; only write a fully custom component as a last resort, and
still base it on the project's existing styling tokens (`core/CODE_STYLE.md`,
`frontend/TAILWIND.md`) rather than inventing a new visual language.

→ See `frontend/SHADCN.md` for the full pattern.

---

# File Organization

The AI MUST:

- keep files focused
- keep responsibilities clear
- place all custom types under the root `types/` folder
- nest application code as `<layer>/<domain>/<feature>/`
- place exactly one React component per component file

The AI MUST NOT:

- define multiple React components (JSX-returning functions) in the same file
- exceed the size limits in `core/CODE_STYLE.md`

Size limits:

- functions: 50 lines maximum
- components: 250 lines maximum
- files: 500 lines maximum

Split code when it approaches these limits or when readability suffers.

---

# Development Server

The AI MUST NOT start, restart, or stop the development server.

This includes `pnpm dev`, `next dev`, or any equivalent command.

If a change requires a running or restarted development server, tell the user. Do not run it
yourself.

---

# Version Control

The AI MUST NOT add AI-attribution to commits, pull requests, or any other generated
artifact — no `Co-Authored-By: Claude ...` trailer, no "Generated by AI" note, no bot-style
footer. Write commit messages and PR descriptions as if authored by the engineer directing
the change.

---

# Naming

Names MUST describe intent. Avoid abbreviations and vague names.

---

# Comments

Comments MUST explain WHY, never WHAT. If code needs a comment to explain what it does,
rewrite the code instead.

---

# Error Handling

The AI MUST handle failures gracefully, including failed CMS requests. Never silently ignore
errors. Never leave empty catch blocks.

---

# Logging

The AI MUST remove debugging output. Never leave `console.log()` / `console.debug()` in
production code.

---

# Security

Security always has priority over convenience. Never expose secrets, trust unvalidated
external input, expose internal error details to the client, or bypass validation.

→ See `backend/SECURITY.md`.

---

# Performance

The AI SHOULD avoid unnecessary work (extra CMS requests, unnecessary client components,
unnecessary re-renders). Readability has higher priority than micro-optimizations.

---

# Breaking Changes

The AI MUST NOT introduce breaking changes unless explicitly requested. If a breaking change
appears necessary: stop, explain why, request confirmation.

---

# Assumptions

The AI MUST NOT guess business rules, Payload response shapes, or user expectations. When
uncertain, ask. Do not guess a Payload field or collection shape — check `payload-types.ts`
reference exports shared by the CMS team, or ask.

---

# Decision Priority

1. Security
2. Correctness
3. Data Integrity
4. Existing Architecture
5. Existing Project Patterns
6. Readability
7. Maintainability
8. Simplicity
9. Performance
10. Developer Convenience

Higher priorities always override lower priorities.

---

# AI Workflow

Before generating code:

1. Understand the task.
2. Analyze the surrounding code.
3. Search for reusable implementations.
4. Identify the architectural layer.
5. Plan the smallest possible change.
6. Generate the solution.
7. Verify correctness, consistency, formatting, and completeness.

Never skip these steps.

---

# Definition of Done

A task is complete only if:

- The implementation works.
- The code compiles and is type-safe.
- Custom types live under the root `types/` folder.
- Size limits are respected.
- The architecture is respected (no direct Payload access from components).
- Existing patterns are reused.
- The code is readable and production ready.
- The development server was not started or restarted by the AI.

---

# Final Principle

Leave the project in a better state than before. Never leave the project worse than you
found it.
