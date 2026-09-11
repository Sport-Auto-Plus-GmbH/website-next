import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { fetchVehicleDetail } from '@/lib/datendrehscheibe/vehicle/fetch-vehicle-detail'
import { vehiclePhotoUrl } from '@/lib/vehicle/vehicle-photo-url'

const EQUIPMENT_LABELS: Record<string, string> = {
  navigation: 'Navigation',
  panoramicRoof: 'Panoramadach',
  seatHeating: 'Sitzheizung',
  camera360: '360°-Kamera',
  parkingAssist: 'Einparkhilfe',
}

export default async function VehicleDetailPage(props: PageProps<'/fahrzeuge/[vehicleViewId]'>) {
  const { vehicleViewId } = await props.params
  const id = Number(vehicleViewId)

  if (!Number.isFinite(id)) {
    notFound()
  }

  const vehicle = await fetchVehicleDetail(id)

  if (!vehicle) {
    notFound()
  }

  const activeEquipment = Object.entries(vehicle.equipment)
    .filter(([, enabled]) => enabled)
    .map(([key]) => EQUIPMENT_LABELS[key] ?? key)

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16">
      <Link href="/" className="text-sm text-primary hover:underline">
        &larr; Zurück zur Übersicht
      </Link>

      {vehicle.mainImage && (
        <Image
          src={vehiclePhotoUrl(vehicle.id)}
          alt={`${vehicle.brand} ${vehicle.carName}`}
          width={1024}
          height={576}
          sizes="(max-width: 1024px) 100vw, 896px"
          priority
          className="aspect-video w-full rounded-xl object-cover"
        />
      )}

      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-4xl tracking-wide text-balance">
          {vehicle.brand} {vehicle.carName}
        </h1>
        {vehicle.equipmentLine && (
          <p className="text-lg text-muted-foreground">{vehicle.equipmentLine}</p>
        )}
        {vehicle.labels.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {vehicle.labels.map((label) => (
              <span
                key={label}
                className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      {vehicle.overviewPrice && (
        <div className="flex items-baseline gap-3">
          <span className="font-heading text-3xl">{vehicle.overviewPrice} €</span>
          {vehicle.wasPrice && (
            <span className="text-muted-foreground line-through">{vehicle.wasPrice} €</span>
          )}
        </div>
      )}

      <dl className="grid grid-cols-2 gap-4 border-y py-6 sm:grid-cols-3">
        {vehicle.mileage != null && (
          <div>
            <dt className="text-sm text-muted-foreground">Kilometerstand</dt>
            <dd>{vehicle.mileage.toLocaleString('de-DE')} km</dd>
          </div>
        )}
        {vehicle.fuelType && (
          <div>
            <dt className="text-sm text-muted-foreground">Kraftstoff</dt>
            <dd>{vehicle.fuelType}</dd>
          </div>
        )}
        {vehicle.gearbox && (
          <div>
            <dt className="text-sm text-muted-foreground">Getriebe</dt>
            <dd>{vehicle.gearbox}</dd>
          </div>
        )}
        {vehicle.drivetrain && (
          <div>
            <dt className="text-sm text-muted-foreground">Antrieb</dt>
            <dd>{vehicle.drivetrain}</dd>
          </div>
        )}
        {vehicle.horsepower != null && (
          <div>
            <dt className="text-sm text-muted-foreground">Leistung</dt>
            <dd>{vehicle.horsepower} PS</dd>
          </div>
        )}
        {vehicle.seats != null && (
          <div>
            <dt className="text-sm text-muted-foreground">Sitze</dt>
            <dd>{vehicle.seats}</dd>
          </div>
        )}
        {vehicle.doors != null && (
          <div>
            <dt className="text-sm text-muted-foreground">Türen</dt>
            <dd>{vehicle.doors}</dd>
          </div>
        )}
        {vehicle.co2Emissions && (
          <div>
            <dt className="text-sm text-muted-foreground">CO₂-Emissionen</dt>
            <dd>{vehicle.co2Emissions} g/km</dd>
          </div>
        )}
        {vehicle.location.length > 0 && (
          <div>
            <dt className="text-sm text-muted-foreground">Verfügbar in</dt>
            <dd>{vehicle.location.join(', ')}</dd>
          </div>
        )}
      </dl>

      {activeEquipment.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-xl">Ausstattung</h2>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {activeEquipment.map((label) => (
              <li key={label} className="text-sm text-muted-foreground">
                {label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {vehicle.images.length > 1 && (
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-xl">Bilder</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {vehicle.images.map((_image, index) => (
              <Image
                key={index}
                src={vehiclePhotoUrl(vehicle.id, index)}
                alt={`${vehicle.brand} ${vehicle.carName}`}
                width={480}
                height={270}
                sizes="(max-width: 640px) 50vw, 33vw"
                className="aspect-video w-full rounded-lg object-cover"
              />
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
