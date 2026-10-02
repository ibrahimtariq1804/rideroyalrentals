export const business = {
  name: import.meta.env.VITE_BUSINESS_NAME || 'RIDEROYALRENTALS',
  tagline: 'Rent without compromise.',
  market: 'Pakistan',
  whatsAppNumber: (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\s+/g, ''),
  bookingEndpoint: import.meta.env.VITE_BOOKING_ENDPOINT || '',
  mapsUrl: import.meta.env.VITE_GOOGLE_MAPS_URL || '',
  instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || '',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || '',
  modelCredit: {
    title: 'LEXUS LX 600',
    creator: 'Es-star kings (@KINGSLEY_king)',
    source: 'https://sketchfab.com/3d-models/lexus-lx-600-3780684a306b4549af6a258036d7ab27',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
} as const

export const isWhatsAppConfigured = business.whatsAppNumber.length >= 10
export const isBookingEndpointConfigured = business.bookingEndpoint.length > 0
