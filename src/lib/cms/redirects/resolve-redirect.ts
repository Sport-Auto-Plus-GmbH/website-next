import type { RedirectEntry } from '@/types/cms/redirects/redirect.types'

/**
 * Normalizes a path for redirect matching: leading slash, no trailing slash (except
 * root), case-insensitive. Only for matching the "from" side — the target ("to") is
 * returned unchanged.
 */
function normalizePath(path: string): string {
  if (!path) return '/'
  let normalized = path.trim()
  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`
  }
  if (normalized.length > 1) {
    normalized = normalized.replace(/\/+$/, '')
  }
  return normalized.toLowerCase()
}

/**
 * True when a redirect's target just points back at the request that triggered it —
 * e.g. an absolute custom URL (`https://sportautoplus.de/foo`) attached to `/foo` itself.
 * Without this check that would be an infinite redirect loop.
 */
function isSelfRedirect(target: string, requestPath: string, requestHost: string): boolean {
  const currentPath = normalizePath(requestPath)

  if (/^https?:\/\//i.test(target)) {
    let url: URL
    try {
      url = new URL(target)
    } catch {
      return false
    }
    if (normalizePath(url.pathname) !== currentPath) {
      return false
    }
    return url.host.toLowerCase() === requestHost.toLowerCase()
  }

  // Relative target — strip query/hash before comparing paths.
  const targetPath = target.split('#')[0].split('?')[0]
  return normalizePath(targetPath) === currentPath
}

/**
 * Finds the redirect target for a request path, or null if there's no match or the
 * match would just redirect back to the same request (see isSelfRedirect).
 */
export function resolveRedirectTarget(
  requestPath: string,
  requestHost: string,
  redirects: RedirectEntry[],
): string | null {
  const normalized = normalizePath(requestPath)
  const match = redirects.find((redirect) => normalizePath(redirect.from) === normalized)

  if (!match) {
    return null
  }

  return isSelfRedirect(match.to, requestPath, requestHost) ? null : match.to
}
