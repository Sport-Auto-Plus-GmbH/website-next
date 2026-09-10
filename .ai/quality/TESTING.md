# Testing

Rules for automated testing in this project. Test runner: Vitest, with React Testing
Library for components/hooks. `pnpm test` runs the suite once; `pnpm test:coverage` runs it
with coverage (see "Coverage" below).

---

# What to Test

- `lib/cms/` mapping functions — given a realistic Payload REST response fixture, does the
  mapper produce the expected Website view type? Include a fixture for missing/partial
  optional fields.
- `lib/shared/` and other pure helpers (formatters, calculators) — pure input/output tests.
- Hooks with non-trivial logic — via `renderHook`.
- Zustand stores with non-trivial logic (derived state, multi-step actions).
- Components with meaningful conditional rendering or interaction logic — not every
  presentational component needs a test, but anything with branching logic does.

---

# Test Location

Tests mirror the source tree under the root `test/` folder — never colocated with source
files (see `core/FOLDER_STRUCTURE.md`):

```
test/lib/cms/blog/fetch-blog-post.test.ts
test/hooks/vehicle/use-vehicle-filters.test.ts
test/components/vehicle/listing/vehicle-listing-grid.test.tsx
```

---

# CMS Fixtures

Keep realistic Payload REST response fixtures next to the tests that use them (e.g.
`test/lib/cms/blog/__fixtures__/blog-post-response.json`) rather than inlining large mock
objects in the test body. Update fixtures when Payload's response shape changes rather than
patching assertions around a stale fixture.

---

# Mocking

- Mock `fetch` (or the specific `lib/cms/` function) at the boundary being tested — do not
  mock deep internals.
- Do not spin up a real Payload instance for unit tests; that belongs to integration/e2e
  tests, if introduced later.

---

# What Not to Over-Test

- Do not test shadcn/ui primitives themselves (`components/ui/`) — they are already tested
  upstream. Test your usage/composition of them only where you added logic.
- Do not write snapshot tests for large component trees as a substitute for meaningful
  assertions.

---

# Coverage

This project enforces a minimum of **80% coverage** (lines, statements, functions, branches)
via `pnpm test:coverage` (`vitest.config.mts`'s `coverage.thresholds`) — enforced in CI, so a
PR that drops below it fails the build. Components, hooks, `lib/` functions, and Zustand
stores all need tests written alongside them going forward, not bolted on afterward.

`coverage.exclude` carves out what genuinely isn't hand-written application logic:
`types/**` (type-only, nothing to execute), `components/ui/**` and `lib/utils.ts` (shadcn's
own generated/vendored code — see "What Not to Over-Test" above). Do not add something to
this list just to dodge the threshold — every exclusion needs the same justification as the
existing ones: generated/vendored, not "hard to test."

Two non-obvious things when testing a Server Component (`app/**/page.tsx`, `layout.tsx`):

- **`next/font/google`'s exports are compiler macros.** Outside Next's own build pipeline
  (i.e. under plain Vitest) `Bebas_Neue`/`Roboto`/etc. aren't real functions and calling them
  throws. Mock `next/font/google` in the test, returning `{ variable: '...' }` for whichever
  font functions the component under test actually calls.
- **RTL needs `cleanup()` between tests.** Already wired up globally in `vitest.setup.ts` —
  without it, multiple `render()` calls in the same file leak elements into jsdom's shared
  document, breaking single-element queries (`getByText`, `getByAltText`) on the second test
  onward. If you ever see a "multiple elements found" error in a previously-passing test, this
  is the first thing to check.
- A root `layout.tsx` renders `<html>`/`<body>` — RTL's `render()` can't mount those directly
  (it inserts into a `<div>`, and nesting `<html>` inside one is invalid). Call the async
  component function directly (`await RootLayout({ children, params: Promise.resolve({}) })`)
  and assert on the returned element's `.props` instead of rendering it.

---

# Running Tests

The AI MAY run `pnpm test`, `pnpm test:coverage`, `pnpm lint`, and `pnpm typecheck` to verify
a change. The AI MUST NOT start the dev server to "manually verify" — use tests and, where
available, a preview/build check instead.
