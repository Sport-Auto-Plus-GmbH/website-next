# Completion Checklist

A task is complete only when every applicable item below is true.

---

# Always

- [ ] The implementation works and solves the actual requested task, nothing more.
- [ ] The code compiles and is fully type-safe (no new `any`, no `as` on unvalidated data).
- [ ] Prettier formatting and ESLint pass with no new warnings/errors.
- [ ] Custom types live under the root `types/` folder.
- [ ] File/function/component size limits are respected (`core/CODE_STYLE.md`).
- [ ] Naming follows `core/NAMING_CONVENTIONS.md` and matches nearby code.
- [ ] No unrelated files were touched.
- [ ] No `console.log`/`console.debug` left behind.
- [ ] The development server was not started, restarted, or stopped by the AI.

---

# If the Change Touches Data Fetching

- [ ] All Payload REST calls go through `lib/cms/`, not called directly from a component.
- [ ] The CMS response is mapped into a `types/cms/` view type, not passed through raw.
- [ ] Failure states (not-found vs. infrastructure error) are handled distinctly
      (`quality/ERROR_HANDLING.md`).
- [ ] Caching/revalidation strategy is deliberate, not accidental (`frontend/NEXTJS.md`).

---

# If the Change Touches UI

- [ ] Keyboard and screen-reader accessible (`frontend/ACCESSIBILITY.md`).
- [ ] Built from shadcn/ui primitives where one exists, not a duplicate hand-rolled version.
- [ ] Uses Tailwind design tokens, not arbitrary hardcoded values, unless justified.
- [ ] Uses FontAwesome Pro+ icons consistently (`frontend/ICONS.md`).
- [ ] Has a defined empty/loading state if it renders a list or async data.

---

# If the Change Touches Forms or Mutations

- [ ] Input is validated with Zod both client- and server-side (`backend/VALIDATION.md`).
- [ ] Server Action/Route Handler returns typed success/error results, never a raw throw to
      the client.
- [ ] No secret or Payload write-credential is exposed to the client bundle.

---

# If the Change Touches Client State

- [ ] Zustand is used only for client-only UI state, never as a CMS-data cache
      (`state/ZUSTAND.md`).
- [ ] State is as local as possible; global state was actually necessary.

---

# Tests

- [ ] New non-trivial logic (mappers, hooks, stores, helpers) has a test under `test/`.
- [ ] Existing tests still pass.
