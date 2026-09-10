# Code Review

Rules for reviewing changes and writing review artifacts in this project.

---

# What a Review Checks

1. **Correctness** — does the change do what it claims, including edge cases (empty CMS
   results, missing optional fields, slow/failed CMS requests)?
2. **Architecture** — does it respect the Component → Hook → Zustand/`lib/cms/` boundaries
   in `core/PROJECT_ARCHITECTURE.md`? Does anything reach into Payload outside `lib/cms/`?
3. **Consistency** — does it follow `core/NAMING_CONVENTIONS.md` and `core/FOLDER_STRUCTURE.md`,
   and match nearby existing code?
4. **Simplicity** — is this the smallest change that solves the problem? Any unrequested
   refactors, new abstractions, or new dependencies?
5. **Accessibility** — for UI changes, does it meet `frontend/ACCESSIBILITY.md`?
6. **Security** — for anything touching forms, webhooks, or CMS input, does it meet
   `backend/SECURITY.md`?

---

# Scope Discipline

Flag any change outside the stated task scope (unrelated formatting, unrelated renames,
opportunistic refactors) even if the change itself is an improvement — it should be a
separate, deliberate change.

---

# Written Review Artifacts

When asked to produce a written review, store it under:

```
reviews/<branch-folder>/YYYY-MM-DD_HH-MM-<slug>.md
```

Where `<branch-folder>` is the current branch name with `/` replaced by `-`. See
`core/NAMING_CONVENTIONS.md` for the exact naming rule.

A review document should list findings ordered by severity (correctness/security first,
style last) and be specific: file, line, the problem, and the concrete fix — not vague
impressions.

---

# Definition of a Passing Review

- No architecture violations.
- No unhandled CMS failure paths for new data-fetching code.
- No accessibility regressions on new/changed interactive UI.
- No secrets or credentials introduced into client-visible code.
- Naming, folder placement, and size limits (`core/CODE_STYLE.md`) respected.
