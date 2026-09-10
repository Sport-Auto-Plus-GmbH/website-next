# Accessibility

Rules for accessible UI in this project. Accessibility is a requirement, not a nice-to-have.

---

# Semantic HTML First

Use the correct native element before reaching for ARIA: `<button>` for actions, `<a>` for
navigation, `<nav>`, `<main>`, `<header>`, `<footer>`, heading levels in document order.

The AI MUST NOT build a clickable `<div>` when a `<button>` or shadcn `Button` does the job.

---

# Keyboard Support

Every interactive element MUST be reachable and operable via keyboard alone (Tab, Shift+Tab,
Enter/Space, Escape for dismissible UI, arrow keys for composite widgets like menus/tabs).
shadcn/ui + Radix primitives provide this by default — do not strip it.

---

# Focus Management

- Visible focus indicators MUST NOT be removed (`focus:outline-none` alone is not acceptable
  — pair it with a visible `focus-visible:ring-*` style, which shadcn's primitives already
  do).
- Dialogs/sheets/drawers MUST trap and restore focus correctly (Radix handles this — do not
  bypass it with a custom implementation).

---

# Images and Icons

- Every meaningful `<Image>`/`<img>` MUST have descriptive `alt` text sourced from the CMS
  (Payload's Media collection alt field) — never a filename or empty string for meaningful
  images.
- Purely decorative images/icons MUST use `alt=""` / `aria-hidden="true"`. See
  `frontend/ICONS.md`.

---

# Forms

- Every input MUST have an associated, visible `<label>` (or `aria-label` only when a visible
  label is truly not part of the design, e.g. a search icon-button).
- Validation errors MUST be programmatically associated with their field
  (`aria-describedby`) and announced, not conveyed by color alone.

---

# Color and Contrast

- Do not convey state (error, success, required) by color alone — pair it with an icon,
  text, or both.
- Respect the project's design tokens, which are chosen to meet WCAG AA contrast; do not
  introduce a custom low-contrast color for "aesthetic" reasons.

---

# Motion

Respect `prefers-reduced-motion` for any non-essential animation/transition added beyond
what shadcn/Radix already handles.

---

# Checklist Before Shipping an Interactive Component

- Can it be fully operated with only a keyboard?
- Does it have a visible focus state?
- Does a screen reader announce its name, role, and state?
- Does it work with the browser's text zoomed to 200%?
