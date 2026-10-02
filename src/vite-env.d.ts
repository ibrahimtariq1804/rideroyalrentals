/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BUSINESS_NAME: string
  readonly VITE_WHATSAPP_NUMBER: string
  readonly VITE_BOOKING_ENDPOINT: string
  readonly VITE_GOOGLE_MAPS_URL: string
  readonly VITE_INSTAGRAM_URL: string
  readonly VITE_CONTACT_EMAIL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
