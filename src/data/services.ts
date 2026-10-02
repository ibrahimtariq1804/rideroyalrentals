export type Service = {
  slug: string
  path: string
  title: string
  kicker: string
  summary: string
  copy: string[]
  points: string[]
}

export const services: Service[] = [
  {
    slug: 'self-drive',
    path: '/services/self-drive',
    title: 'Self-drive',
    kicker: 'Where available',
    summary:
      'Take the wheel when the route, licence, and vehicle class allow it. We confirm eligibility before dispatch.',
    copy: [
      'Self-drive is offered on economy, sedan, and selected crossover classes where it is legal and operationally sound.',
      'Premium 4x4 and group vans remain chauffeur-led unless a specific arrangement is agreed in writing.',
    ],
    points: ['Licence check at handover', 'City and intercity routes', 'Daily or weekly requests'],
  },
  {
    slug: 'chauffeur',
    path: '/services/chauffeur',
    title: 'Chauffeur-driven',
    kicker: 'Presence, handled',
    summary:
      'A professional driver, a prepared vehicle, and a day that does not require you to navigate the city.',
    copy: [
      'Chauffeur service covers airport duty, board meetings, family days, and multi-stop itineraries.',
      'Hours and routing are agreed at quote — we do not publish a fake hourly menu.',
    ],
    points: ['Meet and greet', 'Multi-stop days', 'Protocol-ready vehicles'],
  },
  {
    slug: 'airport-transfer',
    path: '/services/airport-transfer',
    title: 'Airport transfer',
    kicker: 'Arrivals and departures',
    summary: 'Timed pickup, luggage-aware vehicles, and a calm handover after landing.',
    copy: [
      'Share flight details with your request. We plan buffer around typical landing and baggage times without inventing on-time statistics.',
      'Sedans, crossovers, and group vans are available depending on party size.',
    ],
    points: ['Flight-aware pickup', 'Luggage-first vehicle choice', 'City hotel or home drop'],
  },
  {
    slug: 'intercity',
    path: '/services/intercity',
    title: 'Intercity travel',
    kicker: 'One road, one vehicle',
    summary: 'City-to-city movement with the right class of car for the distance and the party.',
    copy: [
      'Intercity is quoted per itinerary: origin, destination, overnight holds, and return window.',
      'We will not publish dummy kilometre rates. Request a quote with dates and the preferred class.',
    ],
    points: ['Sedan to 4x4', 'Optional chauffeur', 'Return or one-way requests'],
  },
  {
    slug: 'corporate',
    path: '/services/corporate',
    title: 'Corporate & monthly',
    kicker: 'Retainer movement',
    summary: 'Staff shuttles, visiting executives, and monthly retainers with a single operations contact.',
    copy: [
      'Corporate programmes are scoped around roster, cities, and vehicle mix — not a public price grid.',
      'Invoices and naming can follow your procurement process once the programme is confirmed.',
    ],
    points: ['Monthly retainers', 'Executive chauffeur', 'Staff group vans'],
  },
  {
    slug: 'weddings-events',
    path: '/services/weddings-events',
    title: 'Weddings & events',
    kicker: 'Ceremony to convoy',
    summary: 'Lead cars, family SUVs, and group cabins coordinated to one call sheet.',
    copy: [
      'Event work is planned from venue list, guest counts, and timing — not from stock photography of palaces.',
      'Premium SUVs and Grand Cabin vehicles are held on request, subject to real inventory.',
    ],
    points: ['Lead and convoy cars', 'Family SUVs', 'Group cabins'],
  },
]

export function getService(slug: string) {
  return services.find((service) => service.slug === slug)
}
