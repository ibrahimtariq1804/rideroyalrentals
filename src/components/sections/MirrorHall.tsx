import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { categoryLabels, vehicles } from '@/data/fleet'
import { FleetImg } from '@/components/ui/Primitives'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useLenis, useScrollReady } from '@/context/LenisProvider'

gsap.registerPlugin(ScrollTrigger)

const HALL_SLUGS = [
  'land-cruiser-2019',
  'prado-2019',
  'audi-a6-2012',
  'honda-civic-11th',
  'toyota-revo',
  'hiace-grand-cabin',
]

export function MirrorHall() {
  const section = useRef<HTMLElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const trigger = useRef<ScrollTrigger | null>(null)
  const reduced = usePrefersReducedMotion()
  const scrollReady = useScrollReady()
  const lenis = useLenis()
  const panels = HALL_SLUGS.map((slug) => vehicles.find((vehicle) => vehicle.slug === slug)).filter(
    (vehicle): vehicle is (typeof vehicles)[number] => Boolean(vehicle),
  )

  useLayoutEffect(() => {
    const el = section.current
    const hold = pin.current
    if (!el || !hold || reduced || !scrollReady) return

    const slides = Array.from(hold.querySelectorAll<HTMLElement>('.bay-slide'))
    const ticks = Array.from(hold.querySelectorAll<HTMLElement>('.bay-tick'))

    const place = (progress: number) => {
      const pos = progress * (slides.length - 1)
      const active = Math.round(pos)
      slides.forEach((slide, index) => {
        const d = index - pos
        let insetL = 0
        let insetR = 0
        let opacity = 1
        if (d > 0) {
          insetL = Math.min(100, d * 100)
          opacity = d < 1.05 ? 1 : 0
        } else if (d < 0) {
          insetR = Math.min(100, -d * 100)
          opacity = -d < 1.05 ? 1 : 0
        }
        slide.style.clipPath = `inset(0 ${insetR}% 0 ${insetL}%)`
        slide.style.opacity = String(opacity)
        slide.style.zIndex = String(10 + Math.round((1 - Math.abs(d)) * 20))
      })
      ticks.forEach((tick, index) => {
        const on = index === active
        tick.classList.toggle('is-on', on)
        tick.setAttribute('aria-current', on ? 'true' : 'false')
      })
    }

    place(0)

    const ctx = gsap.context(() => {
      trigger.current = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: () => `+=${window.innerHeight * 2.2}`,
        pin: hold,
        scrub: 0.55,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => place(self.progress),
      })
    }, section)

    return () => {
      trigger.current = null
      ctx.revert()
    }
  }, [reduced, scrollReady])

  const goTo = (index: number) => {
    const st = trigger.current
    if (!st || panels.length < 2) return
    const y = st.start + (st.end - st.start) * (index / (panels.length - 1))
    if (lenis) lenis.scrollTo(y, { immediate: false, duration: 0.9 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <section ref={section} className={reduced ? 'bay is-static' : 'bay'} aria-label="Inspection bay">
      <div ref={pin} className="bay-pin">
        <aside className="bay-index">
          <p className="kicker">Inspection bay</p>
          <ol className="bay-list">
            {panels.map((vehicle, index) => (
              <li key={vehicle.slug}>
                <button
                  className={index === 0 ? 'bay-tick is-on' : 'bay-tick'}
                  type="button"
                  aria-current={index === 0 ? 'true' : 'false'}
                  onClick={() => goTo(index)}
                >
                  <span className="bay-num">{String(index + 1).padStart(2, '0')}</span>
                  <span className="bay-copy">
                    <span className="bay-name display">{vehicle.name}</span>
                    <span className="bay-meta meta">
                      {categoryLabels[vehicle.category]} · {vehicle.seats} seats
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </aside>
        <div className="bay-stage">
          <div className="bay-frame">
            {panels.map((vehicle, index) => (
              <article className="bay-slide" key={vehicle.slug} style={{ zIndex: panels.length - index }}>
                <FleetImg src={vehicle.heroImage} alt={vehicle.name} width={1400} height={880} loading="eager" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
