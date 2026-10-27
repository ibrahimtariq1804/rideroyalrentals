import { useState } from 'react'
import { Plus, Minus, MessageCircle, Phone, HelpCircle } from 'lucide-react'
import { Container } from '@/components/ui/Primitives'
import { business } from '@/data/business'

const homeFaqs = [
  {
    q: 'What documents are required to rent a self-drive car in Islamabad?',
    a: 'For self-drive rentals in Islamabad/Rawalpindi, you will need a valid Pakistani Computerized National Identity Card (CNIC) or Passport, an authentic Pakistani or International Driving License, and a refundable security deposit. Handover takes less than 10 minutes once verified.',
  },
  {
    q: 'Do you offer cars with professional drivers (chauffeurs)?',
    a: 'Yes, all our fleet vehicles—from budget Suzuki Alto to luxury Land Cruiser V8, Prado, and Hiace Grand Cabins—are available with trained, background-checked, and polite chauffeurs. Driver duty covers 12 hours standard with overnight hold options for out-of-station trips.',
  },
  {
    q: 'Are fuel and motorway toll taxes included in the rental price?',
    a: 'Standard rental rates reflect vehicle hire only; fuel and motorway toll taxes are paid by the client according to actual usage. However, for airport transfers and dedicated corporate itineraries, we can provide an all-inclusive fixed package upon request.',
  },
  {
    q: 'Can I get the car delivered directly to my home or Islamabad Airport?',
    a: 'Yes! We provide doorstep vehicle delivery throughout Islamabad and Rawalpindi, as well as 24/7 meet & greet delivery outside the Islamabad International Airport (ISB) terminal.',
  },
  {
    q: 'Can I rent a car for Northern Areas trips (Murree, Swat, Naran, Hunza)?',
    a: 'Absolutely. We specialize in northern tour rentals. We recommend our high-clearance 4x4 SUVs like Toyota Prado, Land Cruiser, Toyota Revo, and Grand Cabins which are fully serviced, winter-ready, and driven by experienced mountain chauffeurs.',
  },
  {
    q: 'How do I confirm my booking and what payment options are accepted?',
    a: 'You can confirm your booking instantly via WhatsApp by sharing your dates and selected vehicle. We accept cash on delivery, online bank transfers, and standard digital payments. A small advance locks your vehicle reservation.',
  },
]

export function HomeFaqSimple() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  const cleanPhone = business.whatsAppNumber.replace(/[^\d]/g, '')

  return (
    <section className="home-faq-section" id="faq" aria-labelledby="faq-section-heading">
      <Container>
        <div className="section-header-center">
          <div className="section-pill">FREQUENTLY ASKED QUESTIONS</div>
          <h2 id="faq-section-heading" className="section-title-large">
            Got Questions? <span className="text-accent">We Have Answers</span>
          </h2>
          <p className="section-desc-center">
            Here are the most common questions customers ask when renting a car with Ride Royal Rentals.
          </p>
        </div>

        <div className="faq-layout-grid">
          {/* FAQ Accordion List */}
          <div className="faq-accordion-col">
            {homeFaqs.map((faq, idx) => {
              const isOpen = openIdx === idx
              return (
                <div key={idx} className={`simple-faq-item ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="simple-faq-question"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                  >
                    <span>{faq.q}</span>
                    <span className="faq-toggle-icon" aria-hidden="true">
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </span>
                  </button>
                  {isOpen ? (
                    <div className="simple-faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>

          {/* Quick Help Card */}
          <div className="faq-help-card">
            <div className="help-icon-wrap">
              <HelpCircle size={32} />
            </div>
            <h3 className="help-card-title">Need Immediate Help?</h3>
            <p className="help-card-desc">
              Have a special itinerary, wedding fleet request, or urgent midnight airport booking? Speak directly to our dispatch manager right now.
            </p>

            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello! I have a question regarding car rental in Islamabad. Please guide me.')}`}
              target="_blank"
              rel="noreferrer"
              className="help-btn-wa"
            >
              <MessageCircle size={18} />
              <span>Chat on WhatsApp</span>
            </a>

            <a href={`tel:${business.whatsAppNumber}`} className="help-btn-call">
              <Phone size={16} />
              <span>Call: 0321 5373563</span>
            </a>

            <p className="help-card-note">Available 24 hours / 7 days a week</p>
          </div>
        </div>
      </Container>
    </section>
  )
}
