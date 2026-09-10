import { datendrehscheibeClient } from '@/lib/datendrehscheibe/client'
import type { components } from '@/lib/datendrehscheibe/generated/vehicles'
import type { VehicleListing } from '@/types/datendrehscheibe/vehicle/vehicle-listing.types'

type VehicleGetResource = components['schemas']['VehicleGetResource']

function mapVehicleListing(vehicle: VehicleGetResource): VehicleListing | null {
  if (vehicle.vehicleViewId == null || !vehicle.brand || !vehicle.carName) {
    return null
  }

  return {
    id: vehicle.vehicleViewId,
    brand: vehicle.brand,
    carName: vehicle.carName,
    equipmentLine: vehicle.equipmentLine ?? null,
    mainImage: vehicle.mainImage ?? null,
    overviewPrice: vehicle.overviewPrice ?? null,
    mileage: vehicle.mileage ?? null,
    fuelType: vehicle.fuelType ?? null,
    gearbox: vehicle.gearbox ?? null,
    vehicleType: vehicle.vehicleType ?? null,
  }
}

export async function fetchVehicleListing(): Promise<VehicleListing[]> {
  const { data, error, response } = await datendrehscheibeClient.GET('/api/vehicle/v1.0/vehicles', {
    next: { revalidate: 300, tags: ['vehicle-listing'] },
  })

  if (error) {
    throw new Error(`Failed to fetch vehicle listing: ${response.status}`)
  }

  return data.map(mapVehicleListing).filter((vehicle) => vehicle !== null)
}
