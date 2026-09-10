import { revalidateTag } from 'next/cache'

/**
 * Webhook Payload calls after a Page/global changes so the Website's cached fetch
 * (`next: { tags: [...] }`) doesn't have to wait out its `revalidate` window — see
 * .ai/backend/ROUTE_HANDLERS.md and .ai/backend/SECURITY.md's "Webhooks" section.
 */
export async function POST(request: Request): Promise<Response> {
  const secret = request.headers.get('x-revalidate-secret')
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let tag: unknown
  try {
    ;({ tag } = await request.json())
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (typeof tag !== 'string' || tag.length === 0) {
    return Response.json({ error: '"tag" must be a non-empty string' }, { status: 400 })
  }

  // "max" = revalidate immediately, the most aggressive of Next.js's revalidation
  // profiles — exactly what an explicit webhook call after a content change wants.
  revalidateTag(tag, 'max')

  return Response.json({ revalidated: true, tag })
}
