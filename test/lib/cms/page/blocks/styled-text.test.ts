import { describe, expect, it } from 'vitest'

import {
  mapFontSize,
  mapStyledText,
  payloadStyledTextGroupSchema,
} from '@/lib/cms/page/blocks/styled-text'

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

describe('payloadStyledTextGroupSchema', () => {
  it('accepts a fully populated group', () => {
    expect(
      payloadStyledTextGroupSchema.safeParse({ text: 'Hallo', fontSize: 'lg', color: '#E94E1D' })
        .success,
    ).toBe(true)
  })

  it('accepts every field missing or null (all optional)', () => {
    expect(payloadStyledTextGroupSchema.safeParse({}).success).toBe(true)
    expect(
      payloadStyledTextGroupSchema.safeParse({ text: null, fontSize: null, color: null }).success,
    ).toBe(true)
  })

  it('rejects a non-string field', () => {
    expect(payloadStyledTextGroupSchema.safeParse({ text: 123 }).success).toBe(false)
  })
})
