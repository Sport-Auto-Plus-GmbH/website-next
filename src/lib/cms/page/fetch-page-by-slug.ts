import { PAYLOAD_API_URL } from '@/lib/cms/config'
import type { Page, PageBlock } from '@/types/cms/page/page.types'

import { mapHeroTeaserBlock, type PayloadHeroTeaserBlock } from './blocks/hero-teaser'

interface PayloadListResponse<T> {
  docs: T[]
}

// Payload can add a block type this Website doesn't render yet — see mapBlock below.
// Add each new block's raw type to this union as it's added under blocks/.
type PayloadPageBlock = PayloadHeroTeaserBlock | { id: string; blockType: string }

// Exported so the Live Preview client wrapper (components/landing/page-renderer/) can
// type the raw postMessage payload it receives — see mapPage below for why it also
// needs to run client-side, not just here.
export interface PayloadPageDoc {
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

/**
 * Maps a raw Payload page document into the Website's own `Page` type. Exported (not
 * just used internally by fetchPageBySlug) because Live Preview's `useLivePreview`
 * hook delivers this same raw shape client-side (the in-editor, unsaved form state,
 * sent via postMessage) — the client wrapper re-runs this same mapper on every
 * live update rather than duplicating the mapping logic.
 */
export function mapPage(doc: PayloadPageDoc): Page {
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    blocks: (doc.layout ?? []).map(mapBlock).filter((block): block is PageBlock => block !== null),
  }
}

/**
 * Fetches the raw page document by slug, with no Website-side mapping — only the
 * Live Preview client wrapper needs the raw shape (see mapPage above); everything
 * else should use fetchPageBySlug below instead.
 */
export async function fetchRawPageBySlug(slug: string): Promise<PayloadPageDoc | null> {
  const response = await fetch(
    `${PAYLOAD_API_URL}/api/pages?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
    { next: { revalidate: 3600, tags: [`page:${slug}`] } },
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch page "${slug}": ${response.status}`)
  }

  const data: PayloadListResponse<PayloadPageDoc> = await response.json()
  return data.docs[0] ?? null
}

/**
 * Fetches a page by its slug. Returns null if no page has that slug (a legitimate
 * "not found," not an error) — see .ai/backend/CMS_CLIENT.md.
 */
export async function fetchPageBySlug(slug: string): Promise<Page | null> {
  const doc = await fetchRawPageBySlug(slug)
  return doc ? mapPage(doc) : null
}
