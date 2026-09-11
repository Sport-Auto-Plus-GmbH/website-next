import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { VehicleListing } from '@/components/landing/vehicle-listing/vehicle-listing'
import type { VehicleListing as VehicleListingItem } from '@/types/datendrehscheibe/vehicle/vehicle-listing.types'

const vehicles: VehicleListingItem[] = [
  {
    id: 1,
    brand: 'BMW',
    carName: '320d',
    equipmentLine: 'M Sport',
    mainImage: 'https://cdn.example.com/bmw.jpg',
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
    overviewPrice: null,
    mileage: null,
    fuelType: null,
    gearbox: null,
    vehicleType: null,
  },
]

describe('VehicleListing', () => {
  it('renders the heading/subheading and every vehicle up to maxItems', () => {
    render(
      <VehicleListing
        heading={{ text: 'Unsere Fahrzeuge', fontSize: 'lg', color: '#323E48' }}
        subheading={{ text: 'Jetzt entdecken', fontSize: 'md', color: '#323E48' }}
        maxItems={2}
        vehicles={vehicles}
      />,
    )

    expect(screen.getByText('Unsere Fahrzeuge')).toBeTruthy()
    expect(screen.getByText('Jetzt entdecken')).toBeTruthy()
    expect(screen.getByText('BMW 320d')).toBeTruthy()
    expect(screen.getByText('Audi A4')).toBeTruthy()
  })

  it('slices the vehicle list to maxItems', () => {
    render(
      <VehicleListing
        heading={{ text: 'Unsere Fahrzeuge', fontSize: 'lg', color: '#323E48' }}
        subheading={{ text: '', fontSize: 'md', color: '#323E48' }}
        maxItems={1}
        vehicles={vehicles}
      />,
    )

    expect(screen.getByText('BMW 320d')).toBeTruthy()
    expect(screen.queryByText('Audi A4')).not.toBeInTheDocument()
  })

  it('links each vehicle card to its detail page', () => {
    render(
      <VehicleListing
        heading={{ text: 'Unsere Fahrzeuge', fontSize: 'lg', color: '#323E48' }}
        subheading={{ text: '', fontSize: 'md', color: '#323E48' }}
        maxItems={2}
        vehicles={vehicles}
      />,
    )

    expect(screen.getByRole('link', { name: /BMW 320d/ })).toHaveAttribute('href', '/fahrzeuge/1')
  })

  it('shows an empty state when there are no vehicles', () => {
    render(
      <VehicleListing
        heading={{ text: 'Unsere Fahrzeuge', fontSize: 'lg', color: '#323E48' }}
        subheading={{ text: '', fontSize: 'md', color: '#323E48' }}
        maxItems={6}
        vehicles={[]}
      />,
    )

    expect(screen.getByText('Aktuell sind keine Fahrzeuge verfügbar.')).toBeTruthy()
  })
})
