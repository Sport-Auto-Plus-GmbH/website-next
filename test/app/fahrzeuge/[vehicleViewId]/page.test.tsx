import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const { fetchVehicleDetail, notFound } = vi.hoisted(() => ({
  fetchVehicleDetail: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

vi.mock('@/lib/datendrehscheibe/vehicle/fetch-vehicle-detail', () => ({ fetchVehicleDetail }))
vi.mock('next/navigation', () => ({ notFound }))

import VehicleDetailPage from '@/app/fahrzeuge/[vehicleViewId]/page'

function buildProps(vehicleViewId: string): Parameters<typeof VehicleDetailPage>[0] {
  return { params: Promise.resolve({ vehicleViewId }) } as Parameters<typeof VehicleDetailPage>[0]
}

const fullVehicle = {
  id: 10,
  brand: 'BMW',
  carName: '320d',
  equipmentLine: 'M Sport',
  labels: ['Premium'],
  mainImage: 'https://cdn.example.com/bmw.jpg',
  images: ['https://cdn.example.com/bmw-1.jpg', 'https://cdn.example.com/bmw-2.jpg'],
  overviewPrice: '399',
  wasPrice: '449',
  subscriptionRate: '399',
  mileage: 5000,
  fuelType: 'Diesel',
  gearbox: 'Automatik',
  vehicleType: 'Limousine',
  drivetrain: 'Hinterradantrieb',
  seats: 5,
  doors: 4,
  horsepower: 190,
  co2Emissions: '120',
  location: ['Bonn'],
  availableFrom: null,
  availableUntil: null,
  equipment: {
    navigation: true,
    panoramicRoof: false,
    seatHeating: true,
    camera360: false,
    parkingAssist: true,
  },
}

describe('VehicleDetailPage', () => {
  it('renders vehicle details', async () => {
    fetchVehicleDetail.mockResolvedValue(fullVehicle)

    const jsx = await VehicleDetailPage(buildProps('10'))
    render(jsx)

    expect(screen.getByText('BMW 320d')).toBeTruthy()
    expect(screen.getByText('M Sport')).toBeTruthy()
    expect(screen.getByText('Premium')).toBeTruthy()
    expect(screen.getByText('399 €')).toBeTruthy()
    expect(screen.getByText('449 €')).toBeTruthy()
    expect(screen.getByText('Navigation')).toBeTruthy()
    expect(screen.queryByText('Panoramadach')).not.toBeInTheDocument()
    expect(fetchVehicleDetail).toHaveBeenCalledWith(10)
  })

  it('calls notFound() for a non-numeric id without fetching', async () => {
    await expect(VehicleDetailPage(buildProps('not-a-number'))).rejects.toThrow('NEXT_NOT_FOUND')

    expect(fetchVehicleDetail).not.toHaveBeenCalled()
  })

  it('calls notFound() when the vehicle does not exist', async () => {
    fetchVehicleDetail.mockResolvedValue(null)

    await expect(VehicleDetailPage(buildProps('999'))).rejects.toThrow('NEXT_NOT_FOUND')
  })
})
