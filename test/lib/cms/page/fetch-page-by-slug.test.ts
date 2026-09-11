import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchPageBySlug } from '@/lib/cms/page/fetch-page-by-slug'

function mockFetchOnce(body: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => body,
    }),
  )
}

describe('fetchPageBySlug', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('maps a page with a heroTeaser block', async () => {
    mockFetchOnce({
      docs: [
        {
          id: 1,
          title: 'Startseite',
          slug: 'home',
          layout: [
            {
              id: 'block-1',
              blockType: 'heroTeaser',
              headline: { text: 'Willkommen', fontSize: 'xl', color: '#E94E1D' },
              subheadline: { text: 'Ihr Partner', fontSize: 'md', color: '#323E48' },
              description: { text: 'Mehr Infos', fontSize: 'sm', color: '#323E48' },
            },
          ],
        },
      ],
    })

    const result = await fetchPageBySlug('home')

    expect(result).toEqual({
      id: 1,
      title: 'Startseite',
      slug: 'home',
      blocks: [
        {
          id: 'block-1',
          blockType: 'heroTeaser',
          headline: { text: 'Willkommen', fontSize: 'xl', color: '#E94E1D' },
          subheadline: { text: 'Ihr Partner', fontSize: 'md', color: '#323E48' },
          description: { text: 'Mehr Infos', fontSize: 'sm', color: '#323E48' },
        },
      ],
    })
  })

  it('falls back to defaults for a missing/invalid font size or color', async () => {
    mockFetchOnce({
      docs: [
        {
          id: 1,
          title: 'Startseite',
          slug: 'home',
          layout: [
            {
              id: 'block-1',
              blockType: 'heroTeaser',
              headline: { text: 'Willkommen', fontSize: 'not-a-size', color: null },
            },
          ],
        },
      ],
    })

    const result = await fetchPageBySlug('home')

    expect(result?.blocks[0]).toMatchObject({
      headline: { text: 'Willkommen', fontSize: 'md', color: '#323E48' },
      subheadline: { text: '', fontSize: 'md', color: '#323E48' },
      description: { text: '', fontSize: 'md', color: '#323E48' },
    })
  })

  it('skips a block type the Website does not render yet', async () => {
    mockFetchOnce({
      docs: [
        {
          id: 1,
          title: 'Startseite',
          slug: 'home',
          layout: [
            { id: 'block-1', blockType: 'somethingNew' },
            {
              id: 'block-2',
              blockType: 'heroTeaser',
              headline: { text: 'Willkommen', fontSize: 'md', color: '#323E48' },
            },
          ],
        },
      ],
    })

    const result = await fetchPageBySlug('home')

    expect(result?.blocks).toHaveLength(1)
    expect(result?.blocks[0].id).toBe('block-2')
  })

  it('maps a video teaser with populated media relationships', async () => {
    mockFetchOnce({
      docs: [
        {
          id: 1,
          title: 'Startseite',
          slug: 'home',
          layout: [
            {
              id: 'video-1',
              blockType: 'videoTeaser',
              headline: { text: 'Unser Video', tag: 'h2', color: '#FFFFFF', fontSize: '2rem' },
              teaserMedia: {
                url: '/api/media/file/teaser.webp',
                alt: 'Teaserbild',
                mimeType: 'image/webp',
              },
              videoMedia: { sourceType: 'youtube', youtubeUrl: 'https://youtu.be/video-id' },
            },
          ],
        },
      ],
    })

    const result = await fetchPageBySlug('home')

    expect(result?.blocks[0]).toMatchObject({
      blockType: 'videoTeaser',
      teaserImage: { alt: 'Teaserbild' },
      video: { kind: 'youtube', embedUrl: expect.stringContaining('video-id') },
    })
  })

  it('skips a video teaser when its relationships do not contain valid image/video media', async () => {
    mockFetchOnce({
      docs: [
        {
          id: 1,
          title: 'Startseite',
          slug: 'home',
          layout: [
            {
              id: 'video-1',
              blockType: 'videoTeaser',
              teaserMedia: { url: '/api/media/file/not-an-image.mp4', mimeType: 'video/mp4' },
              videoMedia: { url: '/api/media/file/not-a-video.webp', mimeType: 'image/webp' },
            },
          ],
        },
      ],
    })

    const result = await fetchPageBySlug('home')

    expect(result?.blocks).toEqual([])
  })

  it('returns null when no page has that slug', async () => {
    mockFetchOnce({ docs: [] })

    const result = await fetchPageBySlug('does-not-exist')

    expect(result).toBeNull()
  })

  it('throws when the CMS responds with a non-2xx status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    await expect(fetchPageBySlug('home')).rejects.toThrow('Failed to fetch page "home": 500')
  })
})
