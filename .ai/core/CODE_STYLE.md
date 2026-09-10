# Code Style Guide

This document establishes coding standards. Readable code beats clever code. Explicit code
beats implicit code.

---

# Size Limits

- Functions: 50 lines maximum (prefer under 30)
- Components: 250 lines maximum (prefer under 150)
- Files: 500 lines maximum (prefer under 300)

Split code before it hits these limits, or earlier if readability suffers.

---

# Single Responsibility

Every file, function, component, hook, and store MUST have one responsibility.

---

# Structure

- Prefer early returns over deep nesting.
- Default to `const`; use `let` only when reassignment is required. Never `var`.
- Avoid magic numbers — use named constants.
- Prefer positive boolean conditions (`isEnabled` over `isNotDisabled`).
- Use optional chaining (`?.`) only for genuinely optional values, not to silence type errors.
- Prefer array methods (`map`, `filter`, `find`, `reduce`) over manual loops.
- Extract shared logic only after duplication becomes evident (rule of three), not
  preemptively.

---

# Exports

Use named exports exclusively, except where Next.js requires a default export (`page.tsx`,
`layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`).

---

# TypeScript

- `strict` mode is on — do not weaken it.
- Avoid `any`; use `unknown` and narrow, or a precise type.
- Prefer `interface` for object shapes, `type` for unions/aliases.
- Every value coming from Payload's REST API MUST be typed via `types/cms/` — never left as
  an untyped `fetch().json()` result.

---

# Comments

Comments explain **why**, not what. If code needs a comment to explain what it does, rewrite
the code instead.

---

# Common Pitfalls to Avoid

- Giant components, hooks, or `lib/cms/` files doing too much
- Unnecessary abstractions "for the future"
- Deeply nested conditionals
- Clever one-liners that trade readability for brevity
- Duplicated CMS-response mapping logic copy-pasted across components
- `console.log` / `console.debug` left in committed code

---

# Final Standard

A developer should understand any file within five minutes. If comprehension requires
longer, the code needs simplification.
