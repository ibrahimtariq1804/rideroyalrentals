import { z } from 'zod'

const phonePattern = /^(?:\+?92|0)?3\d{9}$/

export const bookingSchema = z
  .object({
    name: z.string().trim().min(2, 'Enter your name').max(80, 'Keep the name under 80 characters'),
    phone: z
      .string()
      .trim()
      .refine(
        (value) => phonePattern.test(value.replace(/[\s-]/g, '')),
        'Use a Pakistan mobile number, e.g. 03XXXXXXXXX',
      ),
    email: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), 'Enter a valid email'),
    pickupLocation: z.string().trim().min(2, 'Enter pickup location').max(120),
    dropoffLocation: z.string().trim().min(2, 'Enter drop-off location').max(120),
    pickupDate: z.string().min(1, 'Choose pickup date'),
    pickupTime: z.string().min(1, 'Choose pickup time'),
    returnDate: z.string().min(1, 'Choose return date'),
    returnTime: z.string().min(1, 'Choose return time'),
    vehicleSlug: z.string().optional(),
    category: z.string().min(1, 'Choose a category'),
    serviceType: z.string().min(1, 'Choose a service'),
    driveMode: z.enum(['chauffeur', 'self-drive']),
    notes: z.string().max(800, 'Keep notes under 800 characters').optional(),
    consent: z.boolean().refine((value) => value === true, 'Consent is required'),
  })
  .superRefine((value, ctx) => {
    const pickup = new Date(`${value.pickupDate}T${value.pickupTime}`)
    const drop = new Date(`${value.returnDate}T${value.returnTime}`)
    if (Number.isNaN(pickup.getTime()) || Number.isNaN(drop.getTime())) {
      ctx.addIssue({ code: 'custom', message: 'Use valid dates and times', path: ['returnDate'] })
      return
    }
    if (drop <= pickup) {
      ctx.addIssue({
        code: 'custom',
        message: 'Return must be after pickup',
        path: ['returnDate'],
      })
    }
  })

export type BookingFormValues = z.infer<typeof bookingSchema>
