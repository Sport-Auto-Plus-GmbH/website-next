import { describe, expect, it } from 'vitest'

import { filterVehicles, type VehicleFilterCriteria } from '@/lib/vehicle/filter-vehicles'
import type { VehicleListing } from '@/types/datendrehscheibe/vehicle/vehicle-listing.types'

const NO_FILTER: VehicleFilterCriteria = {
  brand: null,
  fuelType: null,
  gearbox: null,
  maxPrice: null,
}

const vehicles: VehicleListing[] = [
  {
    id: 1,
    brand: 'BMW',
    carName: '320d',
    equipmentLine: null,
    mainImage: null,
    overviewPrice: '399',
    mileage: 5000,
    fuelType: 'Diesel',
    gearbox: 'Automatik',
    vehicleType: 'Limousine',
  },
  {
    id: 2,
    brand: 'Audi',
    carName: 'A4',
    equipmentLine: null,
    mainImage: null,
    overviewPrice: '599',
    mileage: 10000,
    fuelType: 'Benzin',
    gearbox: 'Schalter',
    vehicleType: 'Limousine',
  },
  {
    id: 3,
    brand: 'BMW',
    carName: 'i4',
    equipmentLine: null,
    mainImage: null,
    overviewPrice: null,
    mileage: 2000,
    fuelType: 'Elektro',
    gearbox: 'Automatik',
    vehicleType: 'Limousine',
  },
]

describe('filterVehicles', () => {
  it('returns every vehicle when no filter is set', () => {
    expect(filterVehicles(vehicles, NO_FILTER)).toEqual(vehicles)
  })

  it('filters by brand', () => {
    const result = filterVehicles(vehicles, { ...NO_FILTER, brand: 'BMW' })

    expect(result.map((v) => v.id)).toEqual([1, 3])
  })

  it('filters by fuelType', () => {
    const result = filterVehicles(vehicles, { ...NO_FILTER, fuelType: 'Benzin' })

    expect(result.map((v) => v.id)).toEqual([2])
  })

  it('filters by gearbox', () => {
    const result = filterVehicles(vehicles, { ...NO_FILTER, gearbox: 'Schalter' })

    expect(result.map((v) => v.id)).toEqual([2])
  })

  it('filters by maxPrice, excluding vehicles with no parseable price', () => {
    const result = filterVehicles(vehicles, { ...NO_FILTER, maxPrice: 500 })

    expect(result.map((v) => v.id)).toEqual([1])
  })

  it('combines multiple filters', () => {
    const result = filterVehicles(vehicles, { ...NO_FILTER, brand: 'BMW', fuelType: 'Elektro' })

    expect(result.map((v) => v.id)).toEqual([3])
  })

  it('returns an empty array when nothing matches', () => {
    const result = filterVehicles(vehicles, { ...NO_FILTER, brand: 'Porsche' })

    expect(result).toEqual([])
  })
})
