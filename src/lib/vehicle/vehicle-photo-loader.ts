import type { ImageLoaderProps } from 'next/image'

/**
 * Custom next/image loader for vehicle photos (see components/vehicle/vehicle-photo/
 * vehicle-photo.tsx): appends the requested width/quality as query params onto our own
 * proxy route (app/api/vehicles/[vehicleViewId]/image/route.ts), which does the actual
 * resize via sharp — next/image's own `/_next/image` optimizer never runs for these URLs,
 * so the resulting src stays a short, same-origin `/api/vehicles/<id>/image?w=...&q=...`
 * instead of the default `/_next/image?url=<encoded>&w=...&q=...` wrapper.
 */
export function vehiclePhotoLoader({ src, width, quality }: ImageLoaderProps): string {
  const separator = src.includes('?') ? '&' : '?'
  return `${src}${separator}w=${width}&q=${quality ?? 75}`
}
