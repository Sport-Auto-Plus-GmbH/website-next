import { afterEach, describe, expect, it, vi } from 'vitest'

describe('PAYLOAD_API_URL', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('defaults to localhost:3000 when PAYLOAD_API_URL is unset', async () => {
    vi.stubEnv('PAYLOAD_API_URL', '')
    const { PAYLOAD_API_URL } = await import('@/lib/cms/config')

    expect(PAYLOAD_API_URL).toBe('http://localhost:3000')
  })

  it('uses PAYLOAD_API_URL when set', async () => {
    vi.stubEnv('PAYLOAD_API_URL', 'https://cms.sportautoplus.de')
    const { PAYLOAD_API_URL } = await import('@/lib/cms/config')

    expect(PAYLOAD_API_URL).toBe('https://cms.sportautoplus.de')
  })
})
