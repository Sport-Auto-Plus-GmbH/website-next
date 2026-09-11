import { mapStyledText, type PayloadStyledTextGroup } from '@/lib/cms/page/blocks/styled-text'
import type { HeroTeaserBlock } from '@/types/cms/page/blocks/hero-teaser.types'

export interface PayloadHeroTeaserBlock {
  id: string
  blockType: 'heroTeaser'
  headline: PayloadStyledTextGroup
  subheadline?: PayloadStyledTextGroup | null
  description?: PayloadStyledTextGroup | null
}

export function mapHeroTeaserBlock(block: PayloadHeroTeaserBlock): HeroTeaserBlock {
  return {
    id: block.id,
    blockType: 'heroTeaser',
    headline: mapStyledText(block.headline),
    subheadline: mapStyledText(block.subheadline),
    description: mapStyledText(block.description),
  }
}
