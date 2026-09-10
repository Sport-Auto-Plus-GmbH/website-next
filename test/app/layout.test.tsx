import { describe, expect, it, vi } from 'vitest'

import RootLayout from '@/app/layout'

// next/font/google's exports are compiler macros — outside Next's own build pipeline
// (i.e. under plain Vitest) they aren't real functions, so stub them with the shape
// layout.tsx actually uses (`.variable`).
vi.mock('next/font/google', () => ({
  Bebas_Neue: () => ({ variable: '--font-heading' }),
  Roboto: () => ({ variable: '--font-sans' }),
}))

vi.mock('@/lib/cms/corporate-identity/fetch-corporate-identity', () => ({
  fetchCorporateIdentity: vi.fn().mockResolvedValue({
    colors: { primary: '#111111', secondary: '#222222', destructive: '#333333' },
    logoUrl: '/cd/logo/sport-auto-plus-logo.svg',
  }),
}))

describe('RootLayout', () => {
  it('sets the CD colors as CSS custom properties on <html>', async () => {
    const element = await RootLayout({ children: null, params: Promise.resolve({}) })

    expect(element.props.style).toEqual({
      '--primary': '#111111',
      '--secondary': '#222222',
      '--destructive': '#333333',
    })
  })

  it('renders the children inside <body>', async () => {
    const element = await RootLayout({ children: 'hello', params: Promise.resolve({}) })
    const body = element.props.children

    expect(body.props.children).toBe('hello')
  })
})
