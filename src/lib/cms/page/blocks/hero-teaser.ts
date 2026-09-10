import type {
  FontSize,
  HeroTeaserBlock,
  StyledText,
} from '@/types/cms/page/blocks/hero-teaser.types'

export interface PayloadStyledTextGroup {
  text?: string | null
  fontSize?: string | null
  color?: string | null
}

export interface PayloadHeroTeaserBlock {
  id: string
  blockType: 'heroTeaser'
  headline: PayloadStyledTextGroup
  subheadline?: PayloadStyledTextGroup | null
  description?: PayloadStyledTextGroup | null
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

export function mapHeroTeaserBlock(block: PayloadHeroTeaserBlock): HeroTeaserBlock {
  return {
    id: block.id,
    blockType: 'heroTeaser',
    headline: mapStyledText(block.headline),
    subheadline: mapStyledText(block.subheadline),
    description: mapStyledText(block.description),
  }
}
