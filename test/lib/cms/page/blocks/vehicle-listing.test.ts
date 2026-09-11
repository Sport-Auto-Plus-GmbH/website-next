import { describe, expect, it } from 'vitest'

import { mapVehicleListingBlock } from '@/lib/cms/page/blocks/vehicle-listing'

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
