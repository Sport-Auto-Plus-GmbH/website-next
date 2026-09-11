import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PageRenderer } from '@/components/landing/page-renderer/page-renderer'
import { DEFAULT_VIDEO_TEASER_DEFAULTS } from '@/lib/cms/page/blocks/video-teaser'
import type { PayloadPageDoc } from '@/lib/cms/page/fetch-page-by-slug'

const { useLivePreview } = vi.hoisted(() => ({ useLivePreview: vi.fn() }))

vi.mock('@payloadcms/live-preview-react', () => ({
  useLivePreview,
  RefreshRouteOnSave: () => null,
}))
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }))

const initialRawPage: PayloadPageDoc = {
  id: 1,
  title: 'Startseite',
  slug: 'home',
  layout: [
    {
      id: 'block-1',
      blockType: 'heroTeaser',
      headline: { text: 'Ihr Traumauto wartet auf Sie', fontSize: 'xl', color: '#E94E1D' },
      subheadline: { text: '', fontSize: 'md', color: '#323E48' },
      description: { text: '', fontSize: 'md', color: '#323E48' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- minimal raw block fixture, only the mapped fields matter here
    } as any,
  ],
}

describe('PageRenderer', () => {
  it('renders the initial page before any live-preview update arrives', () => {
    useLivePreview.mockReturnValue({ data: initialRawPage, isLoading: true })

    render(
      <PageRenderer
        initialRawPage={initialRawPage}
        videoTeaserDefaults={DEFAULT_VIDEO_TEASER_DEFAULTS}
      />,
    )

    expect(screen.getByText('Ihr Traumauto wartet auf Sie')).toBeTruthy()
    expect(useLivePreview).toHaveBeenCalledWith(
      expect.objectContaining({ depth: 2, initialData: initialRawPage }),
    )
  })

  it('re-renders with the live-preview data once an update arrives', () => {
    const updatedRawPage: PayloadPageDoc = {
      ...initialRawPage,
      layout: [
        {
          ...(initialRawPage.layout![0] as object),
          headline: { text: 'Live editierte Headline', fontSize: 'xl', color: '#E94E1D' },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- minimal raw block fixture, only the mapped fields matter here
        } as any,
      ],
    }
    useLivePreview.mockReturnValue({ data: updatedRawPage, isLoading: false })

    render(
      <PageRenderer
        initialRawPage={initialRawPage}
        videoTeaserDefaults={DEFAULT_VIDEO_TEASER_DEFAULTS}
      />,
    )

    expect(screen.getByText('Live editierte Headline')).toBeTruthy()
  })
})
