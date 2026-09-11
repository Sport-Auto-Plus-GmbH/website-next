import type { HeroTeaserBlock } from './blocks/hero-teaser.types'
import type { VehicleListingBlock } from './blocks/vehicle-listing.types'
import type { VideoTeaserBlock } from './blocks/video-teaser.types'

// Add each new block type to this union as it's added under blocks/.
export type PageBlock = HeroTeaserBlock | VehicleListingBlock | VideoTeaserBlock

export interface Page {
  id: number
  title: string
  slug: string
  blocks: PageBlock[]
}
