import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, MessageCircle, ShieldCheck, CheckCircle2, Car, Calendar, MapPin, ArrowRight, Star, Clock } from 'lucide-react'
import { business } from '@/data/business'
import { vehicles, formatRate } from '@/data/fleet'
import { Container } from '@/components/ui/Primitives'

export function SimpleHero() {
  const [selectedVehicle, setSelectedVehicle] = useState('Toyota Land Cruiser Prado')
  const [serviceType, setServiceType] = useState('With Driver (Chauffeur)')
  const [pickupCity, setPickupCity] = useState('Islamabad City (Doorstep Delivery)')
  const [pickupDate, setPickupDate] = useState(() => new Date().toISOString().split('T')[0])
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 2)
    return d.toISOString().split('T')[0]
  })
  const [customerPhone, setCustomerPhone] = useState('')

  const cleanPhone = business.whatsAppNumber.replace(/[^\d]/g, '')

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const msg = [
      `*Rent a Car Reservation - ${business.name}*`,
      `━━━━━━━━━━━━━━━━━━━`,
      `🚗 *Vehicle:* ${selectedVehicle}`,
      `👤 *Service:* ${serviceType}`,
      `📍 *Location:* ${pickupCity}`,
      `📅 *Pickup Date:* ${pickupDate}`,
      `📅 *Return Date:* ${returnDate}`,
      customerPhone ? `📞 *Client Contact:* ${customerPhone}` : '',
      `━━━━━━━━━━━━━━━━━━━`,
      `Please confirm immediate availability, total quote, and booking details.`,
    ]
      .filter(Boolean)
      .join('\n')

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
    window.open(waUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="simple-hero" aria-label="Welcome to Ride Royal Rentals">
      <Container>
        <div className="simple-hero-grid">
          {/* Left Column: Heading, Trust Points, and Action Buttons */}
          <div className="simple-hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              <span>#1 Car Rental · Islamabad & Rawalpindi</span>
            </div>

            <h1 className="simple-hero-title">
              Affordable, Reliable & <span className="text-accent">Luxury Car Rental</span>
            </h1>

            <p className="simple-hero-desc">
              Experience hassle-free mobility with Pakistan’s premier fleet. Clean, fully inspected vehicles available 24/7 with professional chauffeurs or self-drive. Doorstep delivery across Islamabad, Rawalpindi, airport transfers, and northern tours at guaranteed best rates.
            </p>

            <div className="hero-trust-list">
              <div className="trust-item">
                <CheckCircle2 className="trust-icon" size={20} />
                <span>24/7 Airport Pick & Drop</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 className="trust-icon" size={20} />
                <span>Self-Drive & Chauffeur</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 className="trust-icon" size={20} />
                <span>Doorstep Vehicle Delivery</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 className="trust-icon" size={20} />
                <span>Zero Hidden Charges</span>
              </div>
            </div>

            <div className="simple-hero-buttons">
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello Ride Royal Rentals! I would like to inquire about car rental availability and rates.')}`}
                target="_blank"
                rel="noreferrer"
                className="btn-hero-wa"
              >
                <MessageCircle size={20} />
                <span>Book on WhatsApp</span>
              </a>

              <a href={`tel:${business.whatsAppNumber}`} className="btn-hero-call">
                <Phone size={18} />
                <span>Call 0321 5373563</span>
              </a>

              <Link to="/fleet" className="btn-hero-fleet">
                <span>Browse Full Fleet</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Social Proof Bar */}
            <div className="hero-social-proof">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--accent)" color="var(--accent)" />
                ))}
              </div>
              <span className="proof-text">
                <strong>4.9 / 5 Rating</strong> · Trusted by 500+ travelers, expats & executives
              </span>
            </div>
          </div>

          {/* Right Column: Professional Direct Reservation & Instant Quote Card */}
          <div className="simple-hero-booking-wrap">
            <div className="hero-booking-card">
              <div className="booking-card-header">
                <div className="booking-card-badge">
                  <Clock size={15} />
                  <span>24/7 Instant Dispatch</span>
                </div>
                <h3 className="booking-card-title">Book Your Ride in Seconds</h3>
                <p className="booking-card-sub">Select your vehicle & receive a confirmed quote via WhatsApp</p>
              </div>

              <form className="hero-booking-form" onSubmit={handleBookingSubmit}>
                <div className="form-field-group">
                  <label htmlFor="hb-car">
                    <Car size={16} />
                    <span>Choose Vehicle</span>
                  </label>
                  <select
                    id="hb-car"
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    required
                  >
                    {vehicles.map((v) => (
                      <option key={v.slug} value={v.name}>
                        {v.name} {v.ratePerDay ? `— ${formatRate(v.ratePerDay)}` : '— Quote on request'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field-row">
                  <div className="form-field-group">
                    <label htmlFor="hb-service">
                      <ShieldCheck size={16} />
                      <span>Rental Type</span>
                    </label>
                    <select
                      id="hb-service"
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                    >
                      <option value="With Driver (Chauffeur)">With Driver (Chauffeur)</option>
                      <option value="Self-Drive Rental">Self-Drive Rental</option>
                      <option value="Islamabad Airport Transfer (ISB)">Airport Pick & Drop</option>
                      <option value="Wedding / VIP Protocol">Wedding / Protocol</option>
                      <option value="Northern Tour (Murree, Hunza, Swat)">Northern Tour</option>
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="hb-location">
                      <MapPin size={16} />
                      <span>Pickup Location</span>
                    </label>
                    <select
                      id="hb-location"
                      value={pickupCity}
                      onChange={(e) => setPickupCity(e.target.value)}
                    >
                      <option value="Islamabad City (Doorstep Delivery)">Islamabad City</option>
                      <option value="Rawalpindi City (Doorstep Delivery)">Rawalpindi City</option>
                      <option value="Islamabad International Airport (ISB)">Islamabad Airport (ISB)</option>
                      <option value="Lahore / Intercity Route">Lahore / Intercity</option>
                      <option value="Murree / Northern Areas">Murree / Northern Route</option>
                    </select>
                  </div>
                </div>

                <div className="form-field-row">
                  <div className="form-field-group">
                    <label htmlFor="hb-pickup">
                      <Calendar size={16} />
                      <span>Pickup Date</span>
                    </label>
                    <input
                      id="hb-pickup"
                      type="date"
                      value={pickupDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setPickupDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="hb-return">
                      <Calendar size={16} />
                      <span>Return Date</span>
                    </label>
                    <input
                      id="hb-return"
                      type="date"
                      value={returnDate}
                      min={pickupDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-field-group">
                  <label htmlFor="hb-contact">
                    <Phone size={16} />
                    <span>Your WhatsApp / Phone (Optional)</span>
                  </label>
                  <input
                    id="hb-contact"
                    type="tel"
                    placeholder="e.g. 0300 1234567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>

                <button type="submit" className="hero-submit-btn">
                  <MessageCircle size={20} />
                  <span>Get Instant Quote on WhatsApp</span>
                </button>

                <div className="booking-card-guarantees">
                  <span>✓ 100% Free Inquiry</span>
                  <span>✓ No Hidden Fees</span>
                  <span>✓ Instant Response</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
