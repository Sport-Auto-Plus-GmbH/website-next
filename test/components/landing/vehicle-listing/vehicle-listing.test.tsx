import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { VehicleListing } from '@/components/landing/vehicle-listing/vehicle-listing'
import { useVehicleFilterStore } from '@/stores/vehicle-filter.store'
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
  beforeEach(() => {
    useVehicleFilterStore.getState().reset()
  })

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

  it("proxies the vehicle photo through this Website's own API route rather than the raw upstream URL", () => {
    render(
      <VehicleListing
        heading={{ text: 'Unsere Fahrzeuge', fontSize: 'lg', color: '#323E48' }}
        subheading={{ text: '', fontSize: 'md', color: '#323E48' }}
        maxItems={2}
        vehicles={vehicles}
      />,
    )

    const image = screen.getByRole('img', { name: 'BMW 320d' })
    // The custom loader (vehicle-photo-loader.ts) keeps this a short, direct, same-origin
    // URL — never wrapped in next/image's default /_next/image?url=<encoded>&... form.
    expect(image.getAttribute('src')).toMatch(/^\/api\/vehicles\/1\/image\?w=\d+&q=\d+$/)
    expect(image.getAttribute('src')).not.toContain('cdn.example.com')
  })

  it('shows an empty state when there are no vehicles at all', () => {
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

  it("renders a filter bar and narrows the list to the store's active selection", () => {
    useVehicleFilterStore.getState().setBrand('Audi')

    render(
      <VehicleListing
        heading={{ text: 'Unsere Fahrzeuge', fontSize: 'lg', color: '#323E48' }}
        subheading={{ text: '', fontSize: 'md', color: '#323E48' }}
        maxItems={6}
        vehicles={vehicles}
      />,
    )

    expect(screen.queryByText('BMW 320d')).not.toBeInTheDocument()
    expect(screen.getByText('Audi A4')).toBeTruthy()
  })

  it('shows a distinct empty state when a filter excludes every vehicle', () => {
    useVehicleFilterStore.getState().setBrand('Porsche')

    render(
      <VehicleListing
        heading={{ text: 'Unsere Fahrzeuge', fontSize: 'lg', color: '#323E48' }}
        subheading={{ text: '', fontSize: 'md', color: '#323E48' }}
        maxItems={6}
        vehicles={vehicles}
      />,
    )

    expect(screen.getByText('Keine Fahrzeuge entsprechen den ausgewählten Filtern.')).toBeTruthy()
  })
})
