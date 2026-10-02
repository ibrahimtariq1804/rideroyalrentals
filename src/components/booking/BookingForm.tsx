import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { bookingSchema, type BookingFormValues } from '@/data/bookingSchema'
import { submitBooking } from '@/services/bookingService'
import { buildWhatsAppUrl } from '@/services/whatsapp'
import { categoryLabels } from '@/data/fleet'
import { services } from '@/data/services'
import { business, isBookingEndpointConfigured, isWhatsAppConfigured } from '@/data/business'
import { Button } from '@/components/ui/Primitives'

const defaults: BookingFormValues = {
  name: '',
  phone: '',
  email: '',
  pickupLocation: '',
  dropoffLocation: '',
  pickupDate: '',
  pickupTime: '10:00',
  returnDate: '',
  returnTime: '10:00',
  vehicleSlug: '',
  category: 'sedan',
  serviceType: 'chauffeur',
  driveMode: 'chauffeur',
  notes: '',
  consent: false,
}

export function BookingForm({ vehicleSlug }: { vehicleSlug?: string }) {
  const [params] = useSearchParams()
  const [result, setResult] = useState<string | null>(null)
  const [resultType, setResultType] = useState<'ok' | 'warn' | 'err'>('warn')
  const city = params.get('city') ?? ''
  const category = params.get('category') || 'sedan'

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      ...defaults,
      vehicleSlug: vehicleSlug ?? '',
      pickupDate: params.get('pickup') ?? '',
      returnDate: params.get('return') ?? '',
      category: category in categoryLabels ? category : 'sedan',
      pickupLocation: city,
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = {
      ...values,
      phone: values.phone.replace(/[\s-]/g, ''),
      consent: true as const,
      email: values.email || undefined,
      notes: values.notes || undefined,
      vehicleSlug: values.vehicleSlug || vehicleSlug || undefined,
    }
    const response = await submitBooking(payload)
    if (response.status === 'sent') {
      setResultType('ok')
      setResult('Request sent. We will reply on the number you gave.')
      return
    }
    if (response.status === 'unconfigured') {
      setResultType('warn')
      setResult(
        'Online submission is not configured yet (no VITE_BOOKING_ENDPOINT). Use WhatsApp once a business number is set, or email the operator directly.',
      )
      return
    }
    setResultType('err')
    setResult(response.message)
  })

  const openWhatsApp = form.handleSubmit((values) => {
    const url = buildWhatsAppUrl({
      ...values,
      phone: values.phone.replace(/[\s-]/g, ''),
      consent: true,
      email: values.email || undefined,
      notes: values.notes || undefined,
      vehicleSlug: values.vehicleSlug || vehicleSlug || undefined,
    })
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  })

  const fieldError = (name: keyof BookingFormValues) => form.formState.errors[name]?.message

  return (
    <form className="booking-form" onSubmit={onSubmit} noValidate>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="form-grid">
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" autoComplete="name" {...form.register('name')} />
          {fieldError('name') ? <span className="error">{fieldError('name')}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="phone">Phone / WhatsApp</label>
          <input id="phone" autoComplete="tel" placeholder="03XXXXXXXXX" {...form.register('phone')} />
          {fieldError('phone') ? <span className="error">{fieldError('phone')}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="email">Email (optional)</label>
          <input id="email" type="email" autoComplete="email" {...form.register('email')} />
          {fieldError('email') ? <span className="error">{fieldError('email')}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" {...form.register('category')}>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="pickupLocation">Pickup location</label>
          <input id="pickupLocation" {...form.register('pickupLocation')} />
          {fieldError('pickupLocation') ? <span className="error">{fieldError('pickupLocation')}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="dropoffLocation">Drop-off location</label>
          <input id="dropoffLocation" {...form.register('dropoffLocation')} />
          {fieldError('dropoffLocation') ? <span className="error">{fieldError('dropoffLocation')}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="pickupDate">Pickup date</label>
          <input id="pickupDate" type="date" {...form.register('pickupDate')} />
          {fieldError('pickupDate') ? <span className="error">{fieldError('pickupDate')}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="pickupTime">Pickup time</label>
          <input id="pickupTime" type="time" {...form.register('pickupTime')} />
        </div>
        <div className="field">
          <label htmlFor="returnDate">Return date</label>
          <input id="returnDate" type="date" {...form.register('returnDate')} />
          {fieldError('returnDate') ? <span className="error">{fieldError('returnDate')}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="returnTime">Return time</label>
          <input id="returnTime" type="time" {...form.register('returnTime')} />
        </div>
        <div className="field">
          <label htmlFor="serviceType">Service</label>
          <select id="serviceType" {...form.register('serviceType')}>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.title}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="driveMode">Drive</label>
          <select id="driveMode" {...form.register('driveMode')}>
            <option value="chauffeur">Chauffeur</option>
            <option value="self-drive">Self-drive</option>
          </select>
        </div>
        <div className="field" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" maxLength={800} {...form.register('notes')} />
        </div>
        <label className="field" style={{ gridColumn: '1 / -1', alignItems: 'center', gridTemplateColumns: 'auto 1fr' }}>
          <input type="checkbox" {...form.register('consent')} />
          <span>I agree that this is a quote request, not a paid booking, and that details will be used to reply.</span>
        </label>
        {fieldError('consent') ? <span className="error">{fieldError('consent')}</span> : null}
      </div>

      {result ? (
        <p className={`notice ${resultType === 'warn' ? 'notice--warn' : ''}`} role="status">
          {result}
        </p>
      ) : null}

      {!isBookingEndpointConfigured ? (
        <p className="notice notice--warn">
          Online send needs `VITE_BOOKING_ENDPOINT`. No fake confirmation will be shown.
        </p>
      ) : null}

      <div className="hero-actions" style={{ marginTop: 20 }}>
        <Button type="submit">Book online</Button>
        <Button type="button" variant="ghost" disabled={!isWhatsAppConfigured} onClick={() => void openWhatsApp()}>
          Continue on WhatsApp
        </Button>
      </div>
      {!isWhatsAppConfigured ? (
        <p className="meta" style={{ marginTop: 12 }}>
          WhatsApp stays disabled until {business.name} sets VITE_WHATSAPP_NUMBER.
        </p>
      ) : null}
    </form>
  )
}
