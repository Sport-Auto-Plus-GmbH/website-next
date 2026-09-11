import { describe, expect, it } from 'vitest'

import {
  mapVehicleListingBlock,
  payloadVehicleListingBlockSchema,
} from '@/lib/cms/page/blocks/vehicle-listing'

describe('mapVehicleListingBlock', () => {
  it('maps a fully populated block', () => {
    const result = mapVehicleListingBlock({
      id: 'block-1',
      blockType: 'vehicleListing',
      heading: { text: 'Unsere Fahrzeuge', fontSize: 'lg', color: '#323E48' },
      subheading: { text: 'Jetzt entdecken', fontSize: 'md', color: '#323E48' },
      maxItems: 9,
    })

    expect(result).toEqual({
      id: 'block-1',
      blockType: 'vehicleListing',
      heading: { text: 'Unsere Fahrzeuge', fontSize: 'lg', color: '#323E48' },
      subheading: { text: 'Jetzt entdecken', fontSize: 'md', color: '#323E48' },
      maxItems: 9,
    })
  })

  it('defaults maxItems to 6 when missing', () => {
    const result = mapVehicleListingBlock({
      id: 'block-1',
      blockType: 'vehicleListing',
      heading: { text: 'Unsere Fahrzeuge', fontSize: 'lg', color: '#323E48' },
    })

    expect(result.maxItems).toBe(6)
  })

  it('defaults subheading when missing', () => {
    const result = mapVehicleListingBlock({
      id: 'block-1',
      blockType: 'vehicleListing',
      heading: { text: 'Unsere Fahrzeuge', fontSize: 'lg', color: '#323E48' },
    })

    expect(result.subheading).toEqual({ text: '', fontSize: 'md', color: '#323E48' })
  })
})

describe('payloadVehicleListingBlockSchema', () => {
  it('accepts a valid vehicleListing block', () => {
    const result = payloadVehicleListingBlockSchema.safeParse({
      id: 'block-1',
      blockType: 'vehicleListing',
      heading: { text: 'Unsere Fahrzeuge' },
      maxItems: 9,
    })

    expect(result.success).toBe(true)
  })

  it('rejects a maxItems that is not a number', () => {
    const result = payloadVehicleListingBlockSchema.safeParse({
      id: 'block-1',
      blockType: 'vehicleListing',
      heading: { text: 'Unsere Fahrzeuge' },
      maxItems: 'nine',
    })

    expect(result.success).toBe(false)
  })

  it('rejects a missing required heading', () => {
    const result = payloadVehicleListingBlockSchema.safeParse({
      id: 'block-1',
      blockType: 'vehicleListing',
    })

    expect(result.success).toBe(false)
  })
})
