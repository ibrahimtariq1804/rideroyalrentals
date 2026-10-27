import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Users,
  Fuel,
  Wind,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Calendar,
  Clock,
  Phone,
  MessageCircle,
  ChevronRight,
  Settings,
  Car,
  FileText,
  HelpCircle,
  Sparkles,
} from 'lucide-react'
import { getVehicle, similarVehicles, categoryLabels, formatRate, transmissionLabels, driveModeLabels } from '@/data/fleet'
import { Container, Button } from '@/components/ui/Primitives'
import { business } from '@/data/business'

export function VehiclePage() {
  const { slug } = useParams()
  const vehicle = slug ? getVehicle(slug) : undefined
  const [activeShot, setActiveShot] = useState(0)

  // Booking Form State for this vehicle
  const [serviceType, setServiceType] = useState('With Driver (Chauffeur)')
  const [pickupCity, setPickupCity] = useState('Islamabad City (Doorstep Delivery)')
  const [pickupDate, setPickupDate] = useState(() => new Date().toISOString().split('T')[0])
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 2)
    return d.toISOString().split('T')[0]
  })
  const [clientPhone, setClientPhone] = useState('')

  if (!vehicle) {
    return (
      <div className="vp-container">
        <Container>
          <div className="vp-not-found">
            <h1>Vehicle Not Found</h1>
            <p>The vehicle you are looking for is currently not in our published inventory.</p>
            <Button to="/fleet">Browse Full Fleet</Button>
          </div>
        </Container>
      </div>
    )
  }

  const similar = similarVehicles(vehicle.slug, 3)
  const cleanPhone = business.whatsAppNumber.replace(/[^\d]/g, '')

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const rateText = vehicle.ratePerDay ? formatRate(vehicle.ratePerDay) : 'Quote on request'
    const msg = [
      `*Rent a Car Inquiry - ${business.name}*`,
      `━━━━━━━━━━━━━━━━━━━`,
      `🚗 *Vehicle:* ${vehicle.name} (${vehicle.detail})`,
      `💰 *Listed Rate:* ${rateText}`,
      `👤 *Service Type:* ${serviceType}`,
      `📍 *Pickup Location:* ${pickupCity}`,
      `📅 *Pickup Date:* ${pickupDate}`,
      `📅 *Return Date:* ${returnDate}`,
      clientPhone ? `📞 *Client Contact:* ${clientPhone}` : '',
      `━━━━━━━━━━━━━━━━━━━`,
      `Please confirm immediate vehicle availability, total quote, and booking procedure.`,
    ]
      .filter(Boolean)
      .join('\n')

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
    window.open(waUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="vp-page">
      {/* 1. Breadcrumbs & Vehicle Title Header */}
      <section className="vp-header-section">
        <Container>
          <nav className="vp-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={14} />
            <Link to="/fleet">Fleet</Link>
            <ChevronRight size={14} />
            <span className="current">{vehicle.name}</span>
          </nav>

          <div className="vp-title-row">
            <div>
              <div className="vp-badge-row">
                <span className="vp-cat-badge">{categoryLabels[vehicle.category]}</span>
                <span className="vp-status-badge">
                  <span className="status-dot" />
                  Available 24/7 in Islamabad & Rawalpindi
                </span>
              </div>
              <h1 className="vp-title">{vehicle.name}</h1>
              <p className="vp-subtitle">{vehicle.detail} · Verified & Fully Sanitized Luxury Fleet</p>
            </div>

            <div className="vp-rate-box">
              <span className="vp-rate-label">Daily Rental Rate</span>
              <div className="vp-rate-value">
                {vehicle.ratePerDay ? (
                  <>
                    <span className="currency">Rs.</span> {vehicle.ratePerDay.toLocaleString('en-PK')}{' '}
                    <span className="per-day">/ day</span>
                  </>
                ) : (
                  <span className="quote-text">Quote on request</span>
                )}
              </div>
              <span className="vp-rate-note">Best price guaranteed · No hidden fees</span>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Main Vehicle Showcase & Interactive Booking Grid */}
      <Container>
        <div className="vp-layout-grid">
          {/* Left Column: Photos, Specs, Description & Guarantees */}
          <div className="vp-main-column">
            {/* High-Resolution Car Showcase Stage */}
            <div className="vp-stage-card">
              <div className="vp-stage-image-wrap">
                <img
                  src={vehicle.gallery[activeShot] ?? vehicle.heroImage}
                  alt={vehicle.name}
                  className="vp-stage-img"
                  loading="eager"
                />
              </div>

              {vehicle.gallery.length > 1 && (
                <div className="vp-gallery-thumbs">
                  {vehicle.gallery.map((src, index) => (
                    <button
                      type="button"
                      key={src}
                      className={`vp-thumb-btn ${activeShot === index ? 'is-active' : ''}`}
                      onClick={() => setActiveShot(index)}
                      aria-label={`View photo ${index + 1}`}
                    >
                      <img src={src} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Specs Highlight Cards (6 Key Pillars) */}
            <div className="vp-specs-highlight-grid">
              <div className="vp-spec-item">
                <div className="vp-spec-icon-wrap">
                  <Users size={22} />
                </div>
                <div>
                  <span className="vp-spec-label">Capacity</span>
                  <strong className="vp-spec-value">{vehicle.seats} Passengers</strong>
                </div>
              </div>

              <div className="vp-spec-item">
                <div className="vp-spec-icon-wrap">
                  <Settings size={22} />
                </div>
                <div>
                  <span className="vp-spec-label">Transmission</span>
                  <strong className="vp-spec-value">{transmissionLabels[vehicle.transmission]}</strong>
                </div>
              </div>

              <div className="vp-spec-item">
                <div className="vp-spec-icon-wrap">
                  <Fuel size={22} />
                </div>
                <div>
                  <span className="vp-spec-label">Fuel Type</span>
                  <strong className="vp-spec-value">{vehicle.fuelType}</strong>
                </div>
              </div>

              <div className="vp-spec-item">
                <div className="vp-spec-icon-wrap">
                  <Car size={22} />
                </div>
                <div>
                  <span className="vp-spec-label">Engine</span>
                  <strong className="vp-spec-value">{vehicle.engineCapacity}</strong>
                </div>
              </div>

              <div className="vp-spec-item">
                <div className="vp-spec-icon-wrap">
                  <Wind size={22} />
                </div>
                <div>
                  <span className="vp-spec-label">Air Conditioning</span>
                  <strong className="vp-spec-value">{vehicle.acType}</strong>
                </div>
              </div>

              <div className="vp-spec-item">
                <div className="vp-spec-icon-wrap">
                  <Briefcase size={22} />
                </div>
                <div>
                  <span className="vp-spec-label">Luggage Room</span>
                  <strong className="vp-spec-value">{vehicle.luggageCapacity}</strong>
                </div>
              </div>
            </div>

            {/* Vehicle Overview Section */}
            <div className="vp-card vp-overview-card">
              <div className="vp-card-title-row">
                <FileText className="vp-card-title-icon" size={20} />
                <h2>Vehicle Overview</h2>
              </div>
              <p className="vp-desc-text">{vehicle.description}</p>
              <p className="vp-desc-text">
                Whether you need a reliable ride for business meetings in Islamabad, seamless 24/7 pick and drop at
                Islamabad International Airport (ISB), wedding protocol arrangements, or an exciting trip to Murree,
                Bhurban, Naran, Hunza, or Swat, the <strong>{vehicle.name}</strong> delivers unmatched comfort, safety,
                and performance.
              </p>

              <div className="vp-pill-tags-row">
                {vehicle.intendedUses.map((use) => (
                  <span key={use} className="vp-tag-pill">
                    Ideal for: {use.charAt(0).toUpperCase() + use.slice(1)}
                  </span>
                ))}
                <span className="vp-tag-pill">{driveModeLabels[vehicle.driveMode]}</span>
              </div>
            </div>

            {/* Complete Technical Specifications Table */}
            <div className="vp-card vp-specs-table-card">
              <div className="vp-card-title-row">
                <Settings className="vp-card-title-icon" size={20} />
                <h2>Technical & Rental Specifications</h2>
              </div>

              <div className="vp-specs-table">
                {vehicle.specs.map((item, idx) => (
                  <div key={item.label} className={`vp-table-row ${idx % 2 === 0 ? 'row-even' : 'row-odd'}`}>
                    <span className="vp-table-label">{item.label}</span>
                    <strong className="vp-table-val">{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Included in Every Rental */}
            <div className="vp-card vp-guarantees-card">
              <div className="vp-card-title-row">
                <ShieldCheck className="vp-card-title-icon" size={20} />
                <h2>Included With Your Rental</h2>
              </div>

              <div className="vp-guarantees-grid">
                <div className="vp-guarantee-box">
                  <CheckCircle2 size={18} className="vp-check-icon" />
                  <div>
                    <strong>Sanitized & Odor-Free Vehicle</strong>
                    <p>Cleaned and inspected before every single delivery.</p>
                  </div>
                </div>

                <div className="vp-guarantee-box">
                  <CheckCircle2 size={18} className="vp-check-icon" />
                  <div>
                    <strong>24/7 Roadside Assistance</strong>
                    <p>Immediate support and quick replacement car guarantee.</p>
                  </div>
                </div>

                <div className="vp-guarantee-box">
                  <CheckCircle2 size={18} className="vp-check-icon" />
                  <div>
                    <strong>Professional Chauffeur Option</strong>
                    <p>Polite, punctual, and route-experienced drivers.</p>
                  </div>
                </div>

                <div className="vp-guarantee-box">
                  <CheckCircle2 size={18} className="vp-check-icon" />
                  <div>
                    <strong>Doorstep Vehicle Handover</strong>
                    <p>Direct delivery to your home, office, hotel, or airport.</p>
                  </div>
                </div>

                <div className="vp-guarantee-box">
                  <CheckCircle2 size={18} className="vp-check-icon" />
                  <div>
                    <strong>Zero Hidden Charges</strong>
                    <p>What we quote is what you pay. Transparent fuel policy.</p>
                  </div>
                </div>

                <div className="vp-guarantee-box">
                  <CheckCircle2 size={18} className="vp-check-icon" />
                  <div>
                    <strong>Outstation & Northern Area Ready</strong>
                    <p>Equipped and certified for intercity travel and mountain roads.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rental Requirements & Policy */}
            <div className="vp-card vp-requirements-card">
              <div className="vp-card-title-row">
                <HelpCircle className="vp-card-title-icon" size={20} />
                <h2>Rental Requirements & Terms</h2>
              </div>

              <div className="vp-requirements-columns">
                <div className="vp-req-col">
                  <h3>Required Documents</h3>
                  <ul>
                    <li>
                      <strong>Original CNIC / National ID:</strong> Or valid Passport for Overseas Pakistanis and
                      foreign travelers.
                    </li>
                    <li>
                      <strong>Valid Driving License:</strong> Required only for self-drive rentals.
                    </li>
                    <li>
                      <strong>Security Deposit:</strong> Refundable security deposit collected upon handover and
                      returned upon safe return.
                    </li>
                  </ul>
                </div>

                <div className="vp-req-col">
                  <h3>Timing & Policies</h3>
                  <ul>
                    <li>
                      <strong>Rental Calculation:</strong> Standard daily rental is calculated on a 12-hour or 24-hour
                      basis depending on requirement.
                    </li>
                    <li>
                      <strong>Fuel Policy:</strong> Provided with fuel level noted; please return vehicle with the same
                      level.
                    </li>
                    <li>
                      <strong>Driver Allowance:</strong> Outstation driver food & accommodation applies for overnight
                      tours outside Islamabad/Rawalpindi.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Instant Reservation Card */}
          <aside className="vp-sidebar-column">
            <div className="vp-sticky-reservation-card">
              <div className="vp-res-header">
                <div className="vp-res-badge">
                  <Clock size={14} />
                  <span>24/7 Instant Dispatch</span>
                </div>
                <h3 className="vp-res-title">Book {vehicle.name}</h3>
                <p className="vp-res-sub">Fastest confirmation via WhatsApp · No pre-payment required</p>

                <div className="vp-res-pricing-pill">
                  <span>Rate:</span>
                  <strong>{formatRate(vehicle.ratePerDay)}</strong>
                </div>
              </div>

              <form className="vp-res-form" onSubmit={handleBookingSubmit}>
                <div className="vp-form-group">
                  <label htmlFor="res-service">
                    <ShieldCheck size={15} />
                    <span>Service Type</span>
                  </label>
                  <select
                    id="res-service"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    required
                  >
                    <option value="With Driver (Chauffeur)">With Driver (Chauffeur)</option>
                    <option value="Self-Drive Rental">Self-Drive Rental</option>
                    <option value="Islamabad Airport Transfer (ISB)">Airport Pick & Drop</option>
                    <option value="Wedding / VIP Protocol">Wedding / Protocol</option>
                    <option value="Northern Tour (Murree, Hunza, Swat)">Northern Tour</option>
                  </select>
                </div>

                <div className="vp-form-group">
                  <label htmlFor="res-location">
                    <MapPin size={15} />
                    <span>Pickup Location</span>
                  </label>
                  <select
                    id="res-location"
                    value={pickupCity}
                    onChange={(e) => setPickupCity(e.target.value)}
                    required
                  >
                    <option value="Islamabad City (Doorstep Delivery)">Islamabad City (Doorstep)</option>
                    <option value="Rawalpindi City (Doorstep Delivery)">Rawalpindi City (Doorstep)</option>
                    <option value="Islamabad International Airport (ISB)">Islamabad Airport (ISB)</option>
                    <option value="Lahore / Intercity Route">Lahore / Intercity</option>
                    <option value="Murree / Northern Areas">Murree / Northern Route</option>
                  </select>
                </div>

                <div className="vp-form-row">
                  <div className="vp-form-group">
                    <label htmlFor="res-pickup-date">
                      <Calendar size={15} />
                      <span>Pickup Date</span>
                    </label>
                    <input
                      id="res-pickup-date"
                      type="date"
                      value={pickupDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setPickupDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="vp-form-group">
                    <label htmlFor="res-return-date">
                      <Calendar size={15} />
                      <span>Return Date</span>
                    </label>
                    <input
                      id="res-return-date"
                      type="date"
                      value={returnDate}
                      min={pickupDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="vp-form-group">
                  <label htmlFor="res-phone">
                    <Phone size={15} />
                    <span>Your WhatsApp / Phone</span>
                  </label>
                  <input
                    id="res-phone"
                    type="tel"
                    placeholder="e.g. 0300 1234567"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                  />
                </div>

                <button type="submit" className="vp-btn-submit-wa">
                  <MessageCircle size={20} />
                  <span>Get Instant Quote on WhatsApp</span>
                </button>

                <a href={`tel:${business.whatsAppNumber}`} className="vp-btn-direct-call">
                  <Phone size={16} />
                  <span>Call Directly: {business.phoneDisplay}</span>
                </a>

                <div className="vp-res-footer-trust">
                  <span>✓ 100% Free Inquiry</span>
                  <span>✓ Instant 2-Min Reply</span>
                  <span>✓ Zero Advance Obligation</span>
                </div>
              </form>
            </div>

            {/* Direct Support Card */}
            <div className="vp-support-card">
              <Sparkles size={20} className="vp-support-icon" />
              <h4>Need Custom Wedding or Protocol Rates?</h4>
              <p>Special discounted packages available for weekly bookings, corporate fleets, and wedding entourages.</p>
              <a href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello Ride Royal Rentals! I would like to inquire about wedding/protocol packages for ${vehicle.name}.`)}`} target="_blank" rel="noreferrer">
                Inquire Special Packages →
              </a>
            </div>
          </aside>
        </div>

        {/* 3. Similar Vehicles Section */}
        {similar.length > 0 && (
          <section className="vp-similar-section">
            <div className="vp-similar-header">
              <span className="vp-similar-pill">More Options</span>
              <h2>Similar {categoryLabels[vehicle.category]} in Our Fleet</h2>
              <p>Explore other fully inspected and sanitized cars in this category.</p>
            </div>

            <div className="vp-similar-grid">
              {similar.map((item) => (
                <div key={item.slug} className="vp-similar-card">
                  <div className="vp-similar-img-link">
                    <Link to={`/vehicle/${item.slug}`}>
                      <img src={item.heroImage} alt={item.name} loading="lazy" />
                    </Link>
                  </div>
                  <div className="vp-similar-card-body">
                    <div className="vp-similar-meta">
                      <span className="vp-sm-tag">{item.detail}</span>
                      <strong className="vp-sm-rate">{formatRate(item.ratePerDay)}</strong>
                    </div>
                    <h3 className="vp-similar-name">
                      <Link to={`/vehicle/${item.slug}`}>{item.name}</Link>
                    </h3>
                    <div className="vp-similar-actions">
                      <Link to={`/vehicle/${item.slug}`} className="vp-sm-view-btn">
                        View Details
                      </Link>
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello Ride Royal Rentals! I am interested in renting the ${item.name}. Please confirm availability.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="vp-sm-wa-btn"
                        aria-label={`Inquire about ${item.name} on WhatsApp`}
                      >
                        <MessageCircle size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  )
}
