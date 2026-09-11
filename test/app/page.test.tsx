import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import HomePage from '@/app/page'

const { fetchRawPageBySlug, fetchCorporateIdentity, fetchVehicleListing } = vi.hoisted(() => ({
  fetchRawPageBySlug: vi.fn(),
  fetchCorporateIdentity: vi.fn(),
  fetchVehicleListing: vi.fn(),
}))

vi.mock('@/lib/cms/page/fetch-page-by-slug', () => ({ fetchRawPageBySlug }))
vi.mock('@/lib/cms/corporate-identity/fetch-corporate-identity', () => ({ fetchCorporateIdentity }))
vi.mock('@/lib/datendrehscheibe/vehicle/fetch-vehicle-listing', () => ({ fetchVehicleListing }))
vi.mock('@/components/landing/page-renderer/page-renderer', () => ({
  PageRenderer: ({
    initialRawPage,
    vehicles,
  }: {
    initialRawPage: { title: string }
    vehicles: { brand: string }[]
  }) => (
    <div data-testid="page-renderer">
      {initialRawPage.title} ({vehicles.length} Fahrzeuge)
    </div>
  ),
}))

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetchCorporateIdentity.mockResolvedValue({ videoTeaser: {} })
  })

  it('renders the PageRenderer with the fetched "home" page', async () => {
    fetchRawPageBySlug.mockResolvedValue({ id: 1, title: 'Startseite', slug: 'home', layout: [] })

    render(await HomePage())

    expect(screen.getByTestId('page-renderer')).toHaveTextContent('Startseite (0 Fahrzeuge)')
    expect(fetchRawPageBySlug).toHaveBeenCalledWith('home')
    expect(fetchCorporateIdentity).toHaveBeenCalledOnce()
    expect(fetchVehicleListing).not.toHaveBeenCalled()
  })

  it('fetches the vehicle listing when the page has a vehicleListing block', async () => {
    fetchRawPageBySlug.mockResolvedValue({
      id: 1,
      title: 'Startseite',
      slug: 'home',
      layout: [{ id: 'block-1', blockType: 'vehicleListing' }],
    })
    fetchVehicleListing.mockResolvedValue([{ id: 1, brand: 'BMW' }])

    render(await HomePage())

    expect(screen.getByTestId('page-renderer')).toHaveTextContent('Startseite (1 Fahrzeuge)')
    expect(fetchVehicleListing).toHaveBeenCalledOnce()
  })

  it('shows a fallback message when no "home" page exists yet', async () => {
    fetchRawPageBySlug.mockResolvedValue(null)

    render(await HomePage())

    expect(screen.getByText(/Keine Startseite konfiguriert/)).toBeTruthy()
  })
})
