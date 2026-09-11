import type { HeroTeaserBlock } from './blocks/hero-teaser.types'
import type { VideoTeaserBlock } from './blocks/video-teaser.types'

// Add each new block type to this union as it's added under blocks/.
export type PageBlock = HeroTeaserBlock | VideoTeaserBlock

export interface Page {
  id: number
  title: string
  slug: string
  blocks: PageBlock[]
}
