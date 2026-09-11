export interface VehicleDetail {
  id: number
  brand: string
  carName: string
  equipmentLine: string | null
  labels: string[]
  mainImage: string | null
  images: string[]
  overviewPrice: string | null
  wasPrice: string | null
  subscriptionRate: string | null
  mileage: number | null
  fuelType: string | null
  gearbox: string | null
  vehicleType: string | null
  drivetrain: string | null
  seats: number | null
  doors: number | null
  horsepower: number | null
  co2Emissions: string | null
  location: string[]
  availableFrom: string | null
  availableUntil: string | null
  equipment: {
    navigation: boolean
    panoramicRoof: boolean
    seatHeating: boolean
    camera360: boolean
    parkingAssist: boolean
  }
}
