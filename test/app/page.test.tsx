import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import HomePage from '@/app/page'

const { fetchPageBySlug } = vi.hoisted(() => ({ fetchPageBySlug: vi.fn() }))

vi.mock('@/lib/cms/page/fetch-page-by-slug', () => ({ fetchPageBySlug }))

describe('HomePage', () => {
  it('renders the heroTeaser block of the "home" page', async () => {
    fetchPageBySlug.mockResolvedValue({
      id: 1,
      title: 'Startseite',
      slug: 'home',
      blocks: [
        {
          id: 'block-1',
          blockType: 'heroTeaser',
          headline: { text: 'Ihr Traumauto wartet auf Sie', fontSize: 'xl', color: '#E94E1D' },
          subheadline: { text: '', fontSize: 'md', color: '#323E48' },
          description: { text: '', fontSize: 'md', color: '#323E48' },
        },
      ],
    })

    render(await HomePage())

    expect(screen.getByText('Ihr Traumauto wartet auf Sie')).toBeTruthy()
    expect(fetchPageBySlug).toHaveBeenCalledWith('home')
  })

  it('shows a fallback message when no "home" page exists yet', async () => {
    fetchPageBySlug.mockResolvedValue(null)

    render(await HomePage())

    expect(screen.getByText(/Keine Startseite konfiguriert/)).toBeTruthy()
  })
})
