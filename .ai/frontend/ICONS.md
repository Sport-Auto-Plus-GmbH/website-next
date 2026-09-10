# Icons (FontAwesome Pro+)

Rules for using FontAwesome in this project. The project has a valid Pro+ license — the CLI
tools and Website may install and use Pro icon packages.

---

# One Icon System

FontAwesome Pro+ is the only icon system in this project. The AI MUST NOT introduce another
icon library (`lucide-react`, `react-icons`, `heroicons`, inline one-off SVGs) alongside it,
including inside shadcn/ui components — swap their default icons for FontAwesome equivalents.

---

# Installation

Pro icon packages are installed from FontAwesome's private npm registry using the project's
configured `.npmrc` token (`FONTAWESOME_PACKAGE_TOKEN` / equivalent). The AI MUST NOT commit
the token, MUST NOT hardcode it in code, and MUST NOT switch a Pro package to the free
`@fortawesome/free-*-svg-icons` equivalent as a workaround for a missing token — surface the
problem to the user instead.

---

# Import Only What You Use

Import individual icons, never a whole style package as a namespace:

```ts
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
```

Do not import `fas`/`far`/`fad`-wide icon objects or register a global icon library unless
the project already does so for a specific, justified reason (e.g. dynamic icon-name lookups
driven by a CMS field).

---

# Style Consistency

Pick one style per semantic use and stay consistent:

- `pro-regular` (or `pro-light`) for default UI icons
- `pro-solid` for emphasis / filled states (active nav item, selected toggle)
- `pro-duotone` only where the design system explicitly calls for it (e.g. marketing
  illustrations), not for everyday UI chrome

Do not mix styles for the same semantic icon across the app (e.g. a "chevron-right" must not
be regular in one place and solid in another without a deliberate reason).

---

# Accessibility

- A purely decorative icon MUST get `aria-hidden="true"` (FontAwesomeIcon does this by
  default when no accessible name is provided — do not override it).
- An icon that is the *only* content of an interactive element (icon-only button) MUST have
  an accessible name via `aria-label` on the button, not on the icon.

---

# CMS-Driven Icon Selection

Payload exposes an icon-select admin field (`IconSelectField`) so editors can choose an icon
by name for certain content (e.g. a feature card). When rendering a CMS-provided icon name on
the Website:

- validate the name against a known allow-list/mapping in `lib/cms/` before rendering
- fall back to a sensible default icon if the name is unknown, rather than crashing

Never `eval` or dynamically construct an import path from raw CMS string input.
