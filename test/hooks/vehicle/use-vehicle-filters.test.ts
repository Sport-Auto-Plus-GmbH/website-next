import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useVehicleFilters } from '@/hooks/vehicle/use-vehicle-filters'
import { useVehicleFilterStore } from '@/stores/vehicle-filter.store'

describe('useVehicleFilters', () => {
  beforeEach(() => {
    useVehicleFilterStore.getState().reset()
  })

  it('returns every criteria field as null by default', () => {
    const { result } = renderHook(() => useVehicleFilters())

    expect(result.current).toEqual({
      brand: null,
      fuelType: null,
      gearbox: null,
      maxPrice: null,
    })
  })

  it('reflects the store after a selection changes', () => {
    const { result, rerender } = renderHook(() => useVehicleFilters())

    useVehicleFilterStore.getState().setBrand('BMW')
    useVehicleFilterStore.getState().setMaxPrice(500)
    rerender()

    expect(result.current).toEqual({
      brand: 'BMW',
      fuelType: null,
      gearbox: null,
      maxPrice: 500,
    })
  })
})
