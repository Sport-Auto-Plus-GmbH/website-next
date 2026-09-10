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
  business logic — only its documented OpenAPI contract.
- Never import anything from the Datendrehscheibe repository, and never hold a connection
  string, database credential, or ORM client for its database anywhere in this repo, under
  any circumstances.
- If an exact field name or endpoint behavior is unclear, check the vendored OpenAPI spec
  (below) or ask — do not guess.

---

# The Contract Is Vendored, Type-Generated, Not Hand-Typed

The Datendrehscheibe publishes real OpenAPI 3.1 specs (Quarkus/SmallRye), one YAML file per
domain (vehicles, checkout, contracts, ...). This project vendors the ones it actually
consumes under `openapi/datendrehscheibe/` (a pinned copy, not a live reference to the
Datendrehscheibe repo — CI and other developers won't have that repo checked out) and
generates TypeScript types from them with `openapi-typescript`:

```
openapi/datendrehscheibe/api-vehicles-v1.0.yaml   vendored spec (+ its common/ refs)
src/lib/datendrehscheibe/generated/vehicles.d.ts  generated — never hand-edit
```

`pnpm generate:datendrehscheibe-types` regenerates the types from the vendored spec.

## Updating the Vendored Spec

Datendrehscheibe owns a small Node tool (`tools/openapi-sync/` in its own repo) that exports
its spec files — this repo never hardcodes Datendrehscheibe's internal module layout
(`de.saplus.datahub.api.http/src/main/openapi/...`), only that tool does. Being plain Node,
it runs the same way on every OS.

When the Datendrehscheibe's API changes:

1. `pnpm sync:datendrehscheibe` (needs the Datendrehscheibe repo checked out as a sibling
   folder — runs its `tools/openapi-sync/sync.js --domain vehicles --dest
   openapi/datendrehscheibe` and then regenerates types in one step). Without that sibling
   checkout, ask a teammate for the updated YAML file(s) and copy them into
   `openapi/datendrehscheibe/` by hand instead.
2. Review the diff.
3. Fix any type errors this surfaces in `lib/datendrehscheibe/` — that's the contract
   actually changing, not a false positive.

For local development where both repos are checked out side by side,
`pnpm dev:sync-datendrehscheibe` (in a separate terminal, alongside `pnpm dev`) watches
Datendrehscheibe's OpenAPI folder and re-syncs automatically whenever it changes.

Adding a second domain (e.g. checkout) means vendoring that spec too (`pnpm exec node
../Datendrehscheibe/tools/openapi-sync/sync.js --domain checkout --dest
openapi/datendrehscheibe`), adding a `generate:datendrehscheibe-types` step for it, and
merging its `paths` type into `lib/datendrehscheibe/client.ts` (a second `createClient` or an
intersected `paths` type —
decide when it's actually needed).

---

# One Client Layer

All requests to the Datendrehscheibe MUST go through `datendrehscheibeClient`
(`lib/datendrehscheibe/client.ts`, an `openapi-fetch` client typed against the generated
`paths`), used only from `lib/datendrehscheibe/<domain>/` functions. Components, hooks, and
Server Actions MUST NOT call it directly.

```
lib/datendrehscheibe/client.ts                       shared typed client (openapi-fetch)
lib/datendrehscheibe/vehicle/fetch-vehicle-listing.ts
```

---

# Function Shape

Each `lib/datendrehscheibe/` function follows the same shape as a `lib/cms/` function (see
`backend/CMS_CLIENT.md`):

```ts
export async function fetchVehicleListing(): Promise<VehicleListing[]> {
  const { data, error, response } = await datendrehscheibeClient.GET('/api/vehicle/v1.0/vehicles', {
    next: { revalidate: 300, tags: ['vehicle-listing'] },
  })

  if (error) {
    throw new Error(`Failed to fetch vehicle listing: ${response.status}`)
  }

  return data.map(mapVehicleListing).filter((vehicle) => vehicle !== null)
}
```

1. call the typed client with Next.js caching options
2. `openapi-fetch` returns `{ data, error, response }` — check `error`, not a thrown
   exception, for a failed request
3. map into a Website-owned view type from `types/datendrehscheibe/`, dropping/filtering any
   entries missing fields the Website actually requires
4. throw (or return a typed error result) so callers can handle infrastructure failures

---

# Response Mapping

Never pass a raw Datendrehscheibe schema type (`components['schemas'][...]` from the
generated file) into a component. Map it into a slim, Website-owned type under
`types/datendrehscheibe/<domain>/` — the generated types are an internal implementation
detail of `lib/datendrehscheibe/`, not something the rest of the app should ever import.

---

# Environment Variables

Server-only, never `NEXT_PUBLIC_` (see `backend/SECURITY.md`):

```
DATENDREHSCHEIBE_API_URL=http://localhost:8080
```

Add a token env var (e.g. `DATENDREHSCHEIBE_API_TOKEN`) if/when an endpoint actually requires
the `bearerAuth` security scheme — the general vehicle read endpoints currently don't.

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
- Never leak a raw Datendrehscheibe error body (RFC 9457 problem-details) to the client; log
  server-side and show a generic message.

---

# No Business Logic Bleed

`lib/datendrehscheibe/` only fetches and maps data. Presentation formatting (currency, dates)
belongs in `lib/shared/format/`; UI-only derived state belongs in hooks/components.
