import { mapStyledText, type PayloadStyledTextGroup } from '@/lib/cms/page/blocks/styled-text'
import type { VehicleListingBlock } from '@/types/cms/page/blocks/vehicle-listing.types'

const DEFAULT_MAX_ITEMS = 6

export interface PayloadVehicleListingBlock {
  id: string
  blockType: 'vehicleListing'
  heading: PayloadStyledTextGroup
  subheading?: PayloadStyledTextGroup | null
  maxItems?: number | null
}

export function mapVehicleListingBlock(block: PayloadVehicleListingBlock): VehicleListingBlock {
  return {
    id: block.id,
    blockType: 'vehicleListing',
    heading: mapStyledText(block.heading),
    subheading: mapStyledText(block.subheading),
    maxItems: block.maxItems ?? DEFAULT_MAX_ITEMS,
  }
}
