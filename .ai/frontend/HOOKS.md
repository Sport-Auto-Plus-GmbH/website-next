# Hooks

Rules for custom React hooks in this project.

---

# Purpose

Hooks encapsulate **UI logic**: local/derived state, interaction behavior, and coordinating
Zustand stores. Hooks are not a place for CMS-fetching logic (that belongs in Server
Components/Server Actions calling `lib/cms/`) or for rendering (that belongs in components).

---

# Naming and Location

- Hook names MUST start with `use`.
- Location: `hooks/<domain>/use-thing.ts`, exporting `useThing`.
- Generic, cross-domain hooks (e.g. `useDebounce`, `useMediaQuery`) live in `hooks/shared/`.

---

# One Responsibility per Hook

A hook should do one thing well. If a hook grows to coordinate several unrelated concerns,
split it into smaller hooks and compose them in the component.

---

# Return Value Shape

- Return a small object with named keys for hooks exposing multiple values
  (`{ isOpen, open, close }`), not a positional tuple, unless mirroring a well-known React
  pattern (`useState`-like `[value, setValue]`) where a tuple is the expected shape.
- Keep the returned API minimal — do not expose internal implementation details the caller
  does not need.

---

# Dependencies

- Keep `useEffect`/`useMemo`/`useCallback` dependency arrays complete and honest — do not
  suppress the exhaustive-deps warning to silence a bug.
- If a dependency array is hard to get right, the logic likely belongs in a `useReducer` or
  should be restructured rather than patched with a lint-disable comment.

---

# Testing

Hooks with non-trivial logic (anything beyond a thin wrapper around `useState`) SHOULD have
a test under `test/hooks/<domain>/use-thing.test.ts` using React Testing Library's
`renderHook`. See `quality/TESTING.md`.
