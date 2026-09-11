import Image from 'next/image'
import Link from 'next/link'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { FontSize } from '@/types/cms/page/blocks/styled-text.types'
import type { VehicleListingBlock } from '@/types/cms/page/blocks/vehicle-listing.types'
import type { VehicleListing as VehicleListingItem } from '@/types/datendrehscheibe/vehicle/vehicle-listing.types'

// Section-heading scale, deliberately smaller than HeroTeaser's own FONT_SIZE_CLASSES —
// same FontSize enum, different pixel values, since a section heading here should never
// be as large as a full-page hero headline.
const FONT_SIZE_CLASSES: Record<FontSize, string> = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
  '2xl': 'text-5xl',
}

type VehicleListingProps = Omit<VehicleListingBlock, 'id' | 'blockType'> & {
  vehicles: VehicleListingItem[]
}

export function VehicleListing({ heading, subheading, maxItems, vehicles }: VehicleListingProps) {
  const visibleVehicles = vehicles.slice(0, maxItems)

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-2 text-center">
        <h2
          className={`font-heading tracking-wide text-balance ${FONT_SIZE_CLASSES[heading.fontSize]}`}
          style={{ color: heading.color }}
        >
          {heading.text}
        </h2>
        {subheading.text && (
          <p
            className={`text-balance ${FONT_SIZE_CLASSES[subheading.fontSize]}`}
            style={{ color: subheading.color }}
          >
            {subheading.text}
          </p>
        )}
      </div>

      {visibleVehicles.length === 0 ? (
        <p className="text-center text-muted-foreground">Aktuell sind keine Fahrzeuge verfügbar.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleVehicles.map((vehicle) => (
            <Link key={vehicle.id} href={`/fahrzeuge/${vehicle.id}`}>
              <Card className="h-full transition-shadow hover:shadow-lg">
                {vehicle.mainImage && (
                  <Image
                    src={vehicle.mainImage}
                    alt={`${vehicle.brand} ${vehicle.carName}`}
                    width={640}
                    height={360}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="aspect-video w-full object-cover"
                  />
                )}
                <CardHeader>
                  <CardTitle>
                    {vehicle.brand} {vehicle.carName}
                  </CardTitle>
                  {vehicle.equipmentLine && (
                    <p className="text-sm text-muted-foreground">{vehicle.equipmentLine}</p>
                  )}
                </CardHeader>
                <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
                  {vehicle.mileage != null && (
                    <span>{vehicle.mileage.toLocaleString('de-DE')} km</span>
                  )}
                  {vehicle.fuelType && <span>{vehicle.fuelType}</span>}
                  {vehicle.gearbox && <span>{vehicle.gearbox}</span>}
                </CardContent>
                {vehicle.overviewPrice && (
                  <CardFooter>
                    <span className="font-heading text-lg">{vehicle.overviewPrice} €</span>
                  </CardFooter>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
