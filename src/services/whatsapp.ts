import { business } from '@/data/business'
import type { BookingPayload } from '@/services/bookingService'

export function buildWhatsAppUrl(payload: BookingPayload) {
  const number = business.whatsAppNumber.replace(/[^\d]/g, '')
  if (number.length < 10) return null

  const lines = [
    `Booking request — ${business.name}`,
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    payload.email ? `Email: ${payload.email}` : null,
    `Pickup: ${payload.pickupLocation}`,
    `Drop-off: ${payload.dropoffLocation}`,
    `From: ${payload.pickupDate} ${payload.pickupTime}`,
    `Until: ${payload.returnDate} ${payload.returnTime}`,
    `Category: ${payload.category}`,
    payload.vehicleSlug ? `Vehicle: ${payload.vehicleSlug}` : null,
    `Service: ${payload.serviceType}`,
    `Drive: ${payload.driveMode}`,
    payload.notes ? `Notes: ${payload.notes}` : null,
  ].filter(Boolean)

  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join('\n'))}`
}
