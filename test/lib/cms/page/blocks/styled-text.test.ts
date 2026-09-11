import { describe, expect, it } from 'vitest'

import { mapFontSize, mapStyledText } from '@/lib/cms/page/blocks/styled-text'

describe('mapFontSize', () => {
  it('passes through a valid font size', () => {
    expect(mapFontSize('xl')).toBe('xl')
  })

  it('falls back to "md" for an invalid or missing value', () => {
    expect(mapFontSize('not-a-size')).toBe('md')
    expect(mapFontSize(null)).toBe('md')
    expect(mapFontSize(undefined)).toBe('md')
  })
})

describe('mapStyledText', () => {
  it('maps a fully populated group', () => {
    expect(mapStyledText({ text: 'Hallo', fontSize: 'lg', color: '#E94E1D' })).toEqual({
      text: 'Hallo',
      fontSize: 'lg',
      color: '#E94E1D',
    })
  })

  it('defaults text/fontSize/color for a missing or null group', () => {
    expect(mapStyledText(null)).toEqual({ text: '', fontSize: 'md', color: '#323E48' })
    expect(mapStyledText(undefined)).toEqual({ text: '', fontSize: 'md', color: '#323E48' })
  })
})
