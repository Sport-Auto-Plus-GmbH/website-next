'use client'

import { RefreshRouteOnSave, useLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

import { HeroTeaser } from '@/components/landing/hero-teaser/hero-teaser'
import { PAYLOAD_PUBLIC_URL } from '@/lib/cms/config'
import { mapPage, type PayloadPageDoc } from '@/lib/cms/page/fetch-page-by-slug'

interface PageRendererProps {
  initialRawPage: PayloadPageDoc
}

// Client wrapper around Payload's Live Preview protocol: the admin panel posts the
// unsaved form state to this iframe on every field change, and useLivePreview re-renders
// with it — see .ai/backend/CMS_CLIENT.md's "Drafts and Live Preview". Outside the admin's
// iframe no message ever arrives, so `data` just stays the server-fetched initialRawPage.
// RefreshRouteOnSave additionally re-fetches the Server Component's data on an actual
// Save/Publish, so this same tab reflects it without a manual reload.
export function PageRenderer({ initialRawPage }: PageRendererProps) {
  const router = useRouter()
  const { data } = useLivePreview<PayloadPageDoc>({
    initialData: initialRawPage,
    serverURL: PAYLOAD_PUBLIC_URL,
    depth: 1,
  })

  const page = mapPage(data)

  return (
    <>
      <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={PAYLOAD_PUBLIC_URL} />
      <main className="flex flex-1 flex-col">
        {page.blocks.map((block) => {
          switch (block.blockType) {
            case 'heroTeaser':
              return <HeroTeaser key={block.id} {...block} />
            default:
              return null
          }
        })}
      </main>
    </>
  )
}
