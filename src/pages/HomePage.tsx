import { lazy, Suspense } from 'react'
import { BookingStrip } from '@/components/sections/BookingStrip'
import { HeroSequence } from '@/components/sections/HeroSequence'
import { ServicesOverview } from '@/components/sections/ServicesOverview'

const HomeDeferred = lazy(() =>
  import('@/pages/HomeDeferred').then((m) => ({ default: m.HomeDeferred })),
)

export function HomePage() {
  return (
    <>
      <HeroSequence />
      <BookingStrip />
      <ServicesOverview />
      <Suspense fallback={null}>
        <HomeDeferred />
      </Suspense>
    </>
  )
}
