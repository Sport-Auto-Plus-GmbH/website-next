# Zustand

Rules for client state management with Zustand in this project.

---

# What Zustand Is For

Zustand owns **client-only UI state that must be shared across components** without prop
drilling: e.g. a filter panel's selections while the user edits them, a mega-menu's open
state, a comparison list, a multi-step form's in-progress values.

Zustand MUST NOT be used to cache or store server/CMS data. CMS data flows through Server
Components and Next.js fetch caching (see `frontend/NEXTJS.md`, `backend/CMS_CLIENT.md`), not
through a store.

---

# When Not to Reach for Zustand

Before creating a store, check:

1. Can this stay local `useState` in one component? Use that.
2. Can this be passed down as props two or three levels? Do that.
3. Only if state is genuinely needed by distant, unrelated components — create a store.

Do not create a global store "just in case."

---

# One Store per Domain

```
stores/vehicle-filter.store.ts
stores/ui.store.ts
```

Do not create one giant app-wide store. Each store owns one cohesive slice of client state.

---

# Store Shape

```ts
interface VehicleFilterState {
  selectedBrand: string | null
  selectedPriceRange: [number, number] | null
  setBrand: (brand: string | null) => void
  setPriceRange: (range: [number, number] | null) => void
  reset: () => void
}

export const useVehicleFilterStore = create<VehicleFilterState>((set) => ({
  selectedBrand: null,
  selectedPriceRange: null,
  setBrand: (brand) => set({ selectedBrand: brand }),
  setPriceRange: (range) => set({ selectedPriceRange: range }),
  reset: () => set({ selectedBrand: null, selectedPriceRange: null }),
}))
```

- Actions live on the store itself, next to the state they mutate.
- Keep the state shape flat where possible; avoid deeply nested state that is hard to update
  immutably.

---

# Selectors

Select only the slice a component needs, not the whole store, to avoid unnecessary
re-renders:

```ts
const selectedBrand = useVehicleFilterStore((state) => state.selectedBrand)
```

Avoid `const store = useVehicleFilterStore()` in components that only need one or two
fields.

---

# Server/Client Boundary

Zustand stores are client-only. Never read or write a store from a Server Component, Server
Action, or Route Handler. Initialize a store's state from server-fetched data by passing it
into a Client Component as props, not by importing the store on the server.

---

# Persistence

Only persist a store to `localStorage`/`sessionStorage` (via Zustand's `persist` middleware)
when there is a genuine product reason (e.g. remembering a comparison list across visits).
Do not persist ephemeral UI state (open/closed panels) by default.

---

# Testing

Stores with non-trivial logic SHOULD have a test under `test/stores/`. Reset store state
between tests to avoid cross-test leakage (create the store fresh per test, or call a
`reset()` action in `beforeEach`).
