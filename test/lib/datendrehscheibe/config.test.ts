import { afterEach, describe, expect, it, vi } from 'vitest'

describe('DATENDREHSCHEIBE_API_URL', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('defaults to localhost:8080 when DATENDREHSCHEIBE_API_URL is unset', async () => {
    vi.stubEnv('DATENDREHSCHEIBE_API_URL', '')
    const { DATENDREHSCHEIBE_API_URL } = await import('@/lib/datendrehscheibe/config')

    expect(DATENDREHSCHEIBE_API_URL).toBe('http://localhost:8080')
  })

  it('uses DATENDREHSCHEIBE_API_URL when set', async () => {
    vi.stubEnv('DATENDREHSCHEIBE_API_URL', 'https://datahub.sportautoplus.de')
    const { DATENDREHSCHEIBE_API_URL } = await import('@/lib/datendrehscheibe/config')

    expect(DATENDREHSCHEIBE_API_URL).toBe('https://datahub.sportautoplus.de')
  })
})
