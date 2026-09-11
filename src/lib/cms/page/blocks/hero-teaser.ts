import { z } from 'zod'

import { mapStyledText, payloadStyledTextGroupSchema } from '@/lib/cms/page/blocks/styled-text'
import type { HeroTeaserBlock } from '@/types/cms/page/blocks/hero-teaser.types'

export const payloadHeroTeaserBlockSchema = z.object({
  id: z.string(),
  blockType: z.literal('heroTeaser'),
  headline: payloadStyledTextGroupSchema,
  subheadline: payloadStyledTextGroupSchema.nullish(),
  description: payloadStyledTextGroupSchema.nullish(),
})

export type PayloadHeroTeaserBlock = z.infer<typeof payloadHeroTeaserBlockSchema>

export function mapHeroTeaserBlock(block: PayloadHeroTeaserBlock): HeroTeaserBlock {
  return {
    id: block.id,
    blockType: 'heroTeaser',
    headline: mapStyledText(block.headline),
    subheadline: mapStyledText(block.subheadline),
    description: mapStyledText(block.description),
  }
}
