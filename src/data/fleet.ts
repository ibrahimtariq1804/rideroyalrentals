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
  features: string[]
  specs: { label: string; value: string }[]
  /** Published daily rate from live inventory listing (PKR). Confirmed again at quote. */
  ratePerDay: number | null
  detail: string
  heroImage: string
  altImage: string
  gallery: string[]
  sample: boolean
  /** Shown in Choose your orbit ring (keeps the ring readable). */
  orbit?: boolean
}

export const categoryLabels: Record<VehicleCategory, string> = {
  economy: 'Economy',
  sedan: 'Sedan',
  suv: 'Pickup / Crossover',
  premium: 'Premium / 4x4',
  group: 'Vans / Coaches',
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
  orbit?: boolean
}

function build(seed: Seed): Vehicle {
  const rateLabel = seed.ratePerDay == null ? 'Quote on request' : `Listed Rs. ${seed.ratePerDay.toLocaleString('en-PK')} / day`
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
    features: [seed.detail, categoryLabels[seed.category], rateLabel],
    specs: [
      { label: 'Name', value: seed.name },
      { label: 'Detail', value: seed.detail },
      { label: 'Listed rate', value: rateLabel },
    ],
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
    detail: 'Compact city hatch',
    ratePerDay: 2500,
    orbit: true,
  },
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
    detail: '2012 Model',
    ratePerDay: 3500,
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
    detail: '2014 Model',
    ratePerDay: 3500,
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
    detail: 'Corolla Altis',
    ratePerDay: 4500,
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
    detail: '8th Gen',
    ratePerDay: 4500,
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
    detail: '10th Gen · White',
    ratePerDay: 8000,
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
    detail: '11th Gen · White',
    ratePerDay: 10000,
    orbit: true,
  },
  {
    slug: 'honda-accord-2019',
    file: 'honda-accord-2019.png',
    name: 'Honda Accord',
    maker: 'Honda',
    category: 'sedan',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'chauffeur',
    intendedUses: ['corporate', 'airport', 'wedding'],
    detail: '2019 Model',
    ratePerDay: null,
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
    detail: 'Elantra GLX',
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
    detail: 'Sonata',
    ratePerDay: null,
  },
  {
    slug: 'audi-a6-2012',
    file: 'audi-a6-2012.png',
    name: 'Audi A6',
    maker: 'Audi',
    category: 'sedan',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'chauffeur',
    intendedUses: ['corporate', 'wedding', 'airport'],
    detail: '2012 Model',
    ratePerDay: 55000,
  },
  {
    slug: 'mercedes-c180-2012',
    file: 'mercedes-c180-2012.png',
    name: 'Mercedes C180',
    maker: 'Mercedes-Benz',
    category: 'sedan',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'chauffeur',
    intendedUses: ['corporate', 'wedding', 'airport'],
    detail: 'C180 2012',
    ratePerDay: 20000,
  },
  {
    slug: 'mercedes-c180-2022',
    file: 'mercedes-c180-2022.png',
    name: 'Mercedes C180',
    maker: 'Mercedes-Benz',
    category: 'sedan',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'chauffeur',
    intendedUses: ['corporate', 'wedding', 'airport'],
    detail: 'C180 2022',
    ratePerDay: null,
  },
  {
    slug: 'mercedes-e200-2012',
    file: 'mercedes-e200-2012.png',
    name: 'Mercedes E200',
    maker: 'Mercedes-Benz',
    category: 'sedan',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'chauffeur',
    intendedUses: ['corporate', 'wedding', 'airport'],
    detail: 'E200 2012',
    ratePerDay: 3000,
  },
  {
    slug: 'mercedes-e200-2022',
    file: 'mercedes-e200-2022.png',
    name: 'Mercedes E200',
    maker: 'Mercedes-Benz',
    category: 'sedan',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'chauffeur',
    intendedUses: ['corporate', 'wedding', 'airport'],
    detail: 'E200 2022',
    ratePerDay: null,
  },
  {
    slug: 'honda-brv',
    file: 'honda-brv.png',
    name: 'Honda BRV',
    maker: 'Honda',
    category: 'suv',
    seats: 7,
    transmission: 'both',
    driveMode: 'both',
    intendedUses: ['family', 'airport', 'intercity', 'city'],
    detail: '7 Seater',
    ratePerDay: 6500,
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
    detail: 'Vezel / HR-V',
    ratePerDay: null,
  },
  {
    slug: 'honda-vezel-2016',
    file: 'honda-vezel-2016.png',
    name: 'Honda Vezel / HR-V',
    maker: 'Honda',
    category: 'suv',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'both',
    intendedUses: ['city', 'family', 'airport'],
    detail: '2016 Model',
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
    detail: 'Previous generation',
    ratePerDay: null,
  },
  {
    slug: 'hyundai-tucson-new',
    file: 'hyundai-tucson-new.png',
    name: 'Hyundai Tucson',
    maker: 'Hyundai',
    category: 'suv',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'both',
    intendedUses: ['family', 'city', 'intercity', 'corporate'],
    detail: 'New generation',
    ratePerDay: null,
    orbit: true,
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
    detail: 'Sportage',
    ratePerDay: null,
  },
  {
    slug: 'kia-sorento',
    file: 'kia-sorento.png',
    name: 'Kia Sorento',
    maker: 'Kia',
    category: 'suv',
    seats: 7,
    transmission: 'automatic',
    driveMode: 'both',
    intendedUses: ['family', 'group', 'intercity'],
    detail: 'Sorento',
    ratePerDay: null,
  },
  {
    slug: 'toyota-vigo-black',
    file: 'toyota-vigo-black.png',
    name: 'Toyota Vigo',
    maker: 'Toyota',
    category: 'suv',
    seats: 5,
    transmission: 'both',
    driveMode: 'both',
    intendedUses: ['intercity', 'family', 'group'],
    detail: 'Vigo · Black',
    ratePerDay: 7000,
  },
  {
    slug: 'toyota-revo',
    file: 'toyota-revo.png',
    name: 'Toyota Revo',
    maker: 'Toyota',
    category: 'suv',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'both',
    intendedUses: ['intercity', 'family', 'group', 'corporate'],
    detail: 'Revo',
    ratePerDay: 9500,
    orbit: true,
  },
  {
    slug: 'toyota-revo-black',
    file: 'toyota-revo-black.png',
    name: 'Toyota Revo',
    maker: 'Toyota',
    category: 'suv',
    seats: 5,
    transmission: 'automatic',
    driveMode: 'both',
    intendedUses: ['intercity', 'family', 'group', 'corporate'],
    detail: 'Revo · Black',
    ratePerDay: 9500,
  },
  {
    slug: 'prado-2005',
    file: 'prado-2005.png',
    name: 'Toyota Prado',
    maker: 'Toyota',
    category: 'premium',
    seats: 7,
    transmission: 'automatic',
    driveMode: 'chauffeur',
    intendedUses: ['corporate', 'intercity', 'family', 'wedding'],
    detail: '2005 Model',
    ratePerDay: 9000,
  },
  {
    slug: 'prado-2019',
    file: 'prado-2019.png',
    name: 'Toyota Prado',
    maker: 'Toyota',
    category: 'premium',
    seats: 7,
    transmission: 'automatic',
    driveMode: 'chauffeur',
    intendedUses: ['corporate', 'intercity', 'family', 'wedding'],
    detail: '2019 Model',
    ratePerDay: 17000,
    orbit: true,
  },
  {
    slug: 'land-cruiser-2019',
    file: 'land-cruiser-2019.png',
    name: 'Land Cruiser',
    maker: 'Toyota',
    category: 'premium',
    seats: 7,
    transmission: 'automatic',
    driveMode: 'chauffeur',
    intendedUses: ['corporate', 'intercity', 'wedding', 'group'],
    detail: '2019 Model',
    ratePerDay: 25000,
    orbit: true,
  },
  {
    slug: 'land-cruiser-lc200',
    file: 'land-cruiser-lc200.png',
    name: 'Land Cruiser LC200',
    maker: 'Toyota',
    category: 'premium',
    seats: 7,
    transmission: 'automatic',
    driveMode: 'chauffeur',
    intendedUses: ['corporate', 'intercity', 'wedding', 'group'],
    detail: 'LC200',
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
    detail: 'Crown RS 2019',
    ratePerDay: null,
  },
  {
    slug: 'hiace-hiroof-200',
    file: 'hiace-hiroof-200.png',
    name: 'Hiace Hiroof',
    maker: 'Toyota',
    category: 'group',
    seats: 14,
    transmission: 'manual',
    driveMode: 'chauffeur',
    intendedUses: ['group', 'airport', 'intercity', 'corporate'],
    detail: '200 Series',
    ratePerDay: 8000,
  },
  {
    slug: 'hiace-grand-cabin',
    file: 'hiace-grand-cabin.png',
    name: 'Hiace Grand Cabin',
    maker: 'Toyota',
    category: 'group',
    seats: 16,
    transmission: 'manual',
    driveMode: 'chauffeur',
    intendedUses: ['group', 'wedding', 'airport', 'corporate'],
    detail: 'Grand Cabin',
    ratePerDay: 8500,
    orbit: true,
  },
  {
    slug: 'toyota-coaster',
    file: 'toyota-coaster.png',
    name: 'Toyota Coaster',
    maker: 'Toyota',
    category: 'group',
    seats: 30,
    transmission: 'manual',
    driveMode: 'chauffeur',
    intendedUses: ['group', 'intercity', 'corporate'],
    detail: 'Coaster',
    ratePerDay: 12000,
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
