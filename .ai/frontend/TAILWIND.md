# Tailwind CSS

Rules for using Tailwind CSS in this project.

---

# Utility-First

Style with Tailwind utility classes directly in JSX. Do not introduce CSS Modules,
styled-components, or hand-written global CSS for component styling — Tailwind is the only
styling system in this project besides the shadcn/ui design tokens.

---

# Design Tokens Over Raw Values

Use the project's design tokens (Tailwind theme colors, spacing, radius, typography defined
in `tailwind.config`/`globals.css`) instead of arbitrary values.

Prefer:

```
bg-primary text-primary-foreground rounded-lg
```

Over:

```
bg-[#1a2b3c] text-[#ffffff] rounded-[8px]
```

Use arbitrary values (`[...]`) only when no token exists and the value is genuinely one-off
(e.g. a CMS-driven inline color from a Payload color-picker field).

---

# Class Ordering and Merging

Use the project's `cn()` helper (`lib/utils.ts`, built on `clsx` + `tailwind-merge`) whenever
classes are combined conditionally or a component accepts a `className` prop override. Never
concatenate class strings with template literals for conditional classes.

---

# Responsive and Dark Mode

- Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) mobile-first: base classes target
  mobile, prefixed classes override for larger viewports.
- Use the project's dark-mode strategy consistently (`dark:` variants) — do not hand-roll a
  separate theme system.

---

# Avoid Long, Unreadable Class Strings

If a `className` string becomes hard to read (many conditional classes, many utilities),
extract variants with `cva` (class-variance-authority, already used by shadcn/ui) instead of
inlining a long ternary chain.

---

# No Inline Styles for Static Values

Do not use the `style` prop for values expressible as Tailwind classes. Reserve `style` for
truly dynamic, runtime-computed values (e.g. a CMS-configured background color).

---

# Consistency Over Personal Preference

If the codebase already expresses a pattern with certain utilities (e.g. a card always uses
`rounded-lg border bg-card p-6 shadow-sm`), reuse that combination rather than inventing a
visually similar but differently-authored alternative.
