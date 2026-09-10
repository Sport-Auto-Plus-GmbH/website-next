import { PAYLOAD_API_URL } from '@/lib/cms/config'
import type { FontSize, Page, PageBlock, StyledText } from '@/types/cms/page/page.types'

interface PayloadListResponse<T> {
  docs: T[]
}

interface PayloadStyledTextGroup {
  text?: string | null
  fontSize?: string | null
  color?: string | null
}

interface PayloadHeroTeaserBlock {
  id: string
  blockType: 'heroTeaser'
  headline: PayloadStyledTextGroup
  subheadline?: PayloadStyledTextGroup | null
  description?: PayloadStyledTextGroup | null
}

// Payload can add a block type this Website doesn't render yet — see mapBlock below.
type PayloadPageBlock = PayloadHeroTeaserBlock | { id: string; blockType: string }

interface PayloadPageDoc {
  id: number
  title: string
  slug: string
  layout?: PayloadPageBlock[] | null
}

const VALID_FONT_SIZES: readonly FontSize[] = ['sm', 'md', 'lg', 'xl', '2xl']
const DEFAULT_FONT_SIZE: FontSize = 'md'
const DEFAULT_COLOR = '#323E48'

function mapFontSize(value: string | null | undefined): FontSize {
  return VALID_FONT_SIZES.includes(value as FontSize) ? (value as FontSize) : DEFAULT_FONT_SIZE
}

function mapStyledText(group: PayloadStyledTextGroup | null | undefined): StyledText {
  return {
    text: group?.text ?? '',
    fontSize: mapFontSize(group?.fontSize),
    color: group?.color ?? DEFAULT_COLOR,
  }
}

function mapBlock(block: PayloadPageBlock): PageBlock | null {
  switch (block.blockType) {
    case 'heroTeaser': {
      const heroTeaser = block as PayloadHeroTeaserBlock
      return {
        id: heroTeaser.id,
        blockType: 'heroTeaser',
        headline: mapStyledText(heroTeaser.headline),
        subheadline: mapStyledText(heroTeaser.subheadline),
        description: mapStyledText(heroTeaser.description),
      }
    }
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
