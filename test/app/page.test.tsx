import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import HomePage from '@/app/page'

vi.mock('@/lib/cms/media/fetch-media-list', () => ({
  fetchMediaList: vi.fn().mockResolvedValue({ items: [], totalCount: 3 }),
}))

vi.mock('@/lib/cms/corporate-identity/fetch-corporate-identity', () => ({
  fetchCorporateIdentity: vi.fn().mockResolvedValue({
    colors: { primary: '#111111', secondary: '#222222', destructive: '#333333' },
    logoUrl: '/cd/logo/sport-auto-plus-logo.svg',
  }),
}))

describe('HomePage', () => {
  it('shows the media count fetched from the CMS', async () => {
    render(await HomePage())

    expect(screen.getByText(/3 media items found/)).toBeTruthy()
  })

  it('renders the logo from the corporate-identity global', async () => {
    render(await HomePage())

    expect(screen.getByAltText('Sport Auto Plus')).toHaveProperty(
      'src',
      expect.stringContaining('/cd/logo/sport-auto-plus-logo.svg'),
    )
  })

  it('renders every shadcn Button variant', async () => {
    render(await HomePage())

    for (const variant of ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link']) {
      expect(screen.getByText(variant)).toBeTruthy()
    }
  })
})
