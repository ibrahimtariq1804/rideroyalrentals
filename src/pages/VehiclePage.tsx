import { Link, useParams } from 'react-router-dom'
import { getVehicle, similarVehicles, categoryLabels, formatRate, transmissionLabels } from '@/data/fleet'
import { Container, FleetImg, QuoteChip, Button } from '@/components/ui/Primitives'
import { BookingForm } from '@/components/booking/BookingForm'
import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Reveal } from '@/components/animation/MotionBits'

export function VehiclePage() {
  const { slug } = useParams()
  const vehicle = slug ? getVehicle(slug) : undefined
  const [shot, setShot] = useState(0)
  const reduce = useReducedMotion()

  if (!vehicle) {
    return (
      <div className="atelier-vehicle">
        <Container>
          <div className="atelier-empty">
            <h1 className="atelier-display">Vehicle not listed.</h1>
            <Button to="/fleet">Back to fleet</Button>
          </div>
        </Container>
      </div>
    )
  }

  const similar = similarVehicles(vehicle.slug)

  return (
    <div className="atelier-vehicle">
      <div className="atelier-vehicle-hero">
        <motion.div
          className="atelier-vehicle-shot"
          key={shot}
          initial={reduce ? false : { opacity: 0.5, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <FleetImg src={vehicle.gallery[shot] ?? vehicle.heroImage} alt={vehicle.name} width={1600} height={1000} />
        </motion.div>
        <div className="atelier-vehicle-scrim" />
        <div className="atelier-hero-grid" aria-hidden="true" />
        <Container>
          <Reveal>
            <div className="atelier-vehicle-intro">
              <p className="atelier-kicker">{categoryLabels[vehicle.category]}</p>
              <h1 className="atelier-display">{vehicle.name}</h1>
              <p className="atelier-vehicle-rate">
                {vehicle.detail} · {formatRate(vehicle.ratePerDay)}
              </p>
              <p className="atelier-lede">{vehicle.summary}</p>
            </div>
          </Reveal>
        </Container>
      </div>

      <Container>
        <div className="atelier-vehicle-grid">
          <div>
            <div className="atelier-thumbs">
              {vehicle.gallery.map((src, index) => (
                <button
                  type="button"
                  key={src}
                  className={shot === index ? 'is-on' : ''}
                  onClick={() => setShot(index)}
                  aria-label={`Image ${index + 1}`}
                >
                  <FleetImg src={src} alt="" width={280} height={175} />
                </button>
              ))}
            </div>
            <div className="atelier-tags">
              {vehicle.features.map((feature) => (
                <span key={feature}>{feature}</span>
              ))}
            </div>
          </div>

          <aside className="atelier-panel atelier-panel--sticky">
            <QuoteChip />
            <ul className="atelier-specs">
              {vehicle.specs.map((spec) => (
                <li key={spec.label}>
                  <span>{spec.label}</span>
                  <strong>{spec.value}</strong>
                </li>
              ))}
              <li>
                <span>Gearbox</span>
                <strong>{transmissionLabels[vehicle.transmission]}</strong>
              </li>
            </ul>
            <p className="atelier-kicker" style={{ marginTop: 18 }}>
              Ideal · {vehicle.intendedUses.join(' · ')}
            </p>
            <div className="atelier-book">
              <h2 className="atelier-panel-title">Request this car</h2>
              <BookingForm vehicleSlug={vehicle.slug} />
            </div>
          </aside>
        </div>

        <section className="atelier-similar">
          <p className="atelier-kicker">Similar</p>
          <div className="atelier-fleet-grid">
            {similar.map((item) => (
              <Link key={item.slug} to={`/vehicle/${item.slug}`} className="atelier-mini">
                <FleetImg src={item.heroImage} alt={item.name} width={640} height={400} />
                <div>
                  <h3>{item.name}</h3>
                  <QuoteChip />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </div>
  )
}
