import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { VehicleFilterBar } from '@/components/vehicle/vehicle-filter-bar/vehicle-filter-bar'
import { useVehicleFilterStore } from '@/stores/vehicle-filter.store'
import type { VehicleListing } from '@/types/datendrehscheibe/vehicle/vehicle-listing.types'

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
]

describe('VehicleFilterBar', () => {
  beforeEach(() => {
    useVehicleFilterStore.getState().reset()
  })

  it('lists the unique brands/fuel types/gearboxes present in the given vehicles', () => {
    render(<VehicleFilterBar vehicles={vehicles} />)

    expect(screen.getByRole('option', { name: 'BMW' })).toBeTruthy()
    expect(screen.getByRole('option', { name: 'Audi' })).toBeTruthy()
    expect(screen.getByRole('option', { name: 'Diesel' })).toBeTruthy()
    expect(screen.getByRole('option', { name: 'Automatik' })).toBeTruthy()
  })

  it('updates the store when a brand is selected', async () => {
    const user = userEvent.setup()
    render(<VehicleFilterBar vehicles={vehicles} />)

    await user.selectOptions(screen.getByLabelText('Marke'), 'BMW')

    expect(useVehicleFilterStore.getState().selectedBrand).toBe('BMW')
  })

  it('updates the store when a max price is entered', async () => {
    const user = userEvent.setup()
    render(<VehicleFilterBar vehicles={vehicles} />)

    await user.type(screen.getByLabelText('Preis bis (€)'), '500')

    expect(useVehicleFilterStore.getState().selectedMaxPrice).toBe(500)
  })

  it('resets every filter when "Zurücksetzen" is clicked', async () => {
    const user = userEvent.setup()
    useVehicleFilterStore.getState().setBrand('BMW')
    render(<VehicleFilterBar vehicles={vehicles} />)

    await user.click(screen.getByRole('button', { name: 'Zurücksetzen' }))

    expect(useVehicleFilterStore.getState().selectedBrand).toBeNull()
  })
})
