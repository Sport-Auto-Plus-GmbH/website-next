import { PageRenderer } from '@/components/landing/page-renderer/page-renderer'
import { fetchRawPageBySlug } from '@/lib/cms/page/fetch-page-by-slug'
import { fetchVehicleListing } from '@/lib/datendrehscheibe/vehicle/fetch-vehicle-listing'
import type { VehicleListing } from '@/types/datendrehscheibe/vehicle/vehicle-listing.types'

const HOMEPAGE_SLUG = 'home'

export default async function HomePage() {
  const rawPage = await fetchRawPageBySlug(HOMEPAGE_SLUG)

  if (!rawPage) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-muted-foreground">
          Keine Startseite konfiguriert. Lege in Payload unter &bdquo;Seiten&rdquo; eine Seite mit
          dem Slug &bdquo;home&rdquo; an.
        </p>
      </main>
    )
  }

  // Payload and the Datendrehscheibe are independent APIs, fetched separately and
  // combined here (see .ai/backend/DATENDREHSCHEIBE_CLIENT.md's "Combining With Payload
  // Data") — only hit the Datendrehscheibe at all when the page actually has a block
  // that needs it.
  const hasVehicleListing = (rawPage.layout ?? []).some(
    (block) => block.blockType === 'vehicleListing',
  )
  const vehicles: VehicleListing[] = hasVehicleListing ? await fetchVehicleListing() : []

  return <PageRenderer initialRawPage={rawPage} vehicles={vehicles} />
}
