import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchMediaList } from '@/lib/cms/media/fetch-media-list'

describe('fetchMediaList', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('maps a Payload media list response into MediaItem view models', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          docs: [
            {
              id: 1,
              alt: 'A test image',
              url: '/media/test.jpg',
              width: 800,
              height: 600,
              mimeType: 'image/jpeg',
            },
          ],
          totalDocs: 1,
        }),
      }),
    )

    const result = await fetchMediaList()

    expect(result.totalCount).toBe(1)
    expect(result.items).toEqual([
      {
        id: 1,
        alt: 'A test image',
        url: '/media/test.jpg',
        width: 800,
        height: 600,
        mimeType: 'image/jpeg',
      },
    ])
  })

  it('maps missing optional fields to null', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          docs: [{ id: 2, alt: 'No dimensions yet' }],
          totalDocs: 1,
        }),
      }),
    )

    const result = await fetchMediaList()

    expect(result.items[0]).toEqual({
      id: 2,
      alt: 'No dimensions yet',
      url: null,
      width: null,
      height: null,
      mimeType: null,
    })
  })

  it('throws when the CMS responds with a non-2xx status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    await expect(fetchMediaList()).rejects.toThrow('Failed to fetch media list: 500')
  })
})
