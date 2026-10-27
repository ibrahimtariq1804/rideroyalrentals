import { Link } from 'react-router-dom'
import { Plane, UserCheck, KeyRound, Sparkles, Mountain, Building2, ArrowRight, MessageCircle } from 'lucide-react'
import { Container } from '@/components/ui/Primitives'
import { business } from '@/data/business'

const serviceItems = [
  {
    icon: Plane,
    title: 'Airport Pick & Drop',
    path: '/services/airport-transfer',
    tag: '24/7 Service',
    description: 'Guaranteed on-time pickup and drop-off at Islamabad International Airport (ISB). Flight delay tracking, luggage support, and meet & greet.',
    points: ['Flight status monitoring', 'Spacious trunk for luggage', 'Direct terminal handover'],
  },
  {
    icon: UserCheck,
    title: 'Rent a Car with Driver',
    path: '/services/chauffeur',
    tag: 'Trained Chauffeurs',
    description: 'Experienced, courteous, and background-checked drivers for executive meetings, family outings, and stress-free city or intercity navigation.',
    points: ['Verified & punctual drivers', 'Familiar with all routes', 'Safe & relaxed journey'],
  },
  {
    icon: KeyRound,
    title: 'Self-Drive Car Rental',
    path: '/services/self-drive',
    tag: 'Maximum Freedom',
    description: 'Enjoy total independence and privacy with our self-drive fleet. From economical hatches like Alto to comfortable sedans and crossovers.',
    points: ['Fast license verification', 'Flexible daily/weekly terms', 'Clean & well-maintained'],
  },
  {
    icon: Sparkles,
    title: 'Wedding & VIP Protocol',
    path: '/services/weddings-events',
    tag: 'Luxury Fleet',
    description: 'Make your special day memorable with premium cars including Toyota Land Cruiser V8, Prado, Mercedes, Audi, and decorated bridal vehicles.',
    points: ['Bridal car decoration options', 'Convoy & escort vehicles', 'Impeccable condition'],
  },
  {
    icon: Mountain,
    title: 'Northern Tours & Intercity',
    path: '/services/intercity',
    tag: 'Tours & Hills',
    description: 'Rugged 4x4 SUVs, Toyota Revo, and Grand Cabins specially prepared for hill climbs to Murree, Swat, Naran, Hunza, and Skardu.',
    points: ['Mountain-tested 4x4 vehicles', 'Experienced mountain drivers', 'Spacious for groups & gear'],
  },
  {
    icon: Building2,
    title: 'Corporate & Monthly Rentals',
    path: '/services/corporate',
    tag: 'Business Rates',
    description: 'Discounted long-term monthly rental retainers for companies, NGOs, embassies, and visiting business executives with dedicated fleet support.',
    points: ['Special monthly discount rates', 'Scheduled maintenance included', 'Single operational contact'],
  },
]

export function HomeServices() {
  const cleanPhone = business.whatsAppNumber.replace(/[^\d]/g, '')

  return (
    <section className="home-services-section" id="services" aria-labelledby="services-heading">
      <Container>
        <div className="section-header-center">
          <div className="section-pill">OUR PROFESSIONAL SERVICES</div>
          <h2 id="services-heading" className="section-title-large">
            Complete Transportation <span className="text-accent">Solutions</span>
          </h2>
          <p className="section-desc-center">
            Whether you need a quick airport transfer, a luxury wedding car, or a rugged 4x4 for northern mountains, Ride Royal Rentals has you covered.
          </p>
        </div>

        <div className="services-cards-grid">
          {serviceItems.map((service) => {
            const Icon = service.icon
            const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `Hello ${business.name}! I would like to inquire about your ${service.title} service. Please provide details and rates.`,
            )}`

            return (
              <div key={service.title} className="service-card">
                <div className="service-card-header">
                  <div className="service-icon-wrap">
                    <Icon size={26} />
                  </div>
                  <span className="service-tag">{service.tag}</span>
                </div>

                <h3 className="service-card-title">{service.title}</h3>
                <p className="service-card-desc">{service.description}</p>

                <ul className="service-points-list">
                  {service.points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>

                <div className="service-card-footer">
                  <Link to={service.path} className="service-link">
                    <span>Learn More</span>
                    <ArrowRight size={14} />
                  </Link>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="service-wa-quick"
                    title={`Inquire about ${service.title}`}
                  >
                    <MessageCircle size={15} />
                    <span>Inquire</span>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
