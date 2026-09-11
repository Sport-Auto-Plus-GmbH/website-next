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

  it('maps a page with a vehicleListing block', async () => {
    mockFetchOnce({
      docs: [
        {
          id: 1,
          title: 'Fahrzeuge',
          slug: 'fahrzeuge',
          layout: [
            {
              id: 'block-1',
              blockType: 'vehicleListing',
              heading: { text: 'Unsere Fahrzeuge', fontSize: 'lg', color: '#323E48' },
              subheading: { text: '', fontSize: 'md', color: '#323E48' },
              maxItems: 9,
            },
          ],
        },
      ],
    })

    const result = await fetchPageBySlug('fahrzeuge')

    expect(result?.blocks[0]).toEqual({
      id: 'block-1',
      blockType: 'vehicleListing',
      heading: { text: 'Unsere Fahrzeuge', fontSize: 'lg', color: '#323E48' },
      subheading: { text: '', fontSize: 'md', color: '#323E48' },
      maxItems: 9,
    })
  })

  it('defaults maxItems for a vehicleListing block missing it', async () => {
    mockFetchOnce({
      docs: [
        {
          id: 1,
          title: 'Fahrzeuge',
          slug: 'fahrzeuge',
          layout: [
            {
              id: 'block-1',
              blockType: 'vehicleListing',
              heading: { text: 'Unsere Fahrzeuge', fontSize: 'lg', color: '#323E48' },
            },
          ],
        },
      ],
    })

    const result = await fetchPageBySlug('fahrzeuge')

    expect(result?.blocks[0]).toMatchObject({ maxItems: 6 })
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

  it('skips a known blockType that fails schema validation, without affecting other blocks', async () => {
    mockFetchOnce({
      docs: [
        {
          id: 1,
          title: 'Startseite',
          slug: 'home',
          layout: [
            // A known blockType, but missing the required "headline" field — blockSchema
            // (a Zod discriminated union) rejects this the same way it rejects an
            // unrecognized blockType, rather than crashing on a missing field.
            { id: 'block-1', blockType: 'heroTeaser' },
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
