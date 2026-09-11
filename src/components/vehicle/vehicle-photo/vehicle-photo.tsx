'use client'

import Image from 'next/image'

import { vehiclePhotoLoader } from '@/lib/vehicle/vehicle-photo-loader'
import { vehiclePhotoUrl } from '@/lib/vehicle/vehicle-photo-url'

interface VehiclePhotoProps {
  vehicleViewId: number
  index?: number
  alt: string
  width: number
  height: number
  sizes: string
  className?: string
  priority?: boolean
}

// Thin 'use client' wrapper so the custom `loader` prop (next/image only accepts a plain
// function from a Client Component — see NEXTJS.md's "Server Components by Default") can
// stay isolated here, instead of forcing every Server Component that shows a vehicle photo
// (the listing block, the detail page) to become a Client Component itself.
export function VehiclePhoto({
  vehicleViewId,
  index,
  alt,
  width,
  height,
  sizes,
  className,
  priority,
}: VehiclePhotoProps) {
  return (
    <Image
      loader={vehiclePhotoLoader}
      src={vehiclePhotoUrl(vehicleViewId, index)}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  )
}
