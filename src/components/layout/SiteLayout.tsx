import { Outlet, useLocation } from 'react-router-dom'
import { Suspense } from 'react'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { PageLoader } from '@/components/ui/WheelLoader'
import { PageFade } from '@/components/animation/MotionBits'

export function SiteLayout() {
  const location = useLocation()
  const inner = location.pathname !== '/'

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" className={`page-main ${inner ? 'is-inner' : ''}`}>
        <Suspense fallback={inner ? <PageLoader /> : null}>
          <PageFade key={location.pathname}>
            <Outlet />
          </PageFade>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
