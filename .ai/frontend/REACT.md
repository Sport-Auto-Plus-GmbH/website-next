# React

Rules for writing React components in this project (React 19).

---

# Function Components Only

Use function components with hooks. Never class components.

---

# One Component per File

The AI MUST NOT define multiple JSX-returning components in the same file. Split into
separate files under `components/<domain>/<feature>/`.

---

# Props

- Destructure props in the function signature.
- Define a `<ComponentName>Props` interface for every component that takes props (see
  `core/NAMING_CONVENTIONS.md`).
- Prefer explicit, narrow prop types over `React.ComponentProps<'div'>` spreads unless the
  component is intentionally a thin wrapper (e.g. a shadcn primitive).

---

# State

- Keep state local (`useState`) until it must be shared.
- Lift state only as far as necessary — prefer passing props/composition over lifting to
  global state.
- Use `useReducer` only when state transitions are genuinely complex; otherwise prefer
  multiple `useState` calls for clarity.

---

# Effects

`useEffect` is for synchronizing with an external system (subscriptions, browser APIs,
imperative third-party libraries) — not for deriving state from props/state, which should be
computed directly during render or via `useMemo`.

The AI MUST NOT use `useEffect` to fetch CMS data in a Client Component; fetch it in a Server
Component and pass it down, or use a Server Action.

---

# Memoization

Do not reach for `useMemo`/`useCallback`/`React.memo` preemptively. Add them only when a
measured re-render or computation cost is an actual problem.

---

# Composition Over Configuration

Prefer composing smaller components (children, slots) over a single component with many
boolean/variant props controlling internal branches.

---

# Keys

Never use array index as a `key` for lists that can reorder, filter, or have items
added/removed. Use a stable id from the data (e.g. the Payload document id/slug).

---

# Client-Only Libraries

Any library that touches `window`/`document` at import time MUST be used only inside a
Client Component, and loaded via `next/dynamic` with `ssr: false` when it cannot be
server-rendered at all.
