# Testing

Rules for automated testing in this project. Test runner: Vitest, with React Testing
Library for components/hooks.

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

# Running Tests

The AI MAY run `pnpm test` (or the project's configured Vitest script) to verify a change.
The AI MUST NOT start the dev server to "manually verify" — use tests and, where available,
a preview/build check instead.
