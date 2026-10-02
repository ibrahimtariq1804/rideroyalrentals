import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { BookingForm } from '@/components/booking/BookingForm'
import { ContactForm } from '@/components/booking/ContactForm'
import { AtelierPage, BentoServiceCard } from '@/components/layout/AtelierPage'
import { faqs } from '@/data/faq'
import { services } from '@/data/services'
import { business } from '@/data/business'
import { Button, Container, FleetImg } from '@/components/ui/Primitives'
import { Reveal } from '@/components/animation/MotionBits'

const serviceArt: Record<string, string> = {
  'self-drive': '/images/fleet/hires/honda-city-2012.png',
  chauffeur: '/images/fleet/hires/prado-2019.png',
  'airport-transfer': '/images/fleet/hires/hiace-grand-cabin.png',
  intercity: '/images/fleet/hires/toyota-revo.png',
  corporate: '/images/fleet/hires/land-cruiser-2019.png',
  'weddings-events': '/images/fleet/hires/mercedes-c180-2012.png',
}

export function ServicesPage() {
  const [lead, ...rest] = services

  return (
    <AtelierPage
      kicker="Services"
      title="Six lanes."
      lede="Pick an operation. Send dates. A human quote — never a fake cart."
      image="/images/fleet/hires/toyota-revo.png"
      imageAlt="Toyota Revo"
      cta={{ to: '/booking', label: 'Request a quote' }}
    >
      <Container>
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
      </Container>
    </AtelierPage>
  )
}

export function ServiceDetailPage({ slug }: { slug: string }) {
  const service = services.find((item) => item.slug === slug)
  if (!service) return null
  const others = services.filter((item) => item.slug !== slug)

  return (
    <AtelierPage
      kicker={service.kicker}
      title={service.title}
      lede={service.summary}
      image={serviceArt[service.slug] ?? '/images/fleet/hires/land-cruiser-2019.png'}
      imageAlt={service.title}
      cta={{ to: '/booking', label: 'Request a quote' }}
    >
      <Container>
        <div className="atelier-split">
          <Reveal>
            <article className="atelier-panel">
              {service.copy.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <ul className="atelier-bullets">
                {service.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <div className="atelier-actions">
                <Button to="/booking">Request a quote</Button>
                <Button to="/services" variant="ghost">
                  All services
                </Button>
              </div>
            </article>
          </Reveal>

          <aside className="atelier-rail">
            <p className="atelier-kicker">Also in house</p>
            {others.map((item) => (
              <Link key={item.slug} to={item.path} className="atelier-rail-item">
                <FleetImg src={serviceArt[item.slug]} alt="" width={200} height={120} />
                <span>
                  <strong>{item.title}</strong>
                  <em>{item.kicker}</em>
                </span>
              </Link>
            ))}
          </aside>
        </div>
      </Container>
    </AtelierPage>
  )
}

export function SelfDrivePage() {
  return <ServiceDetailPage slug="self-drive" />
}
export function ChauffeurPage() {
  return <ServiceDetailPage slug="chauffeur" />
}
export function AirportPage() {
  return <ServiceDetailPage slug="airport-transfer" />
}
export function IntercityPage() {
  return <ServiceDetailPage slug="intercity" />
}
export function CorporatePage() {
  return <ServiceDetailPage slug="corporate" />
}
export function WeddingsPage() {
  return <ServiceDetailPage slug="weddings-events" />
}

export function BookingPage() {
  return (
    <AtelierPage
      kicker="Booking"
      title="Request the road."
      lede="Structured itinerary. No CNIC upload. No card number. A human quote back."
      image="/images/fleet/hires/honda-civic-11th.png"
      imageAlt="Honda Civic 11th Gen"
    >
      <Container>
        <div className="desk-board">
          <Reveal>
            <div className="desk-card">
              <div className="desk-card-head">
                <div>
                  <p className="atelier-kicker">Itinerary</p>
                  <h2>Tell us where.</h2>
                </div>
                <p>One form. Real stock check. Quote by reply — never a fake checkout.</p>
              </div>
              <div className="desk-card-body">
                <BookingForm />
              </div>
            </div>
          </Reveal>
          <aside className="desk-side">
            {[
              ['01', 'Send', 'Dates, city, class, chauffeur or self-drive.'],
              ['02', 'Confirm', 'We check real stock — nothing invented.'],
              ['03', 'Drive', 'A human quote, then the car is prepared.'],
            ].map(([n, t, b]) => (
              <div className="desk-side-card" key={n}>
                <span className="desk-n">{n}</span>
                <h3>{t}</h3>
                <p>{b}</p>
              </div>
            ))}
            <div className="desk-side-foot">
              <Button to="/contact" variant="ghost">
                Prefer to write first
              </Button>
            </div>
          </aside>
        </div>
      </Container>
    </AtelierPage>
  )
}

const aboutGallery = [
  { src: '/images/fleet/hires/land-cruiser-2019.png', label: 'Land Cruiser 2019' },
  { src: '/images/fleet/hires/prado-2019.png', label: 'Prado 2019' },
]

export function AboutPage() {
  return (
    <AtelierPage
      kicker="About"
      title="Built for the desk."
      lede="Islamabad fleet. Campaign craft. Quotes only — no fake ratings."
      image="/images/fleet/hires/land-cruiser-2019.png"
      imageAlt="Land Cruiser 2019"
      cta={{ to: '/fleet', label: 'Browse fleet' }}
    >
      <Container>
        <div className="about-stack">
          <div className="about-story">
            <div className="about-copy">
              <p className="atelier-kicker">Operations</p>
              <h2>Live inventory. Honest replies.</h2>
              <p>
                RIDEROYALRENTALS lists a live Islamabad inventory for quote requests. We do not invent phone numbers,
                addresses, or testimonials.
              </p>
              <p>
                Every enquiry is answered by a person who knows what is actually available — not by a cart that pretends
                stock exists.
              </p>
            </div>
            <figure className="about-shot">
              <FleetImg src={aboutGallery[0].src} alt={aboutGallery[0].label} width={1200} height={800} />
              <figcaption>{aboutGallery[0].label}</figcaption>
            </figure>
          </div>

          <div className="about-points">
            <div className="about-point">
              <span>01</span>
              <h3>Fleet first</h3>
              <p>Rates and classes from the published Islamabad list — confirmed again at quote.</p>
            </div>
            <div className="about-point">
              <span>02</span>
              <h3>No theatre</h3>
              <p>No fake reviews, no invented scores, no phantom availability.</p>
            </div>
            <div className="about-point">
              <span>03</span>
              <h3>Campaign craft</h3>
              <p>Homepage visuals sell the mood. The car you drive is the one we assign in writing.</p>
            </div>
          </div>

          <div className="about-story about-story--flip">
            <div className="about-copy">
              <p className="atelier-kicker">Credits</p>
              <h2>What is campaign. What is stock.</h2>
              <p>
                Homepage LX 600 study by {business.modelCredit.creator} ({business.modelCredit.license}) — campaign
                visual, not a claim every booking includes that car.
              </p>
              <p>Photography credits live in public/images/fleet/CREDITS.json.</p>
              <div className="atelier-actions" style={{ marginTop: 20 }}>
                <Button to="/fleet">Browse fleet</Button>
                <Button to="/booking" variant="ghost">
                  Request a quote
                </Button>
              </div>
            </div>
            <figure className="about-shot">
              <FleetImg src={aboutGallery[1].src} alt={aboutGallery[1].label} width={1200} height={800} />
              <figcaption>{aboutGallery[1].label}</figcaption>
            </figure>
          </div>
        </div>
      </Container>
    </AtelierPage>
  )
}

export function ContactPage() {
  return (
    <AtelierPage
      kicker="Contact"
      title="Write the desk."
      lede="Conversation here. Dates and class on Booking."
      image="/images/fleet/hires/prado-2019.png"
      imageAlt="Prado 2019"
    >
      <Container>
        <div className="desk-board">
          <Reveal>
            <div className="desk-card">
              <div className="desk-card-head">
                <div>
                  <p className="atelier-kicker">Message</p>
                  <h2>A note to operations.</h2>
                </div>
                <p>Questions, partnerships, or a first hello. For a car, use Booking.</p>
              </div>
              <div className="desk-card-body">
                <ContactForm />
              </div>
            </div>
          </Reveal>
          <aside className="desk-side">
            <div className="desk-side-card">
              <span className="desk-n">WA</span>
              <h3>WhatsApp</h3>
              <p>{business.whatsAppNumber ? 'Configured on this build.' : 'Unset — no fake number shown.'}</p>
            </div>
            <div className="desk-side-card">
              <span className="desk-n">@</span>
              <h3>Email</h3>
              <p>{business.contactEmail || 'Unset until a real address is supplied.'}</p>
            </div>
            <div className="desk-side-card">
              <span className="desk-n">01</span>
              <h3>Need a car</h3>
              <p>Dates and class belong on the booking desk — not in a free-form note.</p>
            </div>
            <div className="desk-side-foot">
              <Button to="/booking">Go to booking</Button>
            </div>
          </aside>
        </div>
      </Container>
    </AtelierPage>
  )
}

export function FaqPage() {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null)
  const reduce = useReducedMotion()
  return (
    <AtelierPage
      kicker="FAQ"
      title="Clear answers."
      lede="No scores. No reviews. No stock theatre."
      image="/images/fleet/hires/honda-civic-11th.png"
      imageAlt="Honda Civic 11th Gen"
    >
      <Container>
        <div className="atelier-faq">
          {faqs.map((item, index) => (
            <motion.div
              key={item.id}
              className={`atelier-faq-item ${open === item.id ? 'is-open' : ''}`}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <button type="button" aria-expanded={open === item.id} onClick={() => setOpen(open === item.id ? null : item.id)}>
                <span>{item.question}</span>
                <span>{open === item.id ? '–' : '+'}</span>
              </button>
              {open === item.id ? <p>{item.answer}</p> : null}
            </motion.div>
          ))}
        </div>
      </Container>
    </AtelierPage>
  )
}

export function TermsPage() {
  return (
    <AtelierPage
      kicker="Legal"
      title="Terms."
      lede="A form is a quote request — not a contract."
      image="/images/fleet/hires/land-cruiser-2019.png"
      imageAlt="Land Cruiser 2019"
    >
      <Container>
        <article className="atelier-panel atelier-panel--wide">
          <p>
            This website collects rental enquiries. Availability, driver, and class are confirmed only in a written
            reply from the operator.
          </p>
          <h2>Vehicles</h2>
          <p>
            Photographs and the LX 600 study are campaign material. Exact year, colour, and trim are those of the car
            assigned at confirmation.
          </p>
          <h2>Self-drive</h2>
          <p>
            Self-drive is offered only where legal and operationally approved. The operator may require a chauffeur for
            premium and group vehicles.
          </p>
        </article>
      </Container>
    </AtelierPage>
  )
}

export function PrivacyPage() {
  return (
    <AtelierPage
      kicker="Legal"
      title="Privacy."
      lede="Only what is needed to reply — never document or card scans."
      image="/images/fleet/hires/audi-a6-2012.png"
      imageAlt="Audi A6"
    >
      <Container>
        <article className="atelier-panel atelier-panel--wide">
          <p>
            The booking form collects name, phone, optional email, locations, dates, vehicle preference, and notes.
          </p>
          <h2>Storage</h2>
          <p>
            If no booking endpoint is configured, the browser does not store the request on a server. WhatsApp opens with
            a message you can send yourself.
          </p>
          <h2>Credits</h2>
          <p>3D model and photography licences are listed on About and in ATTRIBUTION.md.</p>
        </article>
      </Container>
    </AtelierPage>
  )
}

export function NotFoundPage() {
  return (
    <AtelierPage
      kicker="404"
      title="Off the map."
      lede="That route is not in this site."
      image="/images/fleet/hires/honda-brv.png"
      imageAlt="Honda BRV"
      cta={{ to: '/', label: 'Return home' }}
    />
  )
}
