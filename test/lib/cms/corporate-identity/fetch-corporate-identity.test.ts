import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchCorporateIdentity } from '@/lib/cms/corporate-identity/fetch-corporate-identity'

function mockFetchOnce(body: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => body,
    }),
  )
}

describe('fetchCorporateIdentity', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('maps valid colors and a populated logo', async () => {
    mockFetchOnce({
      colors: { primary: '#111111', secondary: '#222222', destructive: '#333333' },
      logo: { url: '/api/media/file/logo.svg' },
    })

    const result = await fetchCorporateIdentity()

    expect(result.colors).toEqual({
      primary: '#111111',
      secondary: '#222222',
      destructive: '#333333',
    })
    expect(result.logoUrl).toContain('/api/media/file/logo.svg')
  })

  it('passes through an already-absolute logo URL unchanged', async () => {
    mockFetchOnce({ colors: {}, logo: { url: 'https://cdn.example.com/logo.svg' } })

    const result = await fetchCorporateIdentity()

    expect(result.logoUrl).toBe('https://cdn.example.com/logo.svg')
  })

  it('falls back to the static logo when the global has none set', async () => {
    mockFetchOnce({ colors: {}, logo: null })

    const result = await fetchCorporateIdentity()

    expect(result.logoUrl).toBe('/cd/logo/sport-auto-plus-logo.svg')
  })

  it('falls back to the CD default colors when a color is missing or invalid', async () => {
    mockFetchOnce({ colors: { primary: 'not-a-hex-color' }, logo: null })

    const result = await fetchCorporateIdentity()

    expect(result.colors).toEqual({
      primary: '#E94E1D',
      secondary: '#323E48',
      destructive: '#990000',
    })
  })

  it('maps video-teaser defaults and falls back safely for invalid values', async () => {
    mockFetchOnce({
      videoTeaser: {
        headline: { color: '#123456', fontSize: '3rem', tag: 'h1' },
        design: { lightboxMaxWidth: '90vw', lightboxBackdropColor: 'rgba(0, 0, 0, 0.6)' },
        youtube: { consentRequired: false, consentButtonLabel: 'Externes Video laden' },
      },
    })

    const result = await fetchCorporateIdentity()

    expect(result.videoTeaser).toMatchObject({
      headline: { color: '#123456', fontSize: '3rem', tag: 'h1' },
      design: { lightboxMaxWidth: '90vw', lightboxBackdropColor: 'rgba(0, 0, 0, 0.6)' },
      youtube: { required: false, buttonLabel: 'Externes Video laden' },
    })
  })

  it('throws when the CMS responds with a non-2xx status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    await expect(fetchCorporateIdentity()).rejects.toThrow(
      'Failed to fetch corporate identity: 500',
    )
  })
})
