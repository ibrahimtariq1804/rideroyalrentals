import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { z } from 'zod'
import { business, isWhatsAppConfigured } from '@/data/business'
import { Button } from '@/components/ui/Primitives'

const phonePattern = /^(?:\+?92|0)?3\d{9}$/

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(80),
  phone: z
    .string()
    .trim()
    .refine((value) => phonePattern.test(value.replace(/[\s-]/g, '')), 'Use a Pakistan mobile, e.g. 03XXXXXXXXX'),
  email: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), 'Enter a valid email'),
  message: z.string().trim().min(8, 'Write a short message').max(800),
  consent: z.boolean().refine((value) => value === true, 'Consent is required'),
})

type ContactValues = z.infer<typeof contactSchema>

export function ContactForm() {
  const [result, setResult] = useState<string | null>(null)
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', phone: '', email: '', message: '', consent: false },
  })

  const onSubmit = form.handleSubmit((values) => {
    const number = business.whatsAppNumber.replace(/[^\d]/g, '')
    const lines = [
      `Desk message — ${business.name}`,
      `Name: ${values.name}`,
      `Phone: ${values.phone}`,
      values.email ? `Email: ${values.email}` : null,
      `Message: ${values.message}`,
    ].filter(Boolean)

    if (number.length >= 10) {
      window.open(`https://wa.me/${number}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer')
      setResult('WhatsApp is opening with your message.')
      return
    }

    if (business.contactEmail) {
      const href = `mailto:${business.contactEmail}?subject=${encodeURIComponent(`${business.name} enquiry`)}&body=${encodeURIComponent(lines.join('\n'))}`
      window.location.href = href
      setResult('Your mail app is opening with the message.')
      return
    }

    setResult('No WhatsApp number or email is configured yet. Nothing was sent, and we will not fake a delivery.')
  })

  const fieldError = (name: keyof ContactValues) => form.formState.errors[name]?.message

  return (
    <form className="booking-form" onSubmit={onSubmit} noValidate>
      <div className="form-grid contact-grid">
        <div className="field">
          <label htmlFor="contact-name">Full name</label>
          <input id="contact-name" autoComplete="name" {...form.register('name')} />
          {fieldError('name') ? <span className="error">{fieldError('name')}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="contact-phone">Phone / WhatsApp</label>
          <input id="contact-phone" autoComplete="tel" placeholder="03XXXXXXXXX" {...form.register('phone')} />
          {fieldError('phone') ? <span className="error">{fieldError('phone')}</span> : null}
        </div>
        <div className="field" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="contact-email">Email (optional)</label>
          <input id="contact-email" type="email" autoComplete="email" {...form.register('email')} />
          {fieldError('email') ? <span className="error">{fieldError('email')}</span> : null}
        </div>
        <div className="field" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" maxLength={800} rows={6} {...form.register('message')} />
          {fieldError('message') ? <span className="error">{fieldError('message')}</span> : null}
        </div>
        <label className="field" style={{ gridColumn: '1 / -1', alignItems: 'center', gridTemplateColumns: 'auto 1fr' }}>
          <input type="checkbox" {...form.register('consent')} />
          <span>I agree this is a message to the desk, not a paid booking.</span>
        </label>
        {fieldError('consent') ? <span className="error">{fieldError('consent')}</span> : null}
      </div>
      {result ? (
        <p className="notice notice--warn" role="status">
          {result}
        </p>
      ) : null}
      <div className="hero-actions" style={{ marginTop: 20 }}>
        <Button type="submit">{isWhatsAppConfigured ? 'Open WhatsApp' : 'Write to the desk'}</Button>
      </div>
      {!isWhatsAppConfigured && !business.contactEmail ? (
        <p className="meta" style={{ marginTop: 12 }}>
          Channels stay unset until a number or email is configured. We will not invent one.
        </p>
      ) : null}
    </form>
  )
}
