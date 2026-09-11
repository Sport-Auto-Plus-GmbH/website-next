import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import HomePage from '@/app/page'

const { fetchRawPageBySlug } = vi.hoisted(() => ({ fetchRawPageBySlug: vi.fn() }))
const { fetchCorporateIdentity } = vi.hoisted(() => ({ fetchCorporateIdentity: vi.fn() }))

vi.mock('@/lib/cms/page/fetch-page-by-slug', () => ({ fetchRawPageBySlug }))
vi.mock('@/lib/cms/corporate-identity/fetch-corporate-identity', () => ({ fetchCorporateIdentity }))
vi.mock('@/components/landing/page-renderer/page-renderer', () => ({
  PageRenderer: ({ initialRawPage }: { initialRawPage: { title: string } }) => (
    <div data-testid="page-renderer">{initialRawPage.title}</div>
  ),
}))

describe('HomePage', () => {
  it('renders the PageRenderer with the fetched "home" page', async () => {
    fetchRawPageBySlug.mockResolvedValue({
      id: 1,
      title: 'Startseite',
      slug: 'home',
      layout: [],
    })
    fetchCorporateIdentity.mockResolvedValue({ videoTeaser: {} })

    render(await HomePage())

    expect(screen.getByTestId('page-renderer')).toHaveTextContent('Startseite')
    expect(fetchRawPageBySlug).toHaveBeenCalledWith('home')
    expect(fetchCorporateIdentity).toHaveBeenCalledOnce()
  })

  it('shows a fallback message when no "home" page exists yet', async () => {
    fetchRawPageBySlug.mockResolvedValue(null)
    fetchCorporateIdentity.mockResolvedValue({ videoTeaser: {} })

    render(await HomePage())

    expect(screen.getByText(/Keine Startseite konfiguriert/)).toBeTruthy()
  })
})
