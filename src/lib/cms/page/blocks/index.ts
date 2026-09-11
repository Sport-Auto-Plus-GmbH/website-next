import type { PageBlock } from '@/types/cms/page/page.types'
import type { RawBlock } from '@/types/cms/page/raw-block.types'

import { mapHeroTeaserBlock, type PayloadHeroTeaserBlock } from './hero-teaser'
import { mapVehicleListingBlock, type PayloadVehicleListingBlock } from './vehicle-listing'

type BlockMapper = (raw: RawBlock) => PageBlock

/**
 * Type-erases a block's own strictly-typed mapper into the shape the registry below
 * needs. Safe: blockMappers only ever calls a mapper after matching its own blockType
 * key, so `raw` is always that block's real raw shape at runtime.
 */
function asMapper<T extends RawBlock>(map: (raw: T) => PageBlock): BlockMapper {
  return (raw) => map(raw as T)
}

/**
 * One entry per block, added here as it's added under blocks/ — see .ai/cms/BLOCKS.md
 * (payload-next). Keeps fetch-page-by-slug.ts itself from growing a switch/case per
 * block as more are added; it only ever looks up this registry by blockType.
 */
export const blockMappers: Record<string, BlockMapper> = {
  heroTeaser: asMapper<PayloadHeroTeaserBlock>(mapHeroTeaserBlock),
  vehicleListing: asMapper<PayloadVehicleListingBlock>(mapVehicleListingBlock),
}
