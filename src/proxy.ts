import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { fetchRedirects } from '@/lib/cms/redirects/fetch-redirects'
import { resolveRedirectTarget } from '@/lib/cms/redirects/resolve-redirect'

/**
 * Applies editor-managed redirects (payload-next's Redirects collection) before a page
 * renders. A lookup failure must never block rendering — it's logged and the request is
 * let through instead, same "fail open" behavior as the old Angular server (server.ts).
 */
export async function proxy(request: NextRequest) {
  try {
    const redirects = await fetchRedirects()
    const target = resolveRedirectTarget(request.nextUrl.pathname, request.nextUrl.host, redirects)

    if (target) {
      const destination = new URL(target, request.url)
      // Preserve the incoming query string unless the redirect target already has its
      // own (matches the old server's behavior).
      if (!destination.search) {
        destination.search = request.nextUrl.search
      }
      return NextResponse.redirect(destination, 301)
    }
  } catch (error) {
    console.error('[redirects] Lookup failed, letting the request through:', error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}
