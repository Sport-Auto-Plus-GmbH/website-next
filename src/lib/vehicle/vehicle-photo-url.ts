/**
 * Builds a same-origin URL for a vehicle photo, proxied through
 * app/api/vehicles/[vehicleViewId]/image/route.ts — the actual upstream
 * (Datendrehscheibe/HubSpot) URL is never exposed to the client, only the
 * vehicleViewId and an optional gallery index are.
 */
export function vehiclePhotoUrl(vehicleViewId: number, index?: number): string {
  return index === undefined
    ? `/api/vehicles/${vehicleViewId}/image`
    : `/api/vehicles/${vehicleViewId}/image?index=${index}`
}
