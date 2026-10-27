import { SimpleHero } from '@/components/sections/SimpleHero'
import { HomeFleetShowcase } from '@/components/sections/HomeFleetShowcase'
import { HomeServices } from '@/components/sections/HomeServices'
import { HomeWhyUs } from '@/components/sections/HomeWhyUs'
import { HomeBookingSteps } from '@/components/sections/HomeBookingSteps'
import { HomeAirportIntercity } from '@/components/sections/HomeAirportIntercity'
import { HomeFaqSimple } from '@/components/sections/HomeFaqSimple'
import { HomeCtaBanner } from '@/components/sections/HomeCtaBanner'

export function HomePage() {
  return (
    <div className="home-page-container">
      {/* 1. Clear Hero Banner with Interactive Showcase & WhatsApp Quick Booking Bar */}
      <SimpleHero />

      {/* 2. Front-Page Fleet Showcase with Category Tabs (inspired by rentacarservices247.com) */}
      <HomeFleetShowcase />

      {/* 3. Comprehensive Services Grid */}
      <HomeServices />

      {/* 4. Why Choose Us / Guarantees & Trust Metrics */}
      <HomeWhyUs />

      {/* 5. 3-Step Simple Booking Guide */}
      <HomeBookingSteps />

      {/* 6. Spotlight for Airport Transfers & Northern Tours */}
      <HomeAirportIntercity />

      {/* 7. Frequently Asked Questions Accordion */}
      <HomeFaqSimple />

      {/* 8. Conversion Call-To-Action Banner */}
      <HomeCtaBanner />
    </div>
  )
}
