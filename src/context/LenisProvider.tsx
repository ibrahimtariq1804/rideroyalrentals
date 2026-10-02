import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

const ScrollReadyContext = createContext(false)
const LenisContext = createContext<Lenis | null>(null)

export function useScrollReady() {
  return useContext(ScrollReadyContext)
}

export function useLenis() {
  return useContext(LenisContext)
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion()
  const [ready, setReady] = useState(false)
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (reduced) {
      document.documentElement.classList.add('reduced')
      setLenis(null)
      setReady(true)
      return
    }

    document.documentElement.classList.remove('reduced')

    const instance = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
    })

    const onScroll = () => {
      ScrollTrigger.update()
    }
    instance.on('scroll', onScroll)

    const ticker = (time: number) => {
      instance.raf(time * 1000)
    }
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    const onResize = () => {
      instance.resize()
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)

    setLenis(instance)

    const boot = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      setReady(true)
    })

    const fonts = document.fonts?.ready.then(() => ScrollTrigger.refresh())
    const later = window.setTimeout(() => ScrollTrigger.refresh(), 400)

    return () => {
      window.cancelAnimationFrame(boot)
      window.clearTimeout(later)
      void fonts
      window.removeEventListener('resize', onResize)
      setReady(false)
      setLenis(null)
      gsap.ticker.remove(ticker)
      instance.off('scroll', onScroll)
      instance.destroy()
    }
  }, [reduced])

  return (
    <LenisContext.Provider value={lenis}>
      <ScrollReadyContext.Provider value={ready}>{children}</ScrollReadyContext.Provider>
    </LenisContext.Provider>
  )
}
