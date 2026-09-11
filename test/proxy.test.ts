import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { fetchRedirects, resolveRedirectTarget } = vi.hoisted(() => ({
  fetchRedirects: vi.fn(),
  resolveRedirectTarget: vi.fn(),
}))

vi.mock('@/lib/cms/redirects/fetch-redirects', () => ({ fetchRedirects }))
vi.mock('@/lib/cms/redirects/resolve-redirect', () => ({ resolveRedirectTarget }))

import { proxy } from '@/proxy'

describe('proxy', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects (301) when a matching redirect is found', async () => {
    fetchRedirects.mockResolvedValue([])
    resolveRedirectTarget.mockReturnValue('/new-path')

    const request = new NextRequest('https://sportautoplus.de/old-path')
    const response = await proxy(request)

    expect(response.status).toBe(301)
    expect(response.headers.get('location')).toBe('https://sportautoplus.de/new-path')
  })

  it("preserves the incoming query string when the target doesn't have its own", async () => {
    fetchRedirects.mockResolvedValue([])
    resolveRedirectTarget.mockReturnValue('/new-path')

    const request = new NextRequest('https://sportautoplus.de/old-path?utm_source=newsletter')
    const response = await proxy(request)

    expect(response.headers.get('location')).toBe(
      'https://sportautoplus.de/new-path?utm_source=newsletter',
    )
  })

  it('does not append the incoming query string when the target already has one', async () => {
    fetchRedirects.mockResolvedValue([])
    resolveRedirectTarget.mockReturnValue('/new-path?ref=redirect')

    const request = new NextRequest('https://sportautoplus.de/old-path?utm_source=newsletter')
    const response = await proxy(request)

    expect(response.headers.get('location')).toBe('https://sportautoplus.de/new-path?ref=redirect')
  })

  it('lets the request through when there is no matching redirect', async () => {
    fetchRedirects.mockResolvedValue([])
    resolveRedirectTarget.mockReturnValue(null)

    const request = new NextRequest('https://sportautoplus.de/no-redirect')
    const response = await proxy(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
  })

  it('lets the request through when the redirect lookup fails', async () => {
    fetchRedirects.mockRejectedValue(new Error('CMS unreachable'))

    const request = new NextRequest('https://sportautoplus.de/anything')
    const response = await proxy(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
  })
})
