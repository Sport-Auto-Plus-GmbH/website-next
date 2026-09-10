# Bad Examples

Anti-patterns to avoid in this project, and why.

---

# Fetching Payload Directly From a Component

```tsx
// BAD — components/vehicle/listing/vehicle-list.tsx
'use client'
import { useEffect, useState } from 'react'

export function VehicleList() {
  const [vehicles, setVehicles] = useState([])

  useEffect(() => {
    fetch('https://cms.example.com/api/vehicles').then((r) => r.json()).then(setVehicles)
  }, [])

  return <div>{vehicles.map((v: any) => <div key={v.id}>{v.title}</div>)}</div>
}
```

Why this is bad: bypasses `lib/cms/`, makes this a Client Component for no reason, fetches on
every mount instead of using Server Component + Next.js caching, uses raw untyped (`any`)
Payload response instead of a `types/cms/` view type, no error/empty handling.

---

# Zustand as a Server-Data Cache

```ts
// BAD — stores/blog-posts.store.ts
export const useBlogPostsStore = create((set) => ({
  posts: [],
  fetchPosts: async () => {
    const res = await fetch('/api/blog-posts')
    set({ posts: await res.json() })
  },
}))
```

Why this is bad: Zustand is for client-only UI state, not CMS data. This duplicates Next.js's
own caching/revalidation, goes stale silently, and mixes fetching concerns into a store.

---

# Multiple Components in One File

```tsx
// BAD — components/blog/blog-post-hero.tsx
export function BlogPostHero({ post }) { /* ... */ }
export function BlogPostMeta({ post }) { /* ... */ }
export function BlogPostTags({ post }) { /* ... */ }
```

Why this is bad: violates the one-component-per-file rule (`core/AI_RULES.md`); split into
`blog-post-hero.tsx`, `blog-post-meta.tsx`, `blog-post-tags.tsx`.

---

# Mixing Icon Libraries

```tsx
// BAD
import { ChevronRight } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons'
```

Why this is bad: two icon systems in the same project. FontAwesome Pro+ is the only icon
system — use its equivalent icon instead of `lucide-react`.

---

# Hardcoded Colors Instead of Design Tokens

```tsx
// BAD
<div className="bg-[#1a2b3c] text-[#ffffff]">
```

Why this is bad: bypasses the Tailwind design tokens (`bg-primary text-primary-foreground`),
making theming and dark mode inconsistent.

---

# Swallowing Errors

```ts
// BAD
try {
  await fetchBlogPostBySlug(slug)
} catch {
  // ignore
}
```

Why this is bad: an empty catch block hides real infrastructure failures from the user and
from logs. Handle "not found" explicitly and let real failures propagate to `error.tsx`, or
log and show a meaningful fallback.
