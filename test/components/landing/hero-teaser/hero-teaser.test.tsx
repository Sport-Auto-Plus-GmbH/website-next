import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { HeroTeaser } from '@/components/landing/hero-teaser/hero-teaser'

describe('HeroTeaser', () => {
  it('renders the headline with its color', () => {
    render(
      <HeroTeaser
        headline={{ text: 'Ihr Traumauto wartet auf Sie', fontSize: 'xl', color: '#E94E1D' }}
        subheadline={{ text: '', fontSize: 'md', color: '#323E48' }}
        description={{ text: '', fontSize: 'md', color: '#323E48' }}
      />,
    )

    const headline = screen.getByText('Ihr Traumauto wartet auf Sie')
    expect(headline.tagName).toBe('H1')
    expect(headline).toHaveStyle({ color: '#E94E1D' })
  })

  it('does not render subheadline/description when their text is empty', () => {
    render(
      <HeroTeaser
        headline={{ text: 'Headline', fontSize: 'md', color: '#323E48' }}
        subheadline={{ text: '', fontSize: 'md', color: '#323E48' }}
        description={{ text: '', fontSize: 'md', color: '#323E48' }}
      />,
    )

    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument()
  })

  it('renders subheadline and description when text is present', () => {
    render(
      <HeroTeaser
        headline={{ text: 'Headline', fontSize: 'md', color: '#323E48' }}
        subheadline={{ text: 'Subheadline', fontSize: 'md', color: '#323E48' }}
        description={{ text: 'Description', fontSize: 'sm', color: '#323E48' }}
      />,
    )

    expect(screen.getByText('Subheadline')).toBeTruthy()
    expect(screen.getByText('Description')).toBeTruthy()
  })
})
