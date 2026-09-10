import { PAYLOAD_API_URL } from '@/lib/cms/config'
import type { CorporateIdentity } from '@/types/cms/corporate-identity/corporate-identity.types'

const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/

// Matches the real Sport Auto Plus CD values (and payload-next's own field defaults) —
// used whenever the CMS is unreachable-but-ok (empty field) or returns an invalid value.
const DEFAULT_COLORS = {
  primary: '#E94E1D',
  secondary: '#323E48',
  destructive: '#990000',
} as const

const DEFAULT_LOGO_URL = '/cd/logo/sport-auto-plus-logo.svg'

interface PayloadCorporateIdentityResponse {
  logo?: { url?: string | null } | number | null
  colors?: {
    primary?: string
    secondary?: string
    destructive?: string
  }
}

function sanitizeHexColor(value: string | undefined, fallback: string): string {
  return value && HEX_COLOR_PATTERN.test(value) ? value : fallback
}

function resolveLogoUrl(logo: PayloadCorporateIdentityResponse['logo']): string {
  if (typeof logo === 'object' && logo?.url) {
    return logo.url.startsWith('http') ? logo.url : `${PAYLOAD_API_URL}${logo.url}`
  }
  return DEFAULT_LOGO_URL
}

function mapCorporateIdentityResponse(data: PayloadCorporateIdentityResponse): CorporateIdentity {
  return {
    colors: {
      primary: sanitizeHexColor(data.colors?.primary, DEFAULT_COLORS.primary),
      secondary: sanitizeHexColor(data.colors?.secondary, DEFAULT_COLORS.secondary),
      destructive: sanitizeHexColor(data.colors?.destructive, DEFAULT_COLORS.destructive),
    },
    logoUrl: resolveLogoUrl(data.logo),
  }
}

export async function fetchCorporateIdentity(): Promise<CorporateIdentity> {
  const response = await fetch(`${PAYLOAD_API_URL}/api/globals/corporate-identity?depth=1`, {
    next: { revalidate: 3600, tags: ['corporate-identity'] },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch corporate identity: ${response.status}`)
  }

  const data: PayloadCorporateIdentityResponse = await response.json()
  return mapCorporateIdentityResponse(data)
}
