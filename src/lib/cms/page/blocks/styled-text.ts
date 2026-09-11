import { z } from 'zod'

import type { FontSize, StyledText } from '@/types/cms/page/blocks/styled-text.types'

// Zod is the source of truth for this shape (see .ai/backend/VALIDATION.md) — the type is
// derived from the schema, never declared separately, so the two can't drift apart.
export const payloadStyledTextGroupSchema = z.object({
  text: z.string().nullish(),
  fontSize: z.string().nullish(),
  color: z.string().nullish(),
})

export type PayloadStyledTextGroup = z.infer<typeof payloadStyledTextGroupSchema>

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
