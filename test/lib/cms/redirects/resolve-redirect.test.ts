import { describe, expect, it } from 'vitest'

import { resolveRedirectTarget } from '@/lib/cms/redirects/resolve-redirect'
import type { RedirectEntry } from '@/types/cms/redirects/redirect.types'

const redirects: RedirectEntry[] = [
  { from: '/old-path', to: '/new-path' },
  { from: '/Kontakt-Alt/', to: '/kontakt' },
  { from: '/loop', to: 'https://sportautoplus.de/loop' },
]

describe('resolveRedirectTarget', () => {
  it('finds a redirect for an exact path match', () => {
    expect(resolveRedirectTarget('/old-path', 'sportautoplus.de', redirects)).toBe('/new-path')
  })

  it('matches case-insensitively and ignores a trailing slash', () => {
    expect(resolveRedirectTarget('/kontakt-alt', 'sportautoplus.de', redirects)).toBe('/kontakt')
  })

  it('returns null when there is no match', () => {
    expect(resolveRedirectTarget('/does-not-exist', 'sportautoplus.de', redirects)).toBeNull()
  })

  it('returns null for an absolute target that just points back at the same request (self-loop)', () => {
    expect(resolveRedirectTarget('/loop', 'sportautoplus.de', redirects)).toBeNull()
  })

  it('still redirects an absolute target pointing at the same path on a different host', () => {
    expect(resolveRedirectTarget('/loop', 'other-host.example', redirects)).toBe(
      'https://sportautoplus.de/loop',
    )
  })

  it('still redirects an absolute target pointing at a different path on the same host', () => {
    const differentPath: RedirectEntry[] = [
      { from: '/loop', to: 'https://sportautoplus.de/elsewhere' },
    ]

    expect(resolveRedirectTarget('/loop', 'sportautoplus.de', differentPath)).toBe(
      'https://sportautoplus.de/elsewhere',
    )
  })

  it('treats an unparseable absolute-looking target as not a self-loop', () => {
    const malformed: RedirectEntry[] = [{ from: '/loop', to: 'https://' }]

    expect(resolveRedirectTarget('/loop', 'sportautoplus.de', malformed)).toBe('https://')
  })

  it('adds a leading slash to a redirect stored without one', () => {
    const withoutLeadingSlash: RedirectEntry[] = [{ from: 'old-path', to: '/new-path' }]

    expect(resolveRedirectTarget('/old-path', 'sportautoplus.de', withoutLeadingSlash)).toBe(
      '/new-path',
    )
  })

  it('returns null for a relative target that just points back at the same request', () => {
    const selfLoop: RedirectEntry[] = [{ from: '/same', to: '/same?utm_source=old' }]

    expect(resolveRedirectTarget('/same', 'sportautoplus.de', selfLoop)).toBeNull()
  })
})
