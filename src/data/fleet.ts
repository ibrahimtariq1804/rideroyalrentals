export const categories = [
  'economy',
  'sedan',
  'suv',
  'premium',
  'group',
] as const

export type VehicleCategory = (typeof categories)[number]

export const driveModes = ['self-drive', 'chauffeur', 'both'] as const
export type DriveMode = (typeof driveModes)[number]

export const transmissions = ['automatic', 'manual', 'both'] as const
export type Transmission = (typeof transmissions)[number]

export const intendedUses = [
  'city',
  'airport',
  'intercity',
  'wedding',
  'corporate',
  'family',
  'group',
] as const
export type IntendedUse = (typeof intendedUses)[number]

export type Vehicle = {
  slug: string
  name: string
  maker: string
  category: VehicleCategory
  seats: number
  transmission: Transmission
  driveMode: DriveMode
  intendedUses: IntendedUse[]
  summary: string
  description: string
  features: string[]
  specs: { label: string; value: string }[]
  highlights: string[]
  luggageCapacity: string
  fuelType: string
  engineCapacity: string
  acType: string
  doors: number
  /** Published daily rate from live inventory listing (PKR). Confirmed again at quote. */
  ratePerDay: number | null
  detail: string
  heroImage: string
  altImage: string
  gallery: string[]
  sample: boolean
  orbit?: boolean
}

export const categoryLabels: Record<VehicleCategory, string> = {
  economy: 'Economy',
  sedan: 'Sedan',
  suv: 'SUV / 4x4 & Crossover',
  premium: 'Luxury & Protocol',
  group: 'Vans & Coaches',
}

export const fleetDisclaimer =
  'Fleet names and models match the published inventory photos. Final availability and quote are confirmed when you book.'

const img = (file: string) => `/images/fleet/hires/${file}`

type Seed = {
  slug: string
  file: string
  name: string
  maker: string
  category: VehicleCategory
  seats: number
  transmission: Transmission
  driveMode: DriveMode
  intendedUses: IntendedUse[]
  detail: string
  ratePerDay: number | null
  fuelType?: string
  engineCapacity?: string
  luggageCapacity?: string
  orbit?: boolean
}

function build(seed: Seed): Vehicle {
  const rateLabel = seed.ratePerDay == null ? 'Quote on request' : `Rs. ${seed.ratePerDay.toLocaleString('en-PK')} / day`

  // Smart defaults for car specifications
  const isVan = seed.category === 'group'
  const isSuv = seed.category === 'suv' || seed.category === 'premium'
  const isEconomy = seed.category === 'economy'

  const fuel = seed.fuelType ?? (
    seed.slug.includes('aqua') ? 'Hybrid (Petrol / Electric)' :
    (isVan || seed.slug.includes('vigo') || seed.slug.includes('revo') || seed.slug.includes('prado') || seed.slug.includes('land-cruiser')) ? 'Diesel' :
    'Petrol'
  )

  const engine = seed.engineCapacity ?? (
    seed.slug.includes('alto') ? '660cc EFI' :
    seed.slug.includes('vitz') ? '1000cc VVT-i' :
    seed.slug.includes('wagon-r') ? '1000cc K-Series DOHC' :
    seed.slug.includes('aqua') ? '1500cc Hybrid Synergy Drive' :
    seed.slug.includes('yaris') ? '1300cc / 1500cc Dual VVT-i' :
    seed.slug.includes('city') ? '1300cc i-VTEC' :
    seed.slug.includes('gli') ? '1300cc VVT-i' :
    seed.slug.includes('altis') ? '1600cc Dual VVT-i' :
    seed.slug.includes('grande') ? '1800cc Dual VVT-i CVT' :
    seed.slug.includes('civic') ? '1800cc / 1500cc Turbo' :
    seed.slug.includes('brv') ? '1500cc i-VTEC' :
    seed.slug.includes('vigo') ? '2500cc - 3000cc D4D Diesel' :
    seed.slug.includes('revo') ? '2800cc 1GD Turbo Diesel' :
    seed.slug.includes('prado') ? '2700cc - 3000cc Dual VVT-i / Diesel' :
    seed.slug.includes('land-cruiser') ? '4500cc - 4600cc V8 Twin Turbo Diesel' :
    seed.slug.includes('hiace') ? '3000cc Turbo Diesel' :
    seed.slug.includes('coaster') ? '4200cc 1HZ Diesel' :
    seed.slug.includes('mercedes') ? '2000cc Turbo BlueTEC' :
    seed.slug.includes('audi') ? '2000cc TFSI Turbo' :
    '1800cc EFI'
  )

  const luggage = seed.luggageCapacity ?? (
    isEconomy ? '1 Large Suitcase + 1 Carry-on' :
    isVan ? '8 - 14 Large Luggage Bags' :
    isSuv ? '4 - 6 Large Travel Bags' :
    '2 - 3 Large Suitcases'
  )

  const ac = isVan ? 'Dual High-Output Air Conditioning (Front & Rear)' : 'Dual-Zone Climate Control AC'

  const desc = `${seed.name} (${seed.detail}) is fully maintained, sanitized, and ready for deployment in Islamabad, Rawalpindi, airport transfers, and outstation trips across Pakistan. Available with professional chauffeur or self-drive at guaranteed transparent rates.`

  const highlights = [
    'Cleaned, sanitized and checked before handover',
    '24/7 Roadside assistance & immediate replacement vehicle support',
    'Professional, uniformed & route-experienced chauffeur available',
    'Doorstep delivery anywhere in Islamabad & Rawalpindi',
    'Self-drive rental with straightforward verification',
  ]

  return {
    slug: seed.slug,
    name: seed.name,
    maker: seed.maker,
    category: seed.category,
    seats: seed.seats,
    transmission: seed.transmission,
    driveMode: seed.driveMode,
    intendedUses: seed.intendedUses,
    summary: `${seed.name} — ${seed.detail}.`,
    description: desc,
    features: [seed.detail, categoryLabels[seed.category], rateLabel],
    specs: [
      { label: 'Vehicle Name', value: seed.name },
      { label: 'Model / Variant', value: seed.detail },
      { label: 'Published Rate', value: rateLabel },
      { label: 'Seating Capacity', value: `${seed.seats} Passengers` },
      { label: 'Engine Capacity', value: engine },
      { label: 'Fuel Type', value: fuel },
      { label: 'Transmission', value: seed.transmission === 'automatic' ? 'Automatic' : seed.transmission === 'manual' ? 'Manual' : 'Automatic / Manual' },
      { label: 'Air Conditioning', value: ac },
      { label: 'Luggage Room', value: luggage },
      { label: 'Service Options', value: seed.driveMode === 'chauffeur' ? 'With Driver (Chauffeur)' : 'Self-Drive & With Driver' },
    ],
    highlights,
    luggageCapacity: luggage,
    fuelType: fuel,
    engineCapacity: engine,
    acType: ac,
    doors: isVan ? 4 : 4,
    ratePerDay: seed.ratePerDay,
    detail: seed.detail,
    heroImage: img(seed.file),
    altImage: img(seed.file),
    gallery: [img(seed.file)],
    sample: false,
    orbit: seed.orbit,
  }
}

const seeds: Seed[] = [
  // ================= ECONOMY CARS =================
  {
    slug: 'suzuki-alto',
    file: 'suzuki-alto.png',
    name: 'Suzuki Alto',
    maker: 'Suzuki',
    category: 'economy',
    seats: 4,
    transmission: 'both',
    driveMode: 'both',
    intendedUses: ['city', 'family', 'airport'],
    detail: '660cc VXR / VXL',
    ratePerDay: 4000,
    orbit: true,
  },
  {
    slug: 'suzuki-wagon-r',
    file: 'suzuki-wagon-r.png',
    name: 'Suzuki Wagon R',
    maker: 'Suzuki',
    category: 'economy',
    seats: 5,
    transmission: 'both',
    driveMode: 'both',
    intendedUses: ['city', 'family', 'airport'],
    detail: '1000cc VXL / VXR',
    ratePerDay: 5000,
  },
  {
    slug: 'toyota-vitz',
    file: 'toyota-vitz.png',
    name: 'Toyota Vitz',
    maker: 'Toyota',
    category: 'economy',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'both',
    intendedUses: ['city', 'family', 'airport'],
    detail: '1.0L / 1.3L Hatchback',
    ratePerDay: 5500,
  },
  {
    slug: 'toyota-aqua',
    file: 'toyota-aqua.png',
    name: 'Toyota Aqua Hybrid',
    maker: 'Toyota',
    category: 'economy',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'both',
    intendedUses: ['city', 'family', 'airport', 'intercity'],
    detail: 'Hybrid Fuel Saver',
    ratePerDay: 6000,
    orbit: true,
  },

  // ================= SEDANS =================
  {
    slug: 'honda-city-2012',
    file: 'honda-city-2012.png',
    name: 'Honda City',
    maker: 'Honda',
    category: 'sedan',
    seats: 5,
    transmission: 'both',
    driveMode: 'both',
    intendedUses: ['city', 'airport', 'corporate'],
    detail: 'City i-VTEC',
    ratePerDay: 6000,
  },
  {
    slug: 'toyota-gli-2014',
    file: 'toyota-gli-2014.png',
    name: 'Toyota Corolla GLI',
    maker: 'Toyota',
    category: 'sedan',
    seats: 5,
    transmission: 'both',
    driveMode: 'both',
    intendedUses: ['city', 'airport', 'intercity', 'corporate'],
    detail: 'Corolla GLI',
    ratePerDay: 6500,
  },
  {
    slug: 'toyota-yaris',
    file: 'toyota-yaris.png',
    name: 'Toyota Yaris',
    maker: 'Toyota',
    category: 'sedan',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'both',
    intendedUses: ['city', 'airport', 'corporate', 'intercity'],
    detail: 'Yaris ATIV 1.3 / 1.5',
    ratePerDay: 6000,
  },
  {
    slug: 'toyota-corolla-altis',
    file: 'toyota-corolla-altis.png',
    name: 'Toyota Corolla Altis',
    maker: 'Toyota',
    category: 'sedan',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'both',
    intendedUses: ['city', 'airport', 'corporate', 'intercity'],
    detail: 'Corolla Altis 1.6',
    ratePerDay: 7000,
  },
  {
    slug: 'toyota-corolla-grande',
    file: 'toyota-corolla-altis.png',
    name: 'Toyota Corolla Grande',
    maker: 'Toyota',
    category: 'sedan',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'both',
    intendedUses: ['city', 'airport', 'corporate', 'intercity'],
    detail: 'Corolla Grande 1.8 CVT',
    ratePerDay: 11000,
    orbit: true,
  },
  {
    slug: 'honda-civic-reborn',
    file: 'honda-civic-reborn.png',
    name: 'Honda Civic Reborn',
    maker: 'Honda',
    category: 'sedan',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'both',
    intendedUses: ['city', 'corporate', 'intercity'],
    detail: 'Civic Reborn 8th Gen',
    ratePerDay: 5000,
  },
  {
    slug: 'honda-civic-10th',
    file: 'honda-civic-10th.png',
    name: 'Honda Civic 10th Gen',
    maker: 'Honda',
    category: 'sedan',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'both',
    intendedUses: ['city', 'corporate', 'wedding', 'intercity'],
    detail: 'Civic X 10th Gen',
    ratePerDay: 8500,
  },
  {
    slug: 'honda-civic-11th',
    file: 'honda-civic-11th.png',
    name: 'Honda Civic 11th Gen',
    maker: 'Honda',
    category: 'sedan',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'both',
    intendedUses: ['city', 'corporate', 'wedding', 'airport'],
    detail: 'Civic 11th Gen · White',
    ratePerDay: 10000,
  },
  {
    slug: 'hyundai-elantra-glx',
    file: 'hyundai-elantra-glx.png',
    name: 'Hyundai Elantra GLX',
    maker: 'Hyundai',
    category: 'sedan',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'both',
    intendedUses: ['city', 'corporate', 'airport'],
    detail: 'Elantra 2.0 GLX',
    ratePerDay: null,
  },
  {
    slug: 'hyundai-sonata',
    file: 'hyundai-sonata.png',
    name: 'Hyundai Sonata',
    maker: 'Hyundai',
    category: 'sedan',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'chauffeur',
    intendedUses: ['corporate', 'airport', 'wedding'],
    detail: 'Sonata 2.0 / 2.5 Executive',
    ratePerDay: null,
  },

  // ================= MERCEDES & LUXURY PROTOCOL =================
  {
    slug: 'mercedes-c180-2012',
    file: 'mercedes-c180-2012.png',
    name: 'Mercedes C180',
    maker: 'Mercedes-Benz',
    category: 'premium',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'chauffeur',
    intendedUses: ['corporate', 'wedding', 'airport'],
    detail: 'C180 Elegance',
    ratePerDay: null,
  },
  {
    slug: 'mercedes-c180-2022',
    file: 'mercedes-c180-2022.png',
    name: 'Mercedes C180 (New Shape)',
    maker: 'Mercedes-Benz',
    category: 'premium',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'chauffeur',
    intendedUses: ['corporate', 'wedding', 'airport'],
    detail: 'C180 AMG Line 2022',
    ratePerDay: null,
  },
  {
    slug: 'mercedes-e200-2012',
    file: 'mercedes-e200-2012.png',
    name: 'Mercedes E200',
    maker: 'Mercedes-Benz',
    category: 'premium',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'chauffeur',
    intendedUses: ['corporate', 'wedding', 'airport'],
    detail: 'E200 Executive Saloon',
    ratePerDay: null,
  },
  {
    slug: 'mercedes-e200-2022',
    file: 'mercedes-e200-2022.png',
    name: 'Mercedes E200 (New Shape)',
    maker: 'Mercedes-Benz',
    category: 'premium',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'chauffeur',
    intendedUses: ['corporate', 'wedding', 'airport'],
    detail: 'E200 Exclusive 2022',
    ratePerDay: null,
  },
  {
    slug: 'audi-a6-2012',
    file: 'audi-a6-2012.png',
    name: 'Audi A6',
    maker: 'Audi',
    category: 'premium',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'chauffeur',
    intendedUses: ['corporate', 'wedding', 'airport'],
    detail: 'Audi A6 Saloon',
    ratePerDay: null,
  },
  {
    slug: 'toyota-crown-rs-2019',
    file: 'toyota-crown-rs-2019.png',
    name: 'Toyota Crown RS',
    maker: 'Toyota',
    category: 'premium',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'chauffeur',
    intendedUses: ['corporate', 'wedding', 'airport'],
    detail: 'Crown RS Advance',
    ratePerDay: null,
  },

  // ================= SUVS, 4X4 & CROSSOVERS =================
  {
    slug: 'honda-brv',
    file: 'honda-brv.png',
    name: 'Honda BR-V',
    maker: 'Honda',
    category: 'suv',
    seats: 7,
    transmission: 'both',
    driveMode: 'both',
    intendedUses: ['family', 'airport', 'intercity', 'city'],
    detail: '7-Seater Family Cruiser',
    ratePerDay: 6000,
    orbit: true,
  },
  {
    slug: 'honda-vezel',
    file: 'honda-vezel.png',
    name: 'Honda Vezel / HR-V',
    maker: 'Honda',
    category: 'suv',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'both',
    intendedUses: ['city', 'family', 'airport'],
    detail: 'Hybrid Crossover',
    ratePerDay: null,
  },
  {
    slug: 'honda-vezel-2016',
    file: 'honda-vezel-2016.png',
    name: 'Honda Vezel (2016)',
    maker: 'Honda',
    category: 'suv',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'both',
    intendedUses: ['city', 'family', 'airport'],
    detail: '2016 Model Hybrid',
    ratePerDay: null,
  },
  {
    slug: 'hyundai-tucson-old',
    file: 'hyundai-tucson-old.png',
    name: 'Hyundai Tucson',
    maker: 'Hyundai',
    category: 'suv',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'both',
    intendedUses: ['family', 'city', 'intercity'],
    detail: 'AWD Crossover',
    ratePerDay: null,
  },
  {
    slug: 'hyundai-tucson-new',
    file: 'hyundai-tucson-new.png',
    name: 'Hyundai Tucson (New Gen)',
    maker: 'Hyundai',
    category: 'suv',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'both',
    intendedUses: ['family', 'city', 'intercity', 'corporate'],
    detail: 'New Generation AWD',
    ratePerDay: null,
  },
  {
    slug: 'kia-sportage',
    file: 'kia-sportage.png',
    name: 'Kia Sportage',
    maker: 'Kia',
    category: 'suv',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'both',
    intendedUses: ['family', 'city', 'intercity'],
    detail: 'Sportage AWD / FWD',
    ratePerDay: null,
  },
  {
    slug: 'toyota-vigo-black',
    file: 'toyota-vigo-black.png',
    name: 'Toyota Hilux Vigo',
    maker: 'Toyota',
    category: 'suv',
    seats: 5,
    transmission: 'both',
    driveMode: 'both',
    intendedUses: ['intercity', 'family', 'group'],
    detail: 'Hilux Vigo 4x4 · Black',
    ratePerDay: 9000,
  },
  {
    slug: 'toyota-revo',
    file: 'toyota-revo.png',
    name: 'Toyota Hilux Revo',
    maker: 'Toyota',
    category: 'suv',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'both',
    intendedUses: ['intercity', 'family', 'group', 'corporate'],
    detail: 'Hilux Revo 4x4 Automatic',
    ratePerDay: 11000,
    orbit: true,
  },
  {
    slug: 'toyota-revo-black',
    file: 'toyota-revo-black.png',
    name: 'Toyota Hilux Revo (Black Edition)',
    maker: 'Toyota',
    category: 'suv',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'both',
    intendedUses: ['intercity', 'family', 'group', 'corporate'],
    detail: 'Revo Rocco / Black Edition',
    ratePerDay: 11000,
  },
  {
    slug: 'prado-2005',
    file: 'prado-2005.png',
    name: 'Toyota Land Cruiser Prado (TZ/TX)',
    maker: 'Toyota',
    category: 'premium',
    seats: 7,
    transmission: 'automatic',
    driveMode: 'chauffeur',
    intendedUses: ['corporate', 'intercity', 'family', 'wedding'],
    detail: 'Prado 120 Series',
    ratePerDay: 13000,
  },
  {
    slug: 'prado-2019',
    file: 'prado-2019.png',
    name: 'Toyota Land Cruiser Prado (150 Series)',
    maker: 'Toyota',
    category: 'premium',
    seats: 7,
    transmission: 'automatic',
    driveMode: 'chauffeur',
    intendedUses: ['corporate', 'intercity', 'family', 'wedding'],
    detail: 'Prado TX / TZ 150 Series',
    ratePerDay: 25000,
    orbit: true,
  },
  {
    slug: 'land-cruiser-2019',
    file: 'land-cruiser-2019.png',
    name: 'Toyota Land Cruiser V8 (ZX)',
    maker: 'Toyota',
    category: 'premium',
    seats: 7,
    transmission: 'automatic',
    driveMode: 'chauffeur',
    intendedUses: ['corporate', 'intercity', 'wedding', 'group'],
    detail: 'Land Cruiser V8 ZX',
    ratePerDay: 30000,
    orbit: true,
  },
  {
    slug: 'land-cruiser-lc200',
    file: 'land-cruiser-lc200.png',
    name: 'Toyota Land Cruiser LC200',
    maker: 'Toyota',
    category: 'premium',
    seats: 7,
    transmission: 'automatic',
    driveMode: 'chauffeur',
    intendedUses: ['corporate', 'intercity', 'wedding', 'group'],
    detail: 'LC200 Protocol Edition',
    ratePerDay: 30000,
  },

  // ================= VANS & COACHES =================
  {
    slug: 'hiace-hiroof-200',
    file: 'hiace-hiroof-200.png',
    name: 'Toyota Hiace Hiroof',
    maker: 'Toyota',
    category: 'group',
    seats: 14,
    transmission: 'manual',
    driveMode: 'chauffeur',
    intendedUses: ['group', 'airport', 'intercity', 'corporate'],
    detail: '200 Series Hiroof (14 Seater)',
    ratePerDay: 10000,
  },
  {
    slug: 'hiace-grand-cabin',
    file: 'hiace-grand-cabin.png',
    name: 'Toyota Hiace Grand Cabin',
    maker: 'Toyota',
    category: 'group',
    seats: 16,
    transmission: 'manual',
    driveMode: 'chauffeur',
    intendedUses: ['group', 'wedding', 'airport', 'corporate'],
    detail: 'Grand Cabin Executive (16 Seater)',
    ratePerDay: 10000,
    orbit: true,
  },
  {
    slug: 'toyota-coaster',
    file: 'toyota-coaster.png',
    name: 'Toyota Coaster Saloon',
    maker: 'Toyota',
    category: 'group',
    seats: 29,
    transmission: 'manual',
    driveMode: 'chauffeur',
    intendedUses: ['group', 'intercity', 'corporate'],
    detail: 'Coaster Saloon (29 Seater)',
    ratePerDay: 16000,
  },
]

export const vehicles: Vehicle[] = seeds.map(build)

export const orbitVehicles = vehicles.filter((vehicle) => vehicle.orbit)

export function formatRate(rate: number | null) {
  if (rate == null) return 'Quote on request'
  return `Rs. ${rate.toLocaleString('en-PK')} / day`
}

export function getVehicle(slug: string) {
  return vehicles.find((vehicle) => vehicle.slug === slug)
}

export function similarVehicles(slug: string, limit = 3) {
  const current = getVehicle(slug)
  if (!current) return vehicles.slice(0, limit)
  return vehicles
    .filter((vehicle) => vehicle.slug !== slug && vehicle.category === current.category)
    .slice(0, limit)
}

export const transmissionLabels: Record<Transmission, string> = {
  automatic: 'Automatic',
  manual: 'Manual',
  both: 'Manual or automatic',
}

export const driveModeLabels: Record<DriveMode, string> = {
  'self-drive': 'Self-drive',
  chauffeur: 'Chauffeur',
  both: 'Self-drive or chauffeur',
}
