import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { HomePage } from '@/pages/HomePage'
import { useLenis } from '@/context/LenisProvider'
import { PageLoader } from '@/components/ui/WheelLoader'

const FleetPage = lazy(() => import('@/pages/FleetPage').then((mod) => ({ default: mod.FleetPage })))
const VehiclePage = lazy(() => import('@/pages/VehiclePage').then((mod) => ({ default: mod.VehiclePage })))
const ServicesPage = lazy(() => import('@/pages/StaticPages').then((mod) => ({ default: mod.ServicesPage })))
const SelfDrivePage = lazy(() => import('@/pages/StaticPages').then((mod) => ({ default: mod.SelfDrivePage })))
const ChauffeurPage = lazy(() => import('@/pages/StaticPages').then((mod) => ({ default: mod.ChauffeurPage })))
const AirportPage = lazy(() => import('@/pages/StaticPages').then((mod) => ({ default: mod.AirportPage })))
const IntercityPage = lazy(() => import('@/pages/StaticPages').then((mod) => ({ default: mod.IntercityPage })))
const CorporatePage = lazy(() => import('@/pages/StaticPages').then((mod) => ({ default: mod.CorporatePage })))
const WeddingsPage = lazy(() => import('@/pages/StaticPages').then((mod) => ({ default: mod.WeddingsPage })))
const BookingPage = lazy(() => import('@/pages/StaticPages').then((mod) => ({ default: mod.BookingPage })))
const AboutPage = lazy(() => import('@/pages/StaticPages').then((mod) => ({ default: mod.AboutPage })))
const ContactPage = lazy(() => import('@/pages/StaticPages').then((mod) => ({ default: mod.ContactPage })))
const FaqPage = lazy(() => import('@/pages/StaticPages').then((mod) => ({ default: mod.FaqPage })))
const TermsPage = lazy(() => import('@/pages/StaticPages').then((mod) => ({ default: mod.TermsPage })))
const PrivacyPage = lazy(() => import('@/pages/StaticPages').then((mod) => ({ default: mod.PrivacyPage })))
const NotFoundPage = lazy(() => import('@/pages/StaticPages').then((mod) => ({ default: mod.NotFoundPage })))

function ScrollToTop() {
  const location = useLocation()
  const lenis = useLenis()
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname, lenis])
  return null
}

function Fallback() {
  return <PageLoader />
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="fleet" element={<FleetPage />} />
            <Route path="vehicle/:slug" element={<VehiclePage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/self-drive" element={<SelfDrivePage />} />
            <Route path="services/chauffeur" element={<ChauffeurPage />} />
            <Route path="services/airport-transfer" element={<AirportPage />} />
            <Route path="services/intercity" element={<IntercityPage />} />
            <Route path="services/corporate" element={<CorporatePage />} />
            <Route path="services/weddings-events" element={<WeddingsPage />} />
            <Route path="booking" element={<BookingPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}
