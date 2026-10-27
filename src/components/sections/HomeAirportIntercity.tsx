import { Link } from 'react-router-dom'
import { Plane, Compass, MessageCircle, ArrowRight, Check } from 'lucide-react'
import { Container, FleetImg } from '@/components/ui/Primitives'
import { business } from '@/data/business'

export function HomeAirportIntercity() {
  const cleanPhone = business.whatsAppNumber.replace(/[^\d]/g, '')

  return (
    <section className="home-spotlight-section" aria-label="Airport and Intercity highlights">
      <Container>
        <div className="spotlight-grid">
          {/* Airport Card */}
          <div className="spotlight-card">
            <div className="spotlight-badge">
              <Plane size={16} />
              <span>ISLAMABAD AIRPORT 24/7</span>
            </div>

            <h3 className="spotlight-title">Airport Pick & Drop Service</h3>
            <p className="spotlight-desc">
              Never worry about missing a flight or waiting in long taxi lines. We monitor your flight schedule in real-time, coordinate terminal arrivals, and provide ample luggage room.
            </p>

            <ul className="spotlight-list">
              <li><Check size={16} className="text-accent" /> 24/7 Meet & Greet outside Islamabad Airport</li>
              <li><Check size={16} className="text-accent" /> Flight delay tracking included free</li>
              <li><Check size={16} className="text-accent" /> Sedans, Prado & Hiace Grand Cabins for families</li>
            </ul>

            <div className="spotlight-image-wrap">
              <FleetImg
                src="/images/fleet/hires/hiace-grand-cabin.png"
                alt="Toyota Hiace Grand Cabin Airport Transfer"
                width={800}
                height={500}
                loading="lazy"
              />
            </div>

            <div className="spotlight-actions">
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello! I need an airport pick & drop service at Islamabad Airport. Please share details and pricing.')}`}
                target="_blank"
                rel="noreferrer"
                className="spotlight-btn-wa"
              >
                <MessageCircle size={16} />
                <span>Book Airport Ride</span>
              </a>
              <Link to="/services/airport-transfer" className="spotlight-btn-more">
                <span>View Details</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Intercity & Tours Card */}
          <div className="spotlight-card">
            <div className="spotlight-badge">
              <Compass size={16} />
              <span>NORTHERN AREAS & INTERCITY</span>
            </div>

            <h3 className="spotlight-title">Intercity & Northern Pakistan Tours</h3>
            <p className="spotlight-desc">
              Planning a trip from Islamabad to Lahore, Peshawar, Murree, Swat, or Hunza? Our high-clearance 4x4 SUVs and experienced mountain chauffeurs ensure maximum comfort and safety.
            </p>

            <ul className="spotlight-list">
              <li><Check size={16} className="text-accent" /> High-clearance Prado, Revo & Fortuner 4x4s</li>
              <li><Check size={16} className="text-accent" /> Experienced mountain and highway drivers</li>
              <li><Check size={16} className="text-accent" /> Flexible multi-day tour itineraries with hotel holds</li>
            </ul>

            <div className="spotlight-image-wrap">
              <FleetImg
                src="/images/fleet/hires/toyota-revo.png"
                alt="Toyota Revo 4x4 Intercity and Northern Tour"
                width={800}
                height={500}
                loading="lazy"
              />
            </div>

            <div className="spotlight-actions">
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello! I would like to inquire about intercity / northern tour rental (Murree, Hunza, Swat, etc.).')}`}
                target="_blank"
                rel="noreferrer"
                className="spotlight-btn-wa"
              >
                <MessageCircle size={16} />
                <span>Book Tour Vehicle</span>
              </a>
              <Link to="/services/intercity" className="spotlight-btn-more">
                <span>View Details</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
