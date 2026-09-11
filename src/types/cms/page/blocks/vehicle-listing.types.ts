import type { StyledText } from '@/types/cms/page/blocks/styled-text.types'

export interface VehicleListingBlock {
  id: string
  blockType: 'vehicleListing'
  heading: StyledText
  subheading: StyledText
  maxItems: number
}
