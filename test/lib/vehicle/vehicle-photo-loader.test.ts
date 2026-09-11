import { describe, expect, it } from 'vitest'

import { vehiclePhotoLoader } from '@/lib/vehicle/vehicle-photo-loader'

describe('vehiclePhotoLoader', () => {
  it('appends width/quality with "?" when the src has no query string yet', () => {
    expect(vehiclePhotoLoader({ src: '/api/vehicles/1/image', width: 640, quality: 75 })).toBe(
      '/api/vehicles/1/image?w=640&q=75',
    )
  })

  it('appends width/quality with "&" when the src already has a query string', () => {
    expect(
      vehiclePhotoLoader({ src: '/api/vehicles/1/image?index=2', width: 480, quality: 60 }),
    ).toBe('/api/vehicles/1/image?index=2&w=480&q=60')
  })

  it('defaults quality to 75 when next/image omits it', () => {
    expect(vehiclePhotoLoader({ src: '/api/vehicles/1/image', width: 640 })).toBe(
      '/api/vehicles/1/image?w=640&q=75',
    )
  })
})
