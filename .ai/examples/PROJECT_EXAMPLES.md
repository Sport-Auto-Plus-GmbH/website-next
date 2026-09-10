# Project Examples

Concrete, end-to-end examples specific to this project's domains. Extend this file as real
features are built — keep entries short and point at the actual files once they exist.

---

# Example: Rendering a Payload Page Built From Blocks

Payload's `pages` collection stores a flexible `layout` field made of blocks (see the
Payload repository's `.ai/cms/BLOCKS.md`). The Website receives the resolved `layout` array
from `lib/cms/page/fetch-page-by-slug.ts` and renders it with a block-type switch:

```tsx
// components/page/page-layout-renderer.tsx
import type { PageBlock } from '@/types/cms/page/page.types'
import { HeroBlock } from '@/components/page/blocks/hero-block'
import { FaqBlock } from '@/components/page/blocks/faq-block'

const BLOCK_COMPONENTS: Record<string, React.ComponentType<{ block: any }>> = {
  hero: HeroBlock,
  faq: FaqBlock,
}

export function PageLayoutRenderer({ blocks }: { blocks: PageBlock[] }) {
  return (
    <>
      {blocks.map((block) => {
        const BlockComponent = BLOCK_COMPONENTS[block.blockType]
        if (!BlockComponent) return null
        return <BlockComponent key={block.id} block={block} />
      })}
    </>
  )
}
```

Unknown/future block types render nothing instead of crashing the page — the Website and
Payload deploy independently, so the Website may briefly lag behind a newly added block type.

---

# Example: Tenant-Aware Requests

Some content is multi-tenant on the Payload side (see the Payload repository's
`.ai/backend/MULTI_TENANCY.md`). Resolve the tenant slug from the incoming request's host in
middleware or a layout, and pass it explicitly into every `lib/cms/` call that needs it —
never hardcode a tenant slug.

---

# Example: Vehicle Listing Filter Flow

1. `stores/vehicle-filter.store.ts` holds the user's in-progress filter selections
   (client-only).
2. `hooks/vehicle/use-vehicle-filters.ts` reads the store and derives the query params.
3. A Server Action or a client-side navigation updates the URL search params.
4. The listing page (Server Component) reads the search params and calls
   `lib/cms/vehicle/fetch-vehicle-listing.ts` with them — the actual data fetch never happens
   inside the store or the filter UI itself.
