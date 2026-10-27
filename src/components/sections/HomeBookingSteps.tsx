import { Car, MessageCircle, Key, ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Primitives'
import { business } from '@/data/business'

const steps = [
  {
    num: '01',
    icon: Car,
    title: 'Choose Your Car',
    desc: 'Browse our catalog of economy sedans, luxury 4x4 SUVs, and passenger vans. Choose the model that suits your family size and budget.',
  },
  {
    num: '02',
    icon: MessageCircle,
    title: 'Confirm via WhatsApp or Call',
    desc: 'Click the WhatsApp button or call us at 0321 5373563. Share your travel dates, pickup location, and get an instant transparent quote.',
  },
  {
    num: '03',
    icon: Key,
    title: 'Doorstep Delivery & Drive',
    desc: 'We deliver your vehicle spotless and fueled at your doorstep, hotel, or airport terminal. Complete a quick handover and hit the road!',
  },
]

export function HomeBookingSteps() {
  const cleanPhone = business.whatsAppNumber.replace(/[^\d]/g, '')

  return (
    <section className="home-steps-section" aria-labelledby="steps-heading">
      <Container>
        <div className="section-header-center">
          <div className="section-pill">HOW IT WORKS</div>
          <h2 id="steps-heading" className="section-title-large">
            Rent a Car in <span className="text-accent">3 Easy Steps</span>
          </h2>
          <p className="section-desc-center">
            Booking a car with Ride Royal Rentals is straightforward and fast. No complicated paperwork or unnecessary delays.
          </p>
        </div>

        <div className="steps-cards-row">
          {steps.map((s, idx) => {
            const Icon = s.icon
            return (
              <div key={s.num} className="step-card">
                <div className="step-card-top">
                  <span className="step-number">{s.num}</span>
                  <div className="step-icon-badge">
                    <Icon size={24} />
                  </div>
                </div>

                <h3 className="step-card-title">{s.title}</h3>
                <p className="step-card-desc">{s.desc}</p>

                {idx < steps.length - 1 ? (
                  <div className="step-connector" aria-hidden="true">
                    <ArrowRight size={20} />
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>

        <div className="steps-bottom-cta">
          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello Ride Royal Rentals! I would like to book a car. Please assist me with the available options.')}`}
            target="_blank"
            rel="noreferrer"
            className="btn-steps-wa"
          >
            <MessageCircle size={18} />
            <span>Start WhatsApp Booking Now</span>
          </a>
        </div>
      </Container>
    </section>
  )
}
