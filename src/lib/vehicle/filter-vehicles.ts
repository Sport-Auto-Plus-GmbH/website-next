import type { VehicleListing } from '@/types/datendrehscheibe/vehicle/vehicle-listing.types'

export interface VehicleFilterCriteria {
  brand: string | null
  fuelType: string | null
  gearbox: string | null
  maxPrice: number | null
}

/**
 * Applies the user's selected filters to an already-fetched vehicle list. Pure and
 * server/client-agnostic on purpose — vehicle-filter.store.ts (client-only) supplies the
 * criteria, but the filtering itself doesn't care where it runs.
 */
export function filterVehicles(
  vehicles: VehicleListing[],
  criteria: VehicleFilterCriteria,
): VehicleListing[] {
  return vehicles.filter((vehicle) => {
    if (criteria.brand && vehicle.brand !== criteria.brand) {
      return false
    }
    if (criteria.fuelType && vehicle.fuelType !== criteria.fuelType) {
      return false
    }
    if (criteria.gearbox && vehicle.gearbox !== criteria.gearbox) {
      return false
    }
    if (criteria.maxPrice != null) {
      const price = vehicle.overviewPrice ? Number(vehicle.overviewPrice) : null
      if (price == null || Number.isNaN(price) || price > criteria.maxPrice) {
        return false
      }
    }
    return true
  })
}
