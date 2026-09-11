import type { FontSize, StyledText } from '@/types/cms/page/blocks/styled-text.types'

export interface PayloadStyledTextGroup {
  text?: string | null
  fontSize?: string | null
  color?: string | null
}

const VALID_FONT_SIZES: readonly FontSize[] = ['sm', 'md', 'lg', 'xl', '2xl']
const DEFAULT_FONT_SIZE: FontSize = 'md'
const DEFAULT_COLOR = '#323E48'

export function mapFontSize(value: string | null | undefined): FontSize {
  return VALID_FONT_SIZES.includes(value as FontSize) ? (value as FontSize) : DEFAULT_FONT_SIZE
}

export function mapStyledText(group: PayloadStyledTextGroup | null | undefined): StyledText {
  return {
    text: group?.text ?? '',
    fontSize: mapFontSize(group?.fontSize),
    color: group?.color ?? DEFAULT_COLOR,
  }
}
