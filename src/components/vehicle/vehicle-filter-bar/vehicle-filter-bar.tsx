'use client'

import { Button } from '@/components/ui/button'
import { useVehicleFilterStore } from '@/stores/vehicle-filter.store'
import type { VehicleListing } from '@/types/datendrehscheibe/vehicle/vehicle-listing.types'

interface VehicleFilterBarProps {
  // The full, unfiltered list — filter options (which brands/fuel types/gearboxes show up
  // as choices) come from what's actually in this list, not a fixed/hardcoded set.
  vehicles: VehicleListing[]
}

function uniqueSorted(values: (string | null)[]): string[] {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value)))).sort()
}

const SELECT_CLASSES = 'rounded-md border border-input bg-background px-2 py-1 text-sm'

export function VehicleFilterBar({ vehicles }: VehicleFilterBarProps) {
  const selectedBrand = useVehicleFilterStore((state) => state.selectedBrand)
  const selectedFuelType = useVehicleFilterStore((state) => state.selectedFuelType)
  const selectedGearbox = useVehicleFilterStore((state) => state.selectedGearbox)
  const selectedMaxPrice = useVehicleFilterStore((state) => state.selectedMaxPrice)
  const setBrand = useVehicleFilterStore((state) => state.setBrand)
  const setFuelType = useVehicleFilterStore((state) => state.setFuelType)
  const setGearbox = useVehicleFilterStore((state) => state.setGearbox)
  const setMaxPrice = useVehicleFilterStore((state) => state.setMaxPrice)
  const reset = useVehicleFilterStore((state) => state.reset)

  const brands = uniqueSorted(vehicles.map((vehicle) => vehicle.brand))
  const fuelTypes = uniqueSorted(vehicles.map((vehicle) => vehicle.fuelType))
  const gearboxes = uniqueSorted(vehicles.map((vehicle) => vehicle.gearbox))

  return (
    <div className="flex flex-wrap items-end gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Marke
        <select
          value={selectedBrand ?? ''}
          onChange={(event) => setBrand(event.target.value || null)}
          className={SELECT_CLASSES}
        >
          <option value="">Alle</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Kraftstoff
        <select
          value={selectedFuelType ?? ''}
          onChange={(event) => setFuelType(event.target.value || null)}
          className={SELECT_CLASSES}
        >
          <option value="">Alle</option>
          {fuelTypes.map((fuelType) => (
            <option key={fuelType} value={fuelType}>
              {fuelType}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Getriebe
        <select
          value={selectedGearbox ?? ''}
          onChange={(event) => setGearbox(event.target.value || null)}
          className={SELECT_CLASSES}
        >
          <option value="">Alle</option>
          {gearboxes.map((gearbox) => (
            <option key={gearbox} value={gearbox}>
              {gearbox}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Preis bis (€)
        <input
          type="number"
          min={0}
          value={selectedMaxPrice ?? ''}
          onChange={(event) => setMaxPrice(event.target.value ? Number(event.target.value) : null)}
          className={`${SELECT_CLASSES} w-28`}
        />
      </label>

      <Button type="button" variant="outline" size="sm" onClick={() => reset()}>
        Zurücksetzen
      </Button>
    </div>
  )
}
