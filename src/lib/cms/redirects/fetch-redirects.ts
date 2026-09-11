import { PAYLOAD_API_URL } from '@/lib/cms/config'
import type { RedirectEntry } from '@/types/cms/redirects/redirect.types'

interface PayloadListResponse<T> {
  docs: T[]
}

interface PayloadRedirectDoc {
  id: number
  from: string
  to: {
    type: 'reference' | 'custom'
    reference?: {
      relationTo: 'pages'
      value: number | { slug: string }
    } | null
    url?: string | null
  }
}

// Matches payload-next's own resolvePageLivePreviewUrl.ts convention: the "home"-slugged
// page is the site root, every other slug is its own top-level path.
function resolveInternalPagePath(slug: string): string {
  return slug === 'home' ? '/' : `/${slug}`
}

function mapRedirect(doc: PayloadRedirectDoc): RedirectEntry | null {
  if (doc.to.type === 'custom') {
    return doc.to.url ? { from: doc.from, to: doc.to.url } : null
  }

  const reference = doc.to.reference?.value
  // Unpopulated (a bare ID, meaning depth=1 wasn't honored) or the referenced page was
  // since deleted — either way there's no resolvable target, so skip rather than crash.
  if (!reference || typeof reference !== 'object') {
    return null
  }

  return { from: doc.from, to: resolveInternalPagePath(reference.slug) }
}

/**
 * Fetches every editor-managed redirect (payload-next's Redirects collection).
 * `limit=0` disables pagination (returns everything — see Payload's own find operation);
 * `depth=1` populates an internal-page target's `slug` so it can be resolved to a path.
 * Cached for up to an hour, invalidated immediately by payload-next's
 * `revalidateRedirectsAfterChange`/`AfterDelete` hooks (tag "redirects") — see
 * .ai/backend/CMS_CLIENT.md.
 */
export async function fetchRedirects(): Promise<RedirectEntry[]> {
  const response = await fetch(`${PAYLOAD_API_URL}/api/redirects?limit=0&depth=1`, {
    next: { revalidate: 3600, tags: ['redirects'] },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch redirects: ${response.status}`)
  }

  const data: PayloadListResponse<PayloadRedirectDoc> = await response.json()
  return data.docs
    .map(mapRedirect)
    .filter((redirect): redirect is RedirectEntry => redirect !== null)
}
