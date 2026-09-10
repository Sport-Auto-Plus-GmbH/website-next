import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchVehicleListing } from '@/lib/datendrehscheibe/vehicle/fetch-vehicle-listing'

function mockFetchOnce(body: unknown, init?: ResponseInit) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(body), init)))
}

describe('fetchVehicleListing', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('maps a Datendrehscheibe vehicle list response into VehicleListing view models', async () => {
    mockFetchOnce([
      {
        vehicleViewId: 10,
        brand: 'Audi',
        carName: 'S-Line',
        equipmentLine: 'S-Line',
        mainImage: 'https://cdn.example.com/audi.jpg',
        overviewPrice: '159',
        mileage: 0,
        fuelType: 'Benzin-Hybrid',
        gearbox: 'schalter',
        vehicleType: 'Kleinwagen',
      },
    ])

    const result = await fetchVehicleListing()

    expect(result).toEqual([
      {
        id: 10,
        brand: 'Audi',
        carName: 'S-Line',
        equipmentLine: 'S-Line',
        mainImage: 'https://cdn.example.com/audi.jpg',
        overviewPrice: '159',
        mileage: 0,
        fuelType: 'Benzin-Hybrid',
        gearbox: 'schalter',
        vehicleType: 'Kleinwagen',
      },
    ])
  })

  it('drops entries missing required identifying fields and maps missing optional fields to null', async () => {
    mockFetchOnce([
      { vehicleViewId: 1, brand: 'VW', carName: 'Golf' },
      { brand: 'Missing vehicleViewId', carName: 'Ignored' },
    ])

    const result = await fetchVehicleListing()

    expect(result).toEqual([
      {
        id: 1,
        brand: 'VW',
        carName: 'Golf',
        equipmentLine: null,
        mainImage: null,
        overviewPrice: null,
        mileage: null,
        fuelType: null,
        gearbox: null,
        vehicleType: null,
      },
    ])
  })

  it('throws when the Datendrehscheibe responds with a non-2xx status', async () => {
    mockFetchOnce({ title: 'Internal Server Error', detail: 'boom' }, { status: 500 })

    await expect(fetchVehicleListing()).rejects.toThrow('Failed to fetch vehicle listing: 500')
  })
})
