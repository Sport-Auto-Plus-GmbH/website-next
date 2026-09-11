'use client'

import { RefreshRouteOnSave, useLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

import { HeroTeaser } from '@/components/landing/hero-teaser/hero-teaser'
import { VideoTeaser } from '@/components/landing/video-teaser/video-teaser'
import { VehicleListing } from '@/components/landing/vehicle-listing/vehicle-listing'
import { PAYLOAD_PUBLIC_URL } from '@/lib/cms/config'
import { mapPage, type PayloadPageDoc } from '@/lib/cms/page/fetch-page-by-slug'
import type { VehicleListing as VehicleListingItem } from '@/types/datendrehscheibe/vehicle/vehicle-listing.types'
import type { VideoTeaserDefaults } from '@/types/cms/page/blocks/video-teaser.types'

interface PageRendererProps {
  initialRawPage: PayloadPageDoc
  // The Datendrehscheibe is called server-side only. A live edit of maxItems merely
  // slices this pre-fetched list, so it does not trigger an extra API request.
  vehicles: VehicleListingItem[]
  videoTeaserDefaults: VideoTeaserDefaults
}

// Client wrapper around Payload's Live Preview protocol. The iframe posts unsaved form
// state here, while RefreshRouteOnSave refreshes server-fetched data after publishing.
export function PageRenderer({ initialRawPage, vehicles, videoTeaserDefaults }: PageRendererProps) {
  const router = useRouter()
  const { data } = useLivePreview<PayloadPageDoc>({
    initialData: initialRawPage,
    serverURL: PAYLOAD_PUBLIC_URL,
    depth: 2,
  })

  const page = mapPage(data, { videoTeaserDefaults })

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
            case 'videoTeaser':
              return <VideoTeaser key={block.id} {...block} />
            default:
              return null
          }
        })}
      </main>
    </>
  )
}
