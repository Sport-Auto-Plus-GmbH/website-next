import { describe, expect, it } from 'vitest'

import { mapHeroTeaserBlock, payloadHeroTeaserBlockSchema } from '@/lib/cms/page/blocks/hero-teaser'

describe('payloadHeroTeaserBlockSchema', () => {
  it('accepts a valid heroTeaser block', () => {
    const result = payloadHeroTeaserBlockSchema.safeParse({
      id: 'block-1',
      blockType: 'heroTeaser',
      headline: { text: 'Willkommen', fontSize: 'xl', color: '#E94E1D' },
    })

    expect(result.success).toBe(true)
  })

  it('accepts a missing subheadline/description (both optional)', () => {
    const result = payloadHeroTeaserBlockSchema.safeParse({
      id: 'block-1',
      blockType: 'heroTeaser',
      headline: { text: 'Willkommen' },
    })

    expect(result.success).toBe(true)
  })

  it('rejects a different blockType', () => {
    const result = payloadHeroTeaserBlockSchema.safeParse({
      id: 'block-1',
      blockType: 'vehicleListing',
      headline: { text: 'Willkommen' },
    })

    expect(result.success).toBe(false)
  })

  it('rejects a missing required headline', () => {
    const result = payloadHeroTeaserBlockSchema.safeParse({
      id: 'block-1',
      blockType: 'heroTeaser',
    })

    expect(result.success).toBe(false)
  })
})

describe('mapHeroTeaserBlock', () => {
  it('maps a parsed block', () => {
    const result = mapHeroTeaserBlock({
      id: 'block-1',
      blockType: 'heroTeaser',
      headline: { text: 'Willkommen', fontSize: 'xl', color: '#E94E1D' },
    })

    expect(result).toEqual({
      id: 'block-1',
      blockType: 'heroTeaser',
      headline: { text: 'Willkommen', fontSize: 'xl', color: '#E94E1D' },
      subheadline: { text: '', fontSize: 'md', color: '#323E48' },
      description: { text: '', fontSize: 'md', color: '#323E48' },
    })
  })
})
