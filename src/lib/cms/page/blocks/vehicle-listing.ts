import { z } from 'zod'

import { mapStyledText, payloadStyledTextGroupSchema } from '@/lib/cms/page/blocks/styled-text'
import type { VehicleListingBlock } from '@/types/cms/page/blocks/vehicle-listing.types'

const DEFAULT_MAX_ITEMS = 6

export const payloadVehicleListingBlockSchema = z.object({
  id: z.string(),
  blockType: z.literal('vehicleListing'),
  heading: payloadStyledTextGroupSchema,
  subheading: payloadStyledTextGroupSchema.nullish(),
  maxItems: z.number().nullish(),
})

export type PayloadVehicleListingBlock = z.infer<typeof payloadVehicleListingBlockSchema>

export function mapVehicleListingBlock(block: PayloadVehicleListingBlock): VehicleListingBlock {
  return {
    id: block.id,
    blockType: 'vehicleListing',
    heading: mapStyledText(block.heading),
    subheading: mapStyledText(block.subheading),
    maxItems: block.maxItems ?? DEFAULT_MAX_ITEMS,
  }
}
