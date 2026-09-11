import type { HeroTeaserBlock } from '@/types/cms/page/blocks/hero-teaser.types'
import type { FontSize } from '@/types/cms/page/blocks/styled-text.types'

const FONT_SIZE_CLASSES: Record<FontSize, string> = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-5xl',
  xl: 'text-6xl',
  '2xl': 'text-7xl',
}

type HeroTeaserProps = Omit<HeroTeaserBlock, 'id' | 'blockType'>

export function HeroTeaser({ headline, subheadline, description }: HeroTeaserProps) {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-24 text-center">
      <h1
        className={`font-heading tracking-wide text-balance ${FONT_SIZE_CLASSES[headline.fontSize]}`}
        style={{ color: headline.color }}
      >
        {headline.text}
      </h1>
      {subheadline.text && (
        <p
          className={`font-heading tracking-wide text-balance ${FONT_SIZE_CLASSES[subheadline.fontSize]}`}
          style={{ color: subheadline.color }}
        >
          {subheadline.text}
        </p>
      )}
      {description.text && (
        <p
          className={`text-balance ${FONT_SIZE_CLASSES[description.fontSize]}`}
          style={{ color: description.color }}
        >
          {description.text}
        </p>
      )}
    </section>
  )
}
