import { datendrehscheibeClient } from '@/lib/datendrehscheibe/client'
import type { components } from '@/lib/datendrehscheibe/generated/vehicles'
import type { VehicleDetail } from '@/types/datendrehscheibe/vehicle/vehicle-detail.types'

type VehicleGetResource = components['schemas']['VehicleGetResource']

function mapVehicleDetail(vehicle: VehicleGetResource): VehicleDetail | null {
  if (vehicle.vehicleViewId == null || !vehicle.brand || !vehicle.carName) {
    return null
  }

  return {
    id: vehicle.vehicleViewId,
    brand: vehicle.brand,
    carName: vehicle.carName,
    equipmentLine: vehicle.equipmentLine ?? null,
    labels: vehicle.labels ?? [],
    mainImage: vehicle.mainImage ?? null,
    images: vehicle.images ?? [],
    overviewPrice: vehicle.overviewPrice ?? null,
    wasPrice: vehicle.wasPrice ?? null,
    subscriptionRate: vehicle.subscriptionRate ?? null,
    mileage: vehicle.mileage ?? null,
    fuelType: vehicle.fuelType ?? null,
    gearbox: vehicle.gearbox ?? null,
    vehicleType: vehicle.vehicleType ?? null,
    drivetrain: vehicle.drivetrain ?? null,
    seats: vehicle.seats ?? null,
    doors: vehicle.doors ?? null,
    horsepower: vehicle.horsepower ?? null,
    co2Emissions: vehicle.co2Emissions ?? null,
    location: vehicle.location ?? [],
    availableFrom: vehicle.availableFrom ?? null,
    availableUntil: vehicle.availableUntil ?? null,
    equipment: {
      navigation: vehicle.navigation ?? false,
      panoramicRoof: vehicle.panoramicRoof ?? false,
      seatHeating: vehicle.seatHeating ?? false,
      camera360: vehicle.camera360 ?? false,
      parkingAssist: vehicle.parkingAssist ?? false,
    },
  }
}

/**
 * Fetches a single vehicle by its vehicleViewId. Returns null for a 404 (a legitimate
 * "not in stock/no longer available", not an error — see .ai/backend/
 * DATENDREHSCHEIBE_CLIENT.md's "Error Handling") as well as for a malformed response
 * missing a field the Website requires, same defensive stance as fetchVehicleListing.
 */
export async function fetchVehicleDetail(vehicleViewId: number): Promise<VehicleDetail | null> {
  const { data, error, response } = await datendrehscheibeClient.GET(
    '/api/vehicle/v1.0/vehicles/{vehicleViewId}',
    {
      params: { path: { vehicleViewId } },
      next: { revalidate: 300, tags: [`vehicle:${vehicleViewId}`] },
    },
  )

  if (error) {
    if (response.status === 404) {
      return null
    }
    throw new Error(`Failed to fetch vehicle ${vehicleViewId}: ${response.status}`)
  }

  return mapVehicleDetail(data)
}
