# Datendrehscheibe Client (`lib/datendrehscheibe/`)

Rules for how the Website talks to the Datendrehscheibe's HTTP API (e.g. live vehicle
inventory/pricing data). This is the single allowed integration point between the Website
and the Datendrehscheibe — mirrors `backend/CMS_CLIENT.md`'s rules for Payload, applied to
this second upstream system.

---

# The Datendrehscheibe Is a Versioned External Service

The Website MUST treat the Datendrehscheibe exactly like Payload: an external HTTP API, not
a shared codebase or a database it can reach into.

- Never assume knowledge of the Datendrehscheibe's internal database schema, services, or
  business logic — only its documented HTTP API response shape.
- Never import anything from the Datendrehscheibe repository, and never hold a connection
  string, database credential, or ORM client for its database anywhere in this repo, under
  any circumstances.
- If an exact field name or endpoint behavior is unclear, ask, or inspect a live API
  response — do not guess.

---

# One Client Layer

All `fetch` calls to the Datendrehscheibe's HTTP API MUST go through `lib/datendrehscheibe/<domain>/`.
Components, hooks, and Server Actions MUST NOT call it directly.

```
lib/datendrehscheibe/vehicle/fetch-vehicle-inventory.ts
lib/datendrehscheibe/vehicle/fetch-vehicle-price.ts
```

---

# Function Shape

Each `lib/datendrehscheibe/` function follows the same shape as a `lib/cms/` function (see
`backend/CMS_CLIENT.md`):

1. builds the request (base URL and auth from server-only env vars)
2. calls `fetch` with appropriate Next.js caching options
3. validates/parses the response into a Website-owned view type from
   `types/datendrehscheibe/`
4. throws or returns a typed error result on failure — callers must be able to handle it

```ts
export async function fetchVehicleInventory(tenantSlug: string): Promise<VehicleListing[]> {
  const response = await fetch(
    `${DATENDREHSCHEIBE_API_URL}/api/vehicles?tenant=${encodeURIComponent(tenantSlug)}`,
    {
      headers: { Authorization: `Bearer ${DATENDREHSCHEIBE_API_TOKEN}` },
      next: { revalidate: 300, tags: [`vehicle-inventory:${tenantSlug}`] },
    },
  )

  if (!response.ok) {
    throw new DataHubRequestError('vehicles', response.status)
  }

  const data = await response.json()
  return data.items.map(mapVehicleInventoryItem)
}
```

---

# Response Mapping

Never pass a raw Datendrehscheibe response into a component. Map it into a slim,
Website-owned type under `types/datendrehscheibe/<domain>/` inside a dedicated `map-*.ts`
function next to the fetch function — exactly the same discipline as `lib/cms/`.

---

# Environment Variables

Server-only, never `NEXT_PUBLIC_` (see `backend/SECURITY.md`):

```
DATENDREHSCHEIBE_API_URL=https://...
DATENDREHSCHEIBE_API_TOKEN=...
```

---

# Combining With Payload Data

Some pages need both CMS content (from Payload) and live data (from the Datendrehscheibe) —
e.g. a vehicle detail page with editorial content from Payload and live pricing from the
Datendrehscheibe. Fetch from both client layers independently (in parallel with
`Promise.all` when neither depends on the other) and combine the results in the Server
Component or a hook — never let `lib/cms/` call `lib/datendrehscheibe/` or vice versa; they
are peers, not layered on top of each other.

---

# Error Handling

- Distinguish "no data" (e.g. a vehicle no longer in stock — a legitimate, expected result)
  from an infrastructure failure (the Datendrehscheibe unreachable or erroring) — see
  `quality/ERROR_HANDLING.md`.
- Never leak a raw Datendrehscheibe error body to the client; log server-side and show a
  generic message.

---

# No Business Logic Bleed

`lib/datendrehscheibe/` only fetches and maps data. Presentation formatting (currency, dates)
belongs in `lib/shared/format/`; UI-only derived state belongs in hooks/components.
