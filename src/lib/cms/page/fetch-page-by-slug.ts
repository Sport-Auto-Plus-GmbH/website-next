import { PAYLOAD_API_URL } from '@/lib/cms/config'
import { fetchCorporateIdentity } from '@/lib/cms/corporate-identity/fetch-corporate-identity'
import type { Page, PageBlock } from '@/types/cms/page/page.types'
import type { RawBlock } from '@/types/cms/page/raw-block.types'

import { blockMappers, blockSchema, type BlockMappingContext } from './blocks'

interface PayloadListResponse<T> {
  docs: T[]
}

// Exported so the Live Preview client wrapper can type the raw postMessage payload it
// receives. The mapping deliberately runs on both server and client.
export interface PayloadPageDoc {
  id: number
  title: string
  slug: string
  layout?: RawBlock[] | null
}

function mapBlock(block: RawBlock, context: BlockMappingContext): PageBlock | null {
  const parsed = blockSchema.safeParse(block)
  // Payload can add a block type this Website doesn't render yet, or a known block can
  // arrive malformed (a field renamed/removed on one side mid-deploy). Skip it rather
  // than crashing the whole page; new blocks are registered only in blocks/index.ts.
  if (!parsed.success) {
    return null
  }

  const map = blockMappers[parsed.data.blockType]
  return map ? map(parsed.data, context) : null
}

/** Maps a raw Payload page document into the Website's own `Page` type. */
export function mapPage(doc: PayloadPageDoc, context: BlockMappingContext = {}): Page {
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    blocks: (doc.layout ?? [])
      .map((block) => mapBlock(block, context))
      .filter((block): block is PageBlock => block !== null),
  }
}

/**
 * Fetches the raw page document by slug. Live Preview needs populated media
 * relationships, therefore depth=2 is intentional.
 */
export async function fetchRawPageBySlug(slug: string): Promise<PayloadPageDoc | null> {
  const response = await fetch(
    `${PAYLOAD_API_URL}/api/pages?where[slug][equals]=${encodeURIComponent(slug)}&depth=2&limit=1`,
    { next: { revalidate: 3600, tags: [`page:${slug}`] } },
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch page "${slug}": ${response.status}`)
  }

  const data: PayloadListResponse<PayloadPageDoc> = await response.json()
  return data.docs[0] ?? null
}

/** Fetches and maps a page. A missing page is a legitimate not-found result. */
export async function fetchPageBySlug(slug: string): Promise<Page | null> {
  const doc = await fetchRawPageBySlug(slug)
  if (!doc) {
    return null
  }

  const corporateIdentity = await fetchCorporateIdentity()
  return mapPage(doc, { videoTeaserDefaults: corporateIdentity.videoTeaser })
}
