import type { HeroTeaserBlock } from './blocks/hero-teaser.types'

// Add each new block type to this union as it's added under blocks/.
export type PageBlock = HeroTeaserBlock

export interface Page {
  id: number
  title: string
  slug: string
  blocks: PageBlock[]
}
