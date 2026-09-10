import { PAYLOAD_API_URL } from '@/lib/cms/config'
import type { Page, PageBlock } from '@/types/cms/page/page.types'

import { mapHeroTeaserBlock, type PayloadHeroTeaserBlock } from './blocks/hero-teaser'

interface PayloadListResponse<T> {
  docs: T[]
}

// Payload can add a block type this Website doesn't render yet — see mapBlock below.
// Add each new block's raw type to this union as it's added under blocks/.
type PayloadPageBlock = PayloadHeroTeaserBlock | { id: string; blockType: string }

interface PayloadPageDoc {
  id: number
  title: string
  slug: string
  layout?: PayloadPageBlock[] | null
}

function mapBlock(block: PayloadPageBlock): PageBlock | null {
  switch (block.blockType) {
    case 'heroTeaser':
      return mapHeroTeaserBlock(block as PayloadHeroTeaserBlock)
    default:
      // Not yet supported on the Website — skip rather than crash the whole page.
      return null
  }
}

function mapPage(doc: PayloadPageDoc): Page {
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    blocks: (doc.layout ?? []).map(mapBlock).filter((block): block is PageBlock => block !== null),
  }
}

/**
 * Fetches a page by its slug. Returns null if no page has that slug (a legitimate
 * "not found," not an error) — see .ai/backend/CMS_CLIENT.md.
 */
export async function fetchPageBySlug(slug: string): Promise<Page | null> {
  const response = await fetch(
    `${PAYLOAD_API_URL}/api/pages?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
    { next: { revalidate: 3600, tags: [`page:${slug}`] } },
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch page "${slug}": ${response.status}`)
  }

  const data: PayloadListResponse<PayloadPageDoc> = await response.json()
  const doc = data.docs[0]

  return doc ? mapPage(doc) : null
}
