import type { NextRequest } from 'next/server'
import sharp from 'sharp'

import { fetchVehicleDetail } from '@/lib/datendrehscheibe/vehicle/fetch-vehicle-detail'

// Bounds for the `w`/`q` params `vehicle-photo-loader.ts` sends — keeps an arbitrary
// client-supplied width/quality from forcing an oversized/wasteful sharp resize.
const MIN_WIDTH = 16
const MAX_WIDTH = 3840
const DEFAULT_QUALITY = 75

/**
 * Proxies a vehicle photo through this Website's own origin instead of exposing the
 * Datendrehscheibe/HubSpot CDN URL (a signed, time-limited link) directly to the browser —
 * `vehicleViewId` and `index` are the only client-visible identifiers; the actual upstream
 * URL is resolved server-side and never appears in any client-visible request.
 *
 * `?index=<n>` selects `images[n]`; omitted, it serves `mainImage`. `?w=`/`?q=` (sent by
 * `vehicle-photo-loader.ts`, next/image's custom loader for these photos) resize and
 * re-encode to WebP via sharp — next/image never runs its own `/_next/image` optimizer on
 * these URLs, so this route has to do that job itself.
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

  const { searchParams } = request.nextUrl
  const indexParam = searchParams.get('index')
  const imageUrl =
    indexParam === null ? vehicle.mainImage : (vehicle.images[Number(indexParam)] ?? null)

  if (!imageUrl) {
    return new Response('Not Found', { status: 404 })
  }

  const upstream = await fetch(imageUrl)
  if (!upstream.ok || !upstream.body) {
    return new Response('Not Found', { status: 404 })
  }

  const requestedWidth = Number(searchParams.get('w'))
  if (!Number.isFinite(requestedWidth) || requestedWidth <= 0) {
    // No resize requested (e.g. a direct hit outside next/image) — stream the original
    // through unchanged.
    return new Response(upstream.body, {
      headers: {
        'Content-Type': upstream.headers.get('content-type') ?? 'image/jpeg',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    })
  }

  const width = Math.min(Math.max(requestedWidth, MIN_WIDTH), MAX_WIDTH)
  const requestedQuality = Number(searchParams.get('q'))
  const quality =
    Number.isFinite(requestedQuality) && requestedQuality > 0 && requestedQuality <= 100
      ? requestedQuality
      : DEFAULT_QUALITY

  const original = Buffer.from(await upstream.arrayBuffer())
  const resized = await sharp(original)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toBuffer()

  return new Response(resized, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  })
}
