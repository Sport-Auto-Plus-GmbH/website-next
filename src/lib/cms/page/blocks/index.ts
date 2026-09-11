import { z } from 'zod'

import type { PageBlock } from '@/types/cms/page/page.types'
import type { RawBlock } from '@/types/cms/page/raw-block.types'
import type { VideoTeaserDefaults } from '@/types/cms/page/blocks/video-teaser.types'

import { mapHeroTeaserBlock, payloadHeroTeaserBlockSchema } from './hero-teaser'
import {
  mapVideoTeaserBlock,
  payloadVideoTeaserBlockSchema,
  type PayloadVideoTeaserBlock,
} from './video-teaser'
import { mapVehicleListingBlock, payloadVehicleListingBlockSchema } from './vehicle-listing'

export interface BlockMappingContext {
  videoTeaserDefaults?: VideoTeaserDefaults
}

type BlockMapper = (raw: RawBlock, context: BlockMappingContext) => PageBlock | null

/**
 * Type-erases a block's own strictly-typed mapper into the shape the registry below
 * needs. Safe: blockMappers only ever calls a mapper after blockSchema below has already
 * validated `raw` against that exact blockType's schema.
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
  heroTeaser: asMapper(mapHeroTeaserBlock),
  vehicleListing: asMapper(mapVehicleListingBlock),
  videoTeaser: (raw, { videoTeaserDefaults }) =>
    mapVideoTeaserBlock(raw as PayloadVideoTeaserBlock, videoTeaserDefaults),
}

/**
 * Validates a raw block against its own blockType's schema before it's ever handed to a
 * mapper — see .ai/backend/VALIDATION.md's "Payload blocks with a discriminated blockType"
 * as the intended use case for a Zod discriminated union. An unrecognized blockType (a
 * block payload-next added that this Website doesn't render yet) fails to parse here
 * exactly like a malformed known one — fetch-page-by-slug.ts's mapBlock treats both the
 * same way: skip rather than crash the page.
 */
export const blockSchema = z.discriminatedUnion('blockType', [
  payloadHeroTeaserBlockSchema,
  payloadVehicleListingBlockSchema,
  payloadVideoTeaserBlockSchema,
])
