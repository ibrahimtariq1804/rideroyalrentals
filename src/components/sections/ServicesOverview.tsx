import { Link } from 'react-router-dom'
import { services } from '@/data/services'
import { Container } from '@/components/ui/Primitives'
import { BentoServiceCard } from '@/components/layout/AtelierPage'
import { motion, useReducedMotion } from 'motion/react'

const serviceArt: Record<string, string> = {
  'self-drive': '/images/fleet/hires/honda-city-2012.png',
  chauffeur: '/images/fleet/hires/prado-2019.png',
  'airport-transfer': '/images/fleet/hires/hiace-grand-cabin.png',
  intercity: '/images/fleet/hires/toyota-revo.png',
  corporate: '/images/fleet/hires/land-cruiser-2019.png',
  'weddings-events': '/images/fleet/hires/mercedes-c180-2022.png',
}

export function ServicesOverview() {
  const reduce = useReducedMotion()
  const [lead, ...rest] = services

  return (
    <section className="atelier-band" aria-labelledby="services-heading">
      <Container>
        <motion.div
          className="atelier-band-head"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="atelier-kicker">Operations</p>
          <h2 id="services-heading" className="atelier-display">
            The desk.
          </h2>
          <p className="atelier-lede atelier-lede--dark">
            Six clear lanes. Large imagery. No faint lists.
          </p>
        </motion.div>

        <div className="bento">
          {lead ? (
            <BentoServiceCard
              featured
              to={lead.path}
              image={serviceArt[lead.slug]}
              index="01"
              title={lead.title}
              kicker={lead.kicker}
            />
          ) : null}
          <div className="bento-stack">
            {rest.slice(0, 2).map((service, index) => (
              <BentoServiceCard
                key={service.slug}
                to={service.path}
                image={serviceArt[service.slug]}
                index={String(index + 2).padStart(2, '0')}
                title={service.title}
                kicker={service.kicker}
              />
            ))}
          </div>
        </div>

        <div className="bento bento--row">
          {rest.slice(2).map((service, index) => (
            <BentoServiceCard
              key={service.slug}
              to={service.path}
              image={serviceArt[service.slug]}
              index={String(index + 4).padStart(2, '0')}
              title={service.title}
              kicker={service.kicker}
            />
          ))}
        </div>

        <div className="atelier-band-foot">
          <Link to="/services" className="atelier-link">
            Open all services
          </Link>
        </div>
      </Container>
    </section>
  )
}
