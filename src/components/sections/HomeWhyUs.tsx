import { Clock, ShieldCheck, UserCheck, DollarSign, MapPin, MessageSquare } from 'lucide-react'
import { Container } from '@/components/ui/Primitives'
import { business } from '@/data/business'

const reasons = [
  {
    icon: Clock,
    title: '24/7 Service & Roadside Assistance',
    desc: 'Our dispatch desk operates round-the-clock. Late-night flight arrival or early morning emergency? We are always reachable.',
  },
  {
    icon: ShieldCheck,
    title: '100% Inspected & Sanitized Cars',
    desc: 'Every vehicle undergoes regular mechanical checks, AC servicing, and deep interior cleaning before every customer handover.',
  },
  {
    icon: UserCheck,
    title: 'Licensed & Verified Chauffeurs',
    desc: 'Our drivers are courteous, background-verified, non-smokers, and familiar with both city traffic and complex northern mountain highways.',
  },
  {
    icon: DollarSign,
    title: 'Clear & Competitive Pricing',
    desc: 'Transparent daily and monthly rental rates. No unexpected fees, surprise cancellation penalties, or hidden deposit holdbacks.',
  },
  {
    icon: MapPin,
    title: 'Doorstep Delivery & Airport Handover',
    desc: 'We deliver your vehicle straight to your doorstep, corporate office, hotel, or directly outside Islamabad Airport terminal.',
  },
  {
    icon: MessageSquare,
    title: 'Fast WhatsApp Booking',
    desc: 'Skip endless paperwork. Confirm your booking, negotiate custom routes, and receive car photos directly on WhatsApp in minutes.',
  },
]

export function HomeWhyUs() {
  return (
    <section className="home-why-section" id="why-us" aria-labelledby="why-heading">
      <Container>
        <div className="section-header-center">
          <div className="section-pill">THE RIDEROYAL ADVANTAGE</div>
          <h2 id="why-heading" className="section-title-large">
            Why Islamabad Chooses <span className="text-accent">{business.name}</span>
          </h2>
          <p className="section-desc-center">
            We built our reputation on punctuality, honest communication, and reliable vehicles that never leave you stranded.
          </p>
        </div>

        <div className="why-grid">
          {reasons.map((r, i) => {
            const Icon = r.icon
            return (
              <div key={i} className="why-card">
                <div className="why-icon-wrap">
                  <Icon size={24} />
                </div>
                <div className="why-card-content">
                  <h3 className="why-card-title">{r.title}</h3>
                  <p className="why-card-desc">{r.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Trust Bar */}
        <div className="trust-stats-bar">
          <div className="stat-box">
            <span className="stat-number">30+</span>
            <span className="stat-label">Verified Fleet Vehicles</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Customer Support & Dispatch</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">100%</span>
            <span className="stat-label">Doorstep Delivery in Twin Cities</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">0</span>
            <span className="stat-label">Hidden Charges or Fees</span>
          </div>
        </div>
      </Container>
    </section>
  )
}
