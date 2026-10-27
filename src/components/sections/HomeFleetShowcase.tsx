import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Users, Settings2, Shield, ArrowRight } from 'lucide-react'
import { vehicles, categoryLabels, formatRate, type VehicleCategory } from '@/data/fleet'
import { business } from '@/data/business'
import { Container, FleetImg } from '@/components/ui/Primitives'

type TabOption = 'all' | VehicleCategory

const tabs: { key: TabOption; label: string }[] = [
  { key: 'all', label: 'All Cars' },
  { key: 'economy', label: 'Economy' },
  { key: 'sedan', label: 'Sedans' },
  { key: 'suv', label: 'SUVs & 4x4' },
  { key: 'premium', label: 'Luxury & Protocol' },
  { key: 'group', label: 'Vans & Coaches' },
]

export function HomeFleetShowcase() {
  const [activeTab, setActiveTab] = useState<TabOption>('all')
  const cleanPhone = business.whatsAppNumber.replace(/[^\d]/g, '')

  const filteredVehicles = vehicles.filter((v) => {
    if (activeTab === 'all') return true
    return v.category === activeTab
  })

  // Show up to 12 featured cars on home page so it loads super fast, with button to view all
  const displayVehicles = filteredVehicles.slice(0, 12)

  return (
    <section className="home-fleet-section" id="fleet-showcase" aria-labelledby="fleet-heading">
      <Container>
        <div className="section-header-center">
          <div className="section-pill">OUR RENT A CAR ISLAMABAD FLEET</div>
          <h2 id="fleet-heading" className="section-title-large">
            Choose Your <span className="text-accent">Perfect Ride</span>
          </h2>
          <p className="section-desc-center">
            Explore our wide range of fully inspected, clean vehicles ready for daily, weekly, or monthly rental in Islamabad and Rawalpindi.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="fleet-tabs-row" role="tablist">
          {tabs.map((tab) => {
            const count = tab.key === 'all' 
              ? vehicles.length 
              : vehicles.filter((v) => v.category === tab.key).length
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.key}
                className={`fleet-tab-btn ${activeTab === tab.key ? 'is-active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span>{tab.label}</span>
                <span className="tab-count">({count})</span>
              </button>
            )
          })}
        </div>

        {/* Vehicle Cards Grid */}
        <div className="fleet-cards-grid">
          {displayVehicles.map((vehicle) => {
            const waText = `Hello ${business.name}! I would like to book the ${vehicle.name} (${formatRate(vehicle.ratePerDay)}). Is it available for rent?`
            const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`

            return (
              <div key={vehicle.slug} className="simple-car-card">
                <div className="car-card-top">
                  <span className="car-card-tag">{categoryLabels[vehicle.category]}</span>
                  <span className="car-card-rate">{formatRate(vehicle.ratePerDay)}</span>
                </div>

                <Link to={`/vehicle/${vehicle.slug}`} className="car-card-image-link" aria-label={`View ${vehicle.name} details`}>
                  <FleetImg
                    src={vehicle.heroImage}
                    alt={vehicle.name}
                    width={600}
                    height={380}
                    loading="lazy"
                  />
                </Link>

                <div className="car-card-body">
                  <h3 className="car-card-name">
                    <Link to={`/vehicle/${vehicle.slug}`}>{vehicle.name}</Link>
                  </h3>
                  <p className="car-card-detail">{vehicle.detail}</p>

                  <div className="car-card-specs">
                    <div className="spec-badge" title="Passenger Seats">
                      <Users size={14} />
                      <span>{vehicle.seats} Seats</span>
                    </div>
                    <div className="spec-badge" title="Transmission">
                      <Settings2 size={14} />
                      <span>{vehicle.transmission === 'both' ? 'Auto/Man' : vehicle.transmission}</span>
                    </div>
                    <div className="spec-badge" title="Drive Option">
                      <Shield size={14} />
                      <span>{vehicle.driveMode === 'both' ? 'Driver/Self' : vehicle.driveMode}</span>
                    </div>
                  </div>

                  <div className="car-card-actions">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="car-btn-wa"
                      aria-label={`Book ${vehicle.name} on WhatsApp`}
                    >
                      <MessageCircle size={16} />
                      <span>Book on WhatsApp</span>
                    </a>

                    <Link to={`/vehicle/${vehicle.slug}`} className="car-btn-details">
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* View All Fleet CTA */}
        <div className="fleet-view-all-wrap">
          <Link to="/fleet" className="btn-view-all-fleet">
            <span>View All {vehicles.length} Vehicles in Fleet</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </Container>
    </section>
  )
}
