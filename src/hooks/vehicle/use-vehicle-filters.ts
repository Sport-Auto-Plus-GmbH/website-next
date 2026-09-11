'use client'

import type { VehicleFilterCriteria } from '@/lib/vehicle/filter-vehicles'
import { useVehicleFilterStore } from '@/stores/vehicle-filter.store'

/**
 * Reads the current filter selections from vehicle-filter.store.ts as a plain criteria
 * object for filter-vehicles.ts. This project's usual vehicle-filter flow additionally
 * syncs filters to the URL and re-fetches server-side (see .ai/examples/
 * PROJECT_EXAMPLES.md's "Vehicle Listing Filter Flow") — skipped here deliberately: the
 * Datendrehscheibe's listing endpoint takes no query params at all (see its generated
 * `getVehicles` operation), so the full list is always fetched regardless, and filtering
 * happens entirely client-side against that already-fetched list instead.
 */
export function useVehicleFilters(): VehicleFilterCriteria {
  const selectedBrand = useVehicleFilterStore((state) => state.selectedBrand)
  const selectedFuelType = useVehicleFilterStore((state) => state.selectedFuelType)
  const selectedGearbox = useVehicleFilterStore((state) => state.selectedGearbox)
  const selectedMaxPrice = useVehicleFilterStore((state) => state.selectedMaxPrice)

  return {
    brand: selectedBrand,
    fuelType: selectedFuelType,
    gearbox: selectedGearbox,
    maxPrice: selectedMaxPrice,
  }
}
