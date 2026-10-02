export const processSteps = [
  {
    index: '01',
    title: 'Request',
    body: 'Send dates, cities, class, and whether you want a chauffeur. Online or WhatsApp.',
  },
  {
    index: '02',
    title: 'Confirm',
    body: 'We check real availability and reply with a quote. Listed rates are a starting point.',
  },
  {
    index: '03',
    title: 'Prepare',
    body: 'Vehicle, driver if required, and pickup point are locked before the day.',
  },
  {
    index: '04',
    title: 'Drive',
    body: 'Handover at the agreed point — airport, hotel, office, or residence.',
  },
] as const

export const storyChapters = [
  {
    id: 'economy',
    kicker: '01 — Economy',
    title: 'City scale.',
    body: 'Suzuki Alto — the hatch people ask for when the brief is simple: get there.',
    image: '/images/fleet/hires/suzuki-alto.png',
  },
  {
    id: 'sedan',
    kicker: '02 — Sedan',
    title: 'The default.',
    body: 'Corolla Altis, Civic, City, Mercedes, Audi. Airport mornings and office days.',
    image: '/images/fleet/hires/toyota-corolla-altis.png',
  },
  {
    id: 'suv',
    kicker: '03 — Pickup / Crossover',
    title: 'Family height.',
    body: 'Honda BRV, Vigo, Revo, Tucson, Sportage — luggage, family rows, and routes past the ring.',
    image: '/images/fleet/hires/honda-brv.png',
  },
  {
    id: 'premium',
    kicker: '04 — Premium',
    title: 'When it has to arrive.',
    body: 'Prado, Land Cruiser, Crown RS, Audi A6, Mercedes. Protocol and guests who notice the car.',
    image: '/images/fleet/hires/land-cruiser-2019.png',
  },
  {
    id: 'group',
    kicker: '05 — Group',
    title: 'Everyone moves.',
    body: 'Hiace Hiroof, Grand Cabin, Toyota Coaster — crews and full parties.',
    image: '/images/fleet/hires/hiace-grand-cabin.png',
  },
] as const
