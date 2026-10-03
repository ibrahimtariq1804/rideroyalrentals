import { Link } from 'react-router-dom'
import { business } from '@/data/business'
import { services } from '@/data/services'
import { Container } from '@/components/ui/Primitives'

export function Footer() {
  return (
    <footer className="footer">
      <Container>
        <div className="footer-grid">
          <div>
            <Link to="/" className="footer-brand" aria-label={`${business.name} home`}>
              <img src="/brand/logo-full.webp" alt={business.name} width={200} height={54} />
            </Link>
            <p style={{ color: 'var(--text-dim)', maxWidth: '36ch', marginTop: 14 }}>
              Islamabad rent-a-car fleet. Quotes on request. No invented rates, numbers, or reviews.
            </p>
          </div>
          <div className="footer-links">
            <p className="kicker">Move</p>
            <Link to="/fleet">Fleet</Link>
            <Link to="/booking">Booking</Link>
            <Link to="/services">Services</Link>
            <Link to="/faq">FAQ</Link>
          </div>
          <div className="footer-links">
            <p className="kicker">Services</p>
            {services.map((service) => (
              <Link key={service.slug} to={service.path}>
                {service.title}
              </Link>
            ))}
          </div>
          <div className="footer-links">
            <p className="kicker">House</p>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            {business.instagramUrl ? (
              <a href={business.instagramUrl} target="_blank" rel="noreferrer">
                Instagram
              </a>
            ) : null}
            {business.mapsUrl ? (
              <a href={business.mapsUrl} target="_blank" rel="noreferrer">
                Map
              </a>
            ) : null}
          </div>
        </div>
                <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <span>
            &copy; {new Date().getFullYear()} {business.name}. All rights reserved.
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Managed by <a href="https://lazyfoxxes.com" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: 'var(--accent)', fontWeight: 600 }}>Lazyfoxxes</a>
          </span>
        </div>
      </Container>
    </footer>
  )
}

