# shadcn/ui

Rules for using shadcn/ui components in this project.

---

# shadcn/ui Primitives Are Owned Code

Unlike a normal npm dependency, shadcn/ui components are generated into
`components/ui/` and become part of this codebase. Treat them as project code that happens
to start from a template, not as a black-box library.

---

# Adding a New Primitive

Use the shadcn CLI to add new primitives (`pnpm dlx shadcn@latest add <component>`) instead
of hand-writing a component that duplicates one shadcn already ships (button, dialog,
dropdown-menu, select, sheet, tabs, etc.).

The AI MUST NOT hand-roll a primitive that shadcn/ui already provides.

---

# Do Not Fork Unnecessarily

Once generated, prefer extending a primitive via props/composition (`asChild`,
`className`, variant props) over duplicating the file with a slightly different name.

If a primitive genuinely needs a project-specific variant, extend its `cva` variants in
place inside `components/ui/<component>.tsx` rather than creating a parallel component.

---

# Styling

shadcn/ui primitives are styled with Tailwind CSS and the project's design tokens (CSS
variables in `globals.css` / `tailwind.config`). Do not introduce a second styling system
(CSS Modules, styled-components) alongside it.

---

# Composition Pattern

Build domain components (`components/vehicle/...`) by composing primitives:

```tsx
<Card>
  <CardHeader>
    <CardTitle>{vehicle.title}</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

Do not reach into a primitive's internal DOM structure with custom CSS selectors — use the
exposed sub-components and `className`/`cn()` instead.

---

# Accessibility

shadcn/ui primitives (built on Radix) ship with correct ARIA and keyboard behavior out of the
box. Do not strip or override `aria-*` attributes, focus traps, or keyboard handlers that
Radix provides. See `frontend/ACCESSIBILITY.md`.

---

# Icons Inside shadcn Components

Use FontAwesome Pro+ icons (see `frontend/ICONS.md`) in place of the default `lucide-react`
icons shadcn examples ship with, to keep one icon system across the project.
