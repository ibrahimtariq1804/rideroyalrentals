export type FaqItem = {
  id: string
  question: string
  answer: string
}

export const faqs: FaqItem[] = [
  {
    id: 'quote',
    question: 'Why is there no price on the website?',
    answer:
      'Rates depend on dates, city, vehicle class, chauffeur hours, and season. This site collects a request. A human quote follows. We will not invent a rate card.',
  },
  {
    id: 'self-drive',
    question: 'Can I self-drive every car?',
    answer:
      'No. Economy, sedan, and some crossovers may be offered self-drive where licences and operations allow. Premium 4x4 and group vans are chauffeur-led unless agreed otherwise.',
  },
  {
    id: 'documents',
    question: 'What do I need to book?',
    answer:
      'For a first request: name, WhatsApp number, pickup and return window, and the class you want. We do not collect CNIC or passport scans, or card details, on this form.',
  },
  {
    id: 'airport',
    question: 'Do you do airport pickup?',
    answer:
      'Yes. Add the airport, flight number if you have it, and party size in the notes. Vehicle class is confirmed at quote.',
  },
  {
    id: 'intercity',
    question: 'Can I take a car to another city?',
    answer:
      'Yes. Mark the service as intercity and name both cities. Overnight holds and one-way returns are quoted case by case.',
  },
  {
    id: 'live-fleet',
    question: 'Is this the live inventory?',
    answer:
      'The fleet list matches our current Islamabad classes and years. Colour, exact unit, and day-of availability are confirmed when we quote.',
  },
  {
    id: 'whatsapp',
    question: 'Can I continue on WhatsApp?',
    answer:
      'Yes. Once a WhatsApp business number is configured, the booking form builds a structured message from your request. Until then, the WhatsApp action stays disabled so we never send you to a fake number.',
  },
  {
    id: 'payment',
    question: 'Can I pay on this website?',
    answer:
      'Not in this version. The form is a request, not a checkout. Payment method is agreed after availability is confirmed.',
  },
]
