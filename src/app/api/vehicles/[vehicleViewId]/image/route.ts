import type { NextRequest } from 'next/server'

import { fetchVehicleDetail } from '@/lib/datendrehscheibe/vehicle/fetch-vehicle-detail'

/**
 * Proxies a vehicle photo through this Website's own origin instead of exposing the
 * Datendrehscheibe/HubSpot CDN URL (a signed, time-limited link) directly to the browser —
 * `vehicleViewId` and `index` are the only client-visible identifiers; the actual upstream
 * URL is resolved server-side and never appears in any client-visible request.
 *
 * `?index=<n>` selects `images[n]`; omitted, it serves `mainImage`.
 */
export async function GET(
  request: NextRequest,
  context: RouteContext<'/api/vehicles/[vehicleViewId]/image'>,
) {
  const { vehicleViewId } = await context.params
  const id = Number(vehicleViewId)

  if (!Number.isFinite(id)) {
    return new Response('Not Found', { status: 404 })
  }

  const vehicle = await fetchVehicleDetail(id)
  if (!vehicle) {
    return new Response('Not Found', { status: 404 })
  }

  const indexParam = request.nextUrl.searchParams.get('index')
  const imageUrl =
    indexParam === null ? vehicle.mainImage : (vehicle.images[Number(indexParam)] ?? null)

  if (!imageUrl) {
    return new Response('Not Found', { status: 404 })
  }

  const upstream = await fetch(imageUrl)
  if (!upstream.ok || !upstream.body) {
    return new Response('Not Found', { status: 404 })
  }

  return new Response(upstream.body, {
    headers: {
      'Content-Type': upstream.headers.get('content-type') ?? 'image/jpeg',
      // Matches fetchVehicleDetail's own revalidate window, so a cached vehicle response
      // and a cached image stay in sync.
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  })
}
