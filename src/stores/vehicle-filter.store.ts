import { create } from 'zustand'

// Client-only, in-progress filter selections for the vehicle listing block — see
// .ai/state/ZUSTAND.md. Never a cache for the vehicles themselves (those stay
// server-fetched); this store only ever holds what the user is currently filtering by.
interface VehicleFilterState {
  selectedBrand: string | null
  selectedFuelType: string | null
  selectedGearbox: string | null
  selectedMaxPrice: number | null
  setBrand: (brand: string | null) => void
  setFuelType: (fuelType: string | null) => void
  setGearbox: (gearbox: string | null) => void
  setMaxPrice: (maxPrice: number | null) => void
  reset: () => void
}

const initialFilterState = {
  selectedBrand: null,
  selectedFuelType: null,
  selectedGearbox: null,
  selectedMaxPrice: null,
}

export const useVehicleFilterStore = create<VehicleFilterState>((set) => ({
  ...initialFilterState,
  setBrand: (brand) => set({ selectedBrand: brand }),
  setFuelType: (fuelType) => set({ selectedFuelType: fuelType }),
  setGearbox: (gearbox) => set({ selectedGearbox: gearbox }),
  setMaxPrice: (maxPrice) => set({ selectedMaxPrice: maxPrice }),
  reset: () => set(initialFilterState),
}))
