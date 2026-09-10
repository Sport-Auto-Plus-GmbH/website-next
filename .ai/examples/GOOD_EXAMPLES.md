# Good Examples

Reference patterns that follow this playbook. Use these as a template for new code.

---

# CMS Client Function

```ts
// lib/cms/blog/fetch-blog-post-by-slug.ts
import { CMS_URL } from '@/lib/cms/config'
import { mapBlogPostResponse } from '@/lib/cms/blog/map-blog-post-response'
import type { BlogPost } from '@/types/cms/blog/blog-post.types'

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const response = await fetch(
    `${CMS_URL}/api/blog-posts?where[slug][equals]=${encodeURIComponent(slug)}&depth=2`,
    { next: { revalidate: 3600, tags: [`blog-post:${slug}`] } },
  )

  if (response.status === 404) return null
  if (!response.ok) throw new Error(`Failed to fetch blog post: ${response.status}`)

  const data = await response.json()
  return data.docs[0] ? mapBlogPostResponse(data.docs[0]) : null
}
```

Why this is good: single responsibility, typed return, distinguishes "not found" from a
real failure, tagged for targeted revalidation, no raw CMS shape leaks past this file.

---

# Server Component Using the CMS Client

```tsx
// app/insights/[topic]/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { fetchBlogPostBySlug } from '@/lib/cms/blog/fetch-blog-post-by-slug'
import { BlogPostHero } from '@/components/blog/post/blog-post-hero'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await fetchBlogPostBySlug(params.slug)
  if (!post) notFound()

  return <BlogPostHero post={post} />
}
```

Why this is good: data fetching happens in the Server Component via `lib/cms/`, "not found"
is handled with Next.js's own convention, the component only renders.

---

# Small, Focused Zustand Store

```ts
// stores/vehicle-filter.store.ts
import { create } from 'zustand'

interface VehicleFilterState {
  selectedBrand: string | null
  setBrand: (brand: string | null) => void
  reset: () => void
}

export const useVehicleFilterStore = create<VehicleFilterState>((set) => ({
  selectedBrand: null,
  setBrand: (brand) => set({ selectedBrand: brand }),
  reset: () => set({ selectedBrand: null }),
}))
```

Why this is good: owns one cohesive piece of client-only state, actions live with the state,
no server data inside it.

---

# Composing shadcn/ui with FontAwesome

```tsx
// components/vehicle/listing/vehicle-card.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { VehicleListing } from '@/types/cms/vehicle/vehicle-listing.types'

interface VehicleCardProps {
  vehicle: VehicleListing
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Card>
      <CardContent>
        <h3 className="text-lg font-semibold">{vehicle.title}</h3>
        <p className="text-muted-foreground">{vehicle.formattedPrice}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline">
          <a href={`/fahrzeuge/${vehicle.slug}`}>
            Details
            <FontAwesomeIcon icon={faChevronRight} className="ml-2 size-4" aria-hidden="true" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
```

Why this is good: one component, composed from shadcn primitives, single FontAwesome icon
import, decorative icon marked `aria-hidden`, view type from `types/cms/`.
