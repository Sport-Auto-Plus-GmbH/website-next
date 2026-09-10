import { afterEach, describe, expect, it, vi } from 'vitest'

const { revalidateTag } = vi.hoisted(() => ({ revalidateTag: vi.fn() }))

vi.mock('next/cache', () => ({ revalidateTag }))

import { POST } from '@/app/api/revalidate/route'

function buildRequest(body: unknown, secretHeader?: string): Request {
  return new Request('http://localhost/api/revalidate', {
    method: 'POST',
    headers: secretHeader ? { 'x-revalidate-secret': secretHeader } : {},
    body: JSON.stringify(body),
  })
}

describe('POST /api/revalidate', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    revalidateTag.mockClear()
  })

  it('revalidates the given tag when the secret matches', async () => {
    vi.stubEnv('REVALIDATE_SECRET', 'correct-secret')

    const response = await POST(buildRequest({ tag: 'page:home' }, 'correct-secret'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({ revalidated: true, tag: 'page:home' })
    expect(revalidateTag).toHaveBeenCalledWith('page:home', 'max')
  })

  it('rejects a missing or incorrect secret', async () => {
    vi.stubEnv('REVALIDATE_SECRET', 'correct-secret')

    const response = await POST(buildRequest({ tag: 'page:home' }, 'wrong-secret'))

    expect(response.status).toBe(401)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('rejects when REVALIDATE_SECRET is not configured', async () => {
    vi.stubEnv('REVALIDATE_SECRET', '')

    const response = await POST(buildRequest({ tag: 'page:home' }, ''))

    expect(response.status).toBe(401)
  })

  it('rejects a body without a valid "tag"', async () => {
    vi.stubEnv('REVALIDATE_SECRET', 'correct-secret')

    const response = await POST(buildRequest({}, 'correct-secret'))

    expect(response.status).toBe(400)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('rejects an invalid JSON body', async () => {
    vi.stubEnv('REVALIDATE_SECRET', 'correct-secret')
    const request = new Request('http://localhost/api/revalidate', {
      method: 'POST',
      headers: { 'x-revalidate-secret': 'correct-secret' },
      body: 'not json',
    })

    const response = await POST(request)

    expect(response.status).toBe(400)
  })
})
