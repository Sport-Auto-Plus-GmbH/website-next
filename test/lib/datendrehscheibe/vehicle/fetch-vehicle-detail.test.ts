import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchVehicleDetail } from '@/lib/datendrehscheibe/vehicle/fetch-vehicle-detail'

function mockFetchOnce(body: unknown, init?: ResponseInit) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(body), init)))
}

describe('fetchVehicleDetail', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('maps a Datendrehscheibe vehicle detail response into a VehicleDetail view model', async () => {
    mockFetchOnce({
      vehicleViewId: 10,
      brand: 'Audi',
      carName: 'S-Line',
      equipmentLine: 'S-Line',
      labels: ['Premium'],
      mainImage: 'https://cdn.example.com/audi.jpg',
      images: ['https://cdn.example.com/audi-1.jpg'],
      overviewPrice: '159',
      wasPrice: '199',
      subscriptionRate: '159',
      mileage: 0,
      fuelType: 'Benzin-Hybrid',
      gearbox: 'schalter',
      vehicleType: 'Kleinwagen',
      drivetrain: 'Frontantrieb',
      seats: 4,
      doors: 5,
      horsepower: 150,
      co2Emissions: '120',
      location: ['Bonn'],
      availableFrom: '2025-07-23',
      availableUntil: '2025-09-29',
      navigation: true,
      panoramicRoof: false,
      seatHeating: true,
      camera360: false,
      parkingAssist: true,
    })

    const result = await fetchVehicleDetail(10)

    expect(result).toEqual({
      id: 10,
      brand: 'Audi',
      carName: 'S-Line',
      equipmentLine: 'S-Line',
      labels: ['Premium'],
      mainImage: 'https://cdn.example.com/audi.jpg',
      images: ['https://cdn.example.com/audi-1.jpg'],
      overviewPrice: '159',
      wasPrice: '199',
      subscriptionRate: '159',
      mileage: 0,
      fuelType: 'Benzin-Hybrid',
      gearbox: 'schalter',
      vehicleType: 'Kleinwagen',
      drivetrain: 'Frontantrieb',
      seats: 4,
      doors: 5,
      horsepower: 150,
      co2Emissions: '120',
      location: ['Bonn'],
      availableFrom: '2025-07-23',
      availableUntil: '2025-09-29',
      equipment: {
        navigation: true,
        panoramicRoof: false,
        seatHeating: true,
        camera360: false,
        parkingAssist: true,
      },
    })
  })

  it('maps missing optional fields to null/empty defaults', async () => {
    mockFetchOnce({ vehicleViewId: 1, brand: 'VW', carName: 'Golf' })

    const result = await fetchVehicleDetail(1)

    expect(result).toEqual({
      id: 1,
      brand: 'VW',
      carName: 'Golf',
      equipmentLine: null,
      labels: [],
      mainImage: null,
      images: [],
      overviewPrice: null,
      wasPrice: null,
      subscriptionRate: null,
      mileage: null,
      fuelType: null,
      gearbox: null,
      vehicleType: null,
      drivetrain: null,
      seats: null,
      doors: null,
      horsepower: null,
      co2Emissions: null,
      location: [],
      availableFrom: null,
      availableUntil: null,
      equipment: {
        navigation: false,
        panoramicRoof: false,
        seatHeating: false,
        camera360: false,
        parkingAssist: false,
      },
    })
  })

  it('returns null for a 404 (vehicle no longer available)', async () => {
    mockFetchOnce({ title: 'Not Found', detail: 'no vehicle' }, { status: 404 })

    const result = await fetchVehicleDetail(999)

    expect(result).toBeNull()
  })

  it('returns null when the response is missing required identifying fields', async () => {
    mockFetchOnce({ brand: 'Missing vehicleViewId', carName: 'Ignored' })

    const result = await fetchVehicleDetail(1)

    expect(result).toBeNull()
  })

  it('throws for a non-404 error status', async () => {
    mockFetchOnce({ title: 'Internal Server Error', detail: 'boom' }, { status: 500 })

    await expect(fetchVehicleDetail(1)).rejects.toThrow('Failed to fetch vehicle 1: 500')
  })
})
