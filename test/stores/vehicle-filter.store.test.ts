import { beforeEach, describe, expect, it } from 'vitest'

import { useVehicleFilterStore } from '@/stores/vehicle-filter.store'

describe('useVehicleFilterStore', () => {
  beforeEach(() => {
    useVehicleFilterStore.getState().reset()
  })

  it('starts with every filter unset', () => {
    const state = useVehicleFilterStore.getState()

    expect(state.selectedBrand).toBeNull()
    expect(state.selectedFuelType).toBeNull()
    expect(state.selectedGearbox).toBeNull()
    expect(state.selectedMaxPrice).toBeNull()
  })

  it('sets each filter independently of the others', () => {
    useVehicleFilterStore.getState().setBrand('BMW')
    useVehicleFilterStore.getState().setFuelType('Diesel')
    useVehicleFilterStore.getState().setGearbox('Automatik')
    useVehicleFilterStore.getState().setMaxPrice(500)

    const state = useVehicleFilterStore.getState()
    expect(state.selectedBrand).toBe('BMW')
    expect(state.selectedFuelType).toBe('Diesel')
    expect(state.selectedGearbox).toBe('Automatik')
    expect(state.selectedMaxPrice).toBe(500)
  })

  it('reset() clears every filter back to null', () => {
    useVehicleFilterStore.getState().setBrand('BMW')
    useVehicleFilterStore.getState().setMaxPrice(500)

    useVehicleFilterStore.getState().reset()

    const state = useVehicleFilterStore.getState()
    expect(state.selectedBrand).toBeNull()
    expect(state.selectedMaxPrice).toBeNull()
  })
})
