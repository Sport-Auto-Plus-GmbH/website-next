import type { StyledText } from '@/types/cms/page/blocks/styled-text.types'

export interface HeroTeaserBlock {
  id: string
  blockType: 'heroTeaser'
  headline: StyledText
  subheadline: StyledText
  description: StyledText
}
