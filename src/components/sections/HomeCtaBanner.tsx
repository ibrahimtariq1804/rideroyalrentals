import { Link } from 'react-router-dom'
import { Phone, MessageCircle, ArrowRight, Clock } from 'lucide-react'
import { Container } from '@/components/ui/Primitives'
import { business } from '@/data/business'

export function HomeCtaBanner() {
  const cleanPhone = business.whatsAppNumber.replace(/[^\d]/g, '')

  return (
    <section className="home-cta-banner" aria-label="Book your car now">
      <Container>
        <div className="cta-banner-box">
          <div className="cta-banner-content">
            <div className="cta-badge">
              <Clock size={16} />
              <span>INSTANT CONFIRMATION · 24/7 DISPATCH</span>
            </div>

            <h2 className="cta-banner-title">
              Ready to Book Your Ride in <span className="text-accent">Islamabad?</span>
            </h2>

            <p className="cta-banner-desc">
              Contact our team now via WhatsApp or call to check immediate vehicle availability, receive a custom quote, and arrange doorstep handover.
            </p>

            <div className="cta-banner-buttons">
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello Ride Royal Rentals! I would like to book a vehicle right now. Please let me know what cars are available.')}`}
                target="_blank"
                rel="noreferrer"
                className="cta-btn-wa"
              >
                <MessageCircle size={20} />
                <span>Chat on WhatsApp</span>
              </a>

              <a href={`tel:${business.whatsAppNumber}`} className="cta-btn-call">
                <Phone size={18} />
                <span>Call 0321 5373563</span>
              </a>

              <Link to="/fleet" className="cta-btn-browse">
                <span>Browse Full Fleet</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
