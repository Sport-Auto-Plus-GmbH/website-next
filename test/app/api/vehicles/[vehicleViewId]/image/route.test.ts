import { NextRequest } from 'next/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

const { fetchVehicleDetail } = vi.hoisted(() => ({ fetchVehicleDetail: vi.fn() }))

vi.mock('@/lib/datendrehscheibe/vehicle/fetch-vehicle-detail', () => ({ fetchVehicleDetail }))

import { GET } from '@/app/api/vehicles/[vehicleViewId]/image/route'

function buildRequest(url: string): NextRequest {
  return new NextRequest(url)
}

function buildContext(vehicleViewId: string): Parameters<typeof GET>[1] {
  return { params: Promise.resolve({ vehicleViewId }) } as Parameters<typeof GET>[1]
}

const vehicle = {
  id: 10,
  mainImage: 'https://cdn.example.com/main.jpg',
  images: ['https://cdn.example.com/gallery-0.jpg', 'https://cdn.example.com/gallery-1.jpg'],
}

describe('GET /api/vehicles/[vehicleViewId]/image', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('proxies the main image when no index is given', async () => {
    fetchVehicleDetail.mockResolvedValue(vehicle)
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response('image-bytes', { headers: { 'content-type': 'image/jpeg' } }),
        ),
    )

    const response = await GET(
      buildRequest('http://localhost/api/vehicles/10/image'),
      buildContext('10'),
    )

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('image/jpeg')
    expect(await response.text()).toBe('image-bytes')
    expect(fetch).toHaveBeenCalledWith('https://cdn.example.com/main.jpg')
  })

  it('proxies a gallery image by index', async () => {
    fetchVehicleDetail.mockResolvedValue(vehicle)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('gallery-bytes')))

    const response = await GET(
      buildRequest('http://localhost/api/vehicles/10/image?index=1'),
      buildContext('10'),
    )

    expect(response.status).toBe(200)
    expect(fetch).toHaveBeenCalledWith('https://cdn.example.com/gallery-1.jpg')
  })

  it('returns 404 for a non-numeric vehicleViewId without fetching', async () => {
    const response = await GET(
      buildRequest('http://localhost/api/vehicles/not-a-number/image'),
      buildContext('not-a-number'),
    )

    expect(response.status).toBe(404)
    expect(fetchVehicleDetail).not.toHaveBeenCalled()
  })

  it('returns 404 when the vehicle does not exist', async () => {
    fetchVehicleDetail.mockResolvedValue(null)

    const response = await GET(
      buildRequest('http://localhost/api/vehicles/999/image'),
      buildContext('999'),
    )

    expect(response.status).toBe(404)
  })

  it('returns 404 when the requested photo slot has no image', async () => {
    fetchVehicleDetail.mockResolvedValue({ id: 10, mainImage: null, images: [] })

    const response = await GET(
      buildRequest('http://localhost/api/vehicles/10/image'),
      buildContext('10'),
    )

    expect(response.status).toBe(404)
  })

  it('returns 404 for a gallery index out of bounds', async () => {
    fetchVehicleDetail.mockResolvedValue(vehicle)

    const response = await GET(
      buildRequest('http://localhost/api/vehicles/10/image?index=99'),
      buildContext('10'),
    )

    expect(response.status).toBe(404)
  })

  it('returns 404 when the upstream fetch fails', async () => {
    fetchVehicleDetail.mockResolvedValue(vehicle)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 404 })))

    const response = await GET(
      buildRequest('http://localhost/api/vehicles/10/image'),
      buildContext('10'),
    )

    expect(response.status).toBe(404)
  })
})
