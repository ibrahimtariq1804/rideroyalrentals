import { Link } from 'react-router-dom'
import { Container, Button, SectionHead } from '@/components/ui/Primitives'
import { Magnetic, Marquee, Reveal, JourneyStep } from '@/components/animation/MotionBits'
import { faqs } from '@/data/faq'
import { processSteps } from '@/data/content'
import { useState } from 'react'
import { FleetImg } from '@/components/ui/Primitives'

export function CorporateStory() {
  return (
    <section className="section corp-section" aria-labelledby="corp-heading">
      <Container>
        <div className="corp-split">
          <Reveal>
            <div>
              <p className="kicker">Chauffeur / Corporate</p>
              <h2 id="corp-heading" className="display display-hero">
                The car is the room before the room.
              </h2>
              <p className="lede">
                Visiting principals, monthly retainers, and days that should not start with a taxi queue.
                We quote the programme — we do not publish a fake corporate rate.
              </p>
              <div className="hero-actions" style={{ marginTop: 28 }}>
                <Magnetic>
                  <Button to="/services/corporate">Corporate</Button>
                </Magnetic>
                <Button to="/services/chauffeur" variant="ghost">
                  Chauffeur
                </Button>
              </div>
            </div>
          </Reveal>
          <FleetImg
              className="inline-photo"
              src="/images/fleet/hires/mercedes-c180-2012.png"
              alt="Mercedes C180"
              width={1200}
              height={800}
            />
        </div>
      </Container>
    </section>
  )
}

export function AirportCta() {
  return (
    <section className="section cta-band" style={{ padding: 0 }} aria-label="Airport and intercity">
      <div className="cta-split">
        <Link to="/services/airport-transfer" className="cta-pane">
          <FleetImg src="/images/fleet/hires/hiace-grand-cabin.png" alt="Hiace Grand Cabin airport transfer" width={1400} height={900} />
          <div className="cta-pane-copy">
            <p className="kicker">Arrivals</p>
            <h2 className="display">Airport.</h2>
            <p>Flight-aware pickup. Luggage-first class.</p>
          </div>
        </Link>
        <span className="cta-split-rule" aria-hidden="true" />
        <Link to="/services/intercity" className="cta-pane">
          <FleetImg src="/images/fleet/hires/toyota-revo.png" alt="Toyota Revo intercity" width={1400} height={900} />
          <div className="cta-pane-copy">
            <p className="kicker">Distance</p>
            <h2 className="display">Intercity.</h2>
            <p>City to city, quoted as a programme.</p>
          </div>
        </Link>
      </div>
    </section>
  )
}

export function TrustProcess() {
  return (
    <section className="section journey" aria-labelledby="trust-heading">
      <Container>
        <Reveal>
          <SectionHead
            kicker="Process"
            title="No fake proof."
            copy="We will not invent ratings, trip counts, or testimonials. The path is the product: request, confirm, prepare, drive."
          />
        </Reveal>
        <div className="journey-rail process-grid">
          {processSteps.map((step, i) => (
            <JourneyStep
              key={step.index}
              index={step.index}
              title={step.title}
              body={step.body}
              delay={i * 0.08}
            />
          ))}
        </div>
        <h2 id="trust-heading" className="sr-only">
          How booking works
        </h2>
      </Container>
    </section>
  )
}

export function HomeFaq() {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null)
  return (
    <section className="section" aria-labelledby="faq-heading">
      <Container>
        <div className="faq-board">
          <div className="faq-intro">
            <p className="kicker">Questions</p>
            <h2 id="faq-heading" className="display">
              Before you write.
            </h2>
            <p>
              Straight answers on quotes, self-drive, and what this site will never invent. The rest of the desk is one
              form away.
            </p>
            <Button to="/faq" variant="ghost">
              All questions
            </Button>
          </div>
          <div className="faq-still-frame">
            <FleetImg
              className="faq-still"
              src="/images/fleet/hires/prado-2019.png"
              alt="Prado 2015"
              width={900}
              height={640}
            />
            <p className="meta">Fleet still · not a review</p>
          </div>
          <div className="faq-desk-card">
            <p className="kicker">Desk</p>
            <h3 className="display">Still writing?</h3>
            <p>Dates and class go on the request form. No invented rates.</p>
            <Button to="/booking">Request a quote</Button>
          </div>
          <div className="faq-list">
            {faqs.slice(0, 5).map((item) => (
              <div className="faq-item" key={item.id}>
                <button
                  type="button"
                  aria-expanded={open === item.id}
                  onClick={() => setOpen(open === item.id ? null : item.id)}
                >
                  {item.question}
                  <span aria-hidden="true">{open === item.id ? '–' : '+'}</span>
                </button>
                {open === item.id ? <p>{item.answer}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

export function Newsletter() {
  return (
    <section className="section" aria-labelledby="news-heading">
      <div style={{ marginTop: 64 }}>
        <Marquee
          items={['Alto', 'City', 'Civic', 'Corolla', 'Altis', 'BRV', 'Revo', 'Vigo', 'Tucson', 'Sportage', 'Sorento', 'Prado', 'Land Cruiser', 'Crown RS', 'Hiace', 'Coaster']}
        />
      </div>
    </section>
  )
}
