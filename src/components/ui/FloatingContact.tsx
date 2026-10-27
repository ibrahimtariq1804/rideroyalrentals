import { Phone, MessageCircle } from 'lucide-react'
import { business } from '@/data/business'

export function FloatingContact() {
  const cleanPhone = business.whatsAppNumber.replace(/[^\d]/g, '')
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Hello Ride Royal Rentals! I would like to inquire about car rental availability.',
  )}`

  return (
    <aside className="floating-contact-wrap" aria-label="Quick contact actions">
      {/* Quick Phone Call Button (shows on mobile & tablet) */}
      <a
        href={`tel:${business.whatsAppNumber}`}
        className="floating-btn floating-call-btn"
        aria-label="Call Ride Royal Rentals"
        title="Call 0321 5373563"
      >
        <Phone size={20} />
        <span className="floating-btn-text">Call Now</span>
      </a>

      {/* Main WhatsApp Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        className="floating-btn floating-wa-btn"
        aria-label="Chat on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        <span className="wa-pulse-ring" aria-hidden="true" />
        <MessageCircle size={24} />
        <span className="floating-btn-text">WhatsApp</span>
      </a>
    </aside>
  )
}
