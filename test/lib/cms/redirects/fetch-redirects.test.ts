import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchRedirects } from '@/lib/cms/redirects/fetch-redirects'

function mockFetchOnce(body: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => body,
    }),
  )
}

describe('fetchRedirects', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('maps a custom-URL redirect', async () => {
    mockFetchOnce({
      docs: [{ id: 1, from: '/old-path', to: { type: 'custom', url: 'https://example.com/new' } }],
    })

    const result = await fetchRedirects()

    expect(result).toEqual([{ from: '/old-path', to: 'https://example.com/new' }])
  })

  it("resolves an internal-page redirect to the page's path", async () => {
    mockFetchOnce({
      docs: [
        {
          id: 2,
          from: '/kontakt-alt',
          to: { type: 'reference', reference: { relationTo: 'pages', value: { slug: 'kontakt' } } },
        },
      ],
    })

    const result = await fetchRedirects()

    expect(result).toEqual([{ from: '/kontakt-alt', to: '/kontakt' }])
  })

  it('resolves a reference to the "home" page as the site root', async () => {
    mockFetchOnce({
      docs: [
        {
          id: 3,
          from: '/index.html',
          to: { type: 'reference', reference: { relationTo: 'pages', value: { slug: 'home' } } },
        },
      ],
    })

    const result = await fetchRedirects()

    expect(result).toEqual([{ from: '/index.html', to: '/' }])
  })

  it('skips a reference redirect whose target page is unpopulated or deleted', async () => {
    mockFetchOnce({
      docs: [
        {
          id: 4,
          from: '/unpopulated',
          to: { type: 'reference', reference: { relationTo: 'pages', value: 5 } },
        },
        { id: 5, from: '/no-reference', to: { type: 'reference' } },
      ],
    })

    const result = await fetchRedirects()

    expect(result).toEqual([])
  })

  it('skips a custom redirect with no url', async () => {
    mockFetchOnce({ docs: [{ id: 6, from: '/broken', to: { type: 'custom' } }] })

    const result = await fetchRedirects()

    expect(result).toEqual([])
  })

  it('skips a malformed doc without affecting the others (Zod discriminated union)', async () => {
    mockFetchOnce({
      docs: [
        // Neither a valid "reference" nor "custom" `to.type` — schema rejects it outright.
        { id: 7, from: '/broken', to: { type: 'not-a-real-type' } },
        { id: 8, from: '/old-path', to: { type: 'custom', url: 'https://example.com/new' } },
      ],
    })

    const result = await fetchRedirects()

    expect(result).toEqual([{ from: '/old-path', to: 'https://example.com/new' }])
  })

  it('throws when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    await expect(fetchRedirects()).rejects.toThrow('Failed to fetch redirects: 500')
  })
})
