/**
 * Booking adapter.
 *
 * Server-side requirements when VITE_BOOKING_ENDPOINT is configured:
 * - Re-validate and sanitise every field (never trust the browser).
 * - Rate-limit by IP and phone (e.g. 5 requests / 10 minutes).
 * - Add spam protection (honeypot + time-trap; Turnstile/hCaptcha if public).
 * - Restrict CORS to the production origin only.
 * - Never expose service-role keys. Use a public anon key + RLS, or a function
 *   with a secret stored only on the server.
 * - Set CSP on the hosting layer: default-src 'self'; connect-src 'self' and
 *   the booking origin; img-src 'self' data: blob:; style-src 'self' fonts;
 *   script-src 'self'; frame-ancestors 'none'.
 */

export type BookingPayload = {
  name: string
  phone: string
  email?: string
  pickupLocation: string
  dropoffLocation: string
  pickupDate: string
  pickupTime: string
  returnDate: string
  returnTime: string
  vehicleSlug?: string
  category: string
  serviceType: string
  driveMode: 'chauffeur' | 'self-drive'
  notes?: string
  consent: true
}

export type BookingResult =
  | { status: 'sent' }
  | { status: 'unconfigured' }
  | { status: 'error'; message: string }

export async function submitBooking(payload: BookingPayload): Promise<BookingResult> {
  const endpoint = import.meta.env.VITE_BOOKING_ENDPOINT
  if (!endpoint) return { status: 'unconfigured' }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      return { status: 'error', message: 'The booking service rejected the request. Use WhatsApp or try later.' }
    }
    return { status: 'sent' }
  } catch {
    return { status: 'error', message: 'Network error. Keep WhatsApp available as a fallback.' }
  }
}
