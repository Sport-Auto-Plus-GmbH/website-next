'use client'

import { RefreshRouteOnSave, useLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

import { HeroTeaser } from '@/components/landing/hero-teaser/hero-teaser'
import { VehicleListing } from '@/components/landing/vehicle-listing/vehicle-listing'
import { PAYLOAD_PUBLIC_URL } from '@/lib/cms/config'
import { mapPage, type PayloadPageDoc } from '@/lib/cms/page/fetch-page-by-slug'
import type { VehicleListing as VehicleListingItem } from '@/types/datendrehscheibe/vehicle/vehicle-listing.types'

interface PageRendererProps {
  initialRawPage: PayloadPageDoc
  // Pre-fetched server-side (see app/page.tsx) rather than fetched here: the
  // Datendrehscheibe must only be called from a Server Component/Route Handler (see
  // .ai/backend/DATENDREHSCHEIBE_CLIENT.md), and a vehicleListing block's `maxItems` is
  // just a client-side `.slice()` over this same list — so it still updates live as an
  // editor changes it, without needing a fresh fetch per keystroke.
  vehicles: VehicleListingItem[]
}

// Client wrapper around Payload's Live Preview protocol: the admin panel posts the
// unsaved form state to this iframe on every field change, and useLivePreview re-renders
// with it — see .ai/backend/CMS_CLIENT.md's "Drafts and Live Preview". Outside the admin's
// iframe no message ever arrives, so `data` just stays the server-fetched initialRawPage.
// RefreshRouteOnSave additionally re-fetches the Server Component's data on an actual
// Save/Publish, so this same tab reflects it without a manual reload.
export function PageRenderer({ initialRawPage, vehicles }: PageRendererProps) {
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
            case 'vehicleListing':
              return <VehicleListing key={block.id} {...block} vehicles={vehicles} />
            default:
              return null
          }
        })}
      </main>
    </>
  )
}
