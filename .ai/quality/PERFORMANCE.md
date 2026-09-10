# Performance

Performance rules for this project. Readability and correctness come first; optimize only
with evidence of a real problem.

---

# Rendering

- Default to Server Components; only pay the client-JS cost where interactivity is actually
  needed (see `frontend/NEXTJS.md`).
- Prefer static rendering / ISR for content-driven pages over forcing dynamic rendering.

---

# Data Fetching

- Fetch only the fields/relationships actually needed — use Payload's `depth` and field
  selection deliberately rather than always requesting maximum depth.
- Avoid request waterfalls: fetch independent CMS resources in parallel
  (`Promise.all`) rather than sequential `await`s when one does not depend on the other.
- Rely on Next.js fetch caching/tag-based revalidation rather than re-fetching the same CMS
  resource on every render.

---

# Images

Always use `next/image` for CMS media so responsive sizes, lazy loading, and format
negotiation are handled automatically. Provide accurate `width`/`height` (or `fill` with a
sized container) to avoid layout shift.

---

# Bundle Size

- Import only the specific FontAwesome icons used (see `frontend/ICONS.md`), never a whole
  style package.
- Load genuinely heavy, non-critical client libraries via `next/dynamic` rather than in the
  main bundle.

---

# Measure Before Optimizing

Do not add caching layers, memoization, or micro-optimizations without a concrete, measured
reason (Lighthouse/Web Vitals regression, a specific slow request). Document the reason when
you do.
