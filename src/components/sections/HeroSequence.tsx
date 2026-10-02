import { lazy, Suspense, useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Magnetic } from '@/components/animation/MotionBits'
import { Button, FleetImg } from '@/components/ui/Primitives'
import { WheelLoader } from '@/components/ui/WheelLoader'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { business } from '@/data/business'
import {
  applyHeroProgress,
  heroStages,
  stageIndexFromProgress,
} from '@/components/three/heroPlayback'

const HeroCanvas = lazy(() =>
  import('@/components/three/HeroCanvas').then((m) => ({ default: m.HeroCanvas })),
)
export function HeroSequence() {
  const section = useRef<HTMLElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const copies = useRef<HTMLElement[]>([])
  const hint = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const [modelReady, setModelReady] = useState(false)

  useLayoutEffect(() => {
    applyHeroProgress(0)
  }, [])

  const onProgress = useCallback((progress: number) => {
    applyHeroProgress(progress)
    if (bar.current) bar.current.style.height = `${progress * 100}%`
    const index = stageIndexFromProgress(progress)
    copies.current.forEach((node, i) => {
      if (!node) return
      const active = i === index
      node.classList.toggle('is-active', active)
      node.setAttribute('aria-hidden', active ? 'false' : 'true')
    })
    if (hint.current) hint.current.hidden = index !== 0
  }, [])

  useScrollProgress(section, onProgress, !reduced)

  return (
    <section ref={section} className={`hero-sequence ${reduced ? 'reduced' : ''}`} aria-label="LX 600 introduction">
      <div className="hero-sticky">
        {reduced ? (
          <div className="hero-canvas">
            <FleetImg
              src="/images/fleet/hires/land-cruiser-2019.png"
              alt="Land Cruiser 2019"
              width={1600}
              height={900}
              loading="eager"
              fallback="/images/fleet/hires/prado-2019.png"
            />
          </div>
        ) : (
          <>
            <Suspense
              fallback={
                <div className="model-loader model-loader--buffer" aria-live="polite" aria-busy="true">
                  <WheelLoader />
                  <span className="sr-only">Loading the LX 600</span>
                </div>
              }
            >
              <HeroCanvas active onReady={() => setModelReady(true)} />
            </Suspense>
            {!modelReady ? (
              <div className="model-loader model-loader--buffer" aria-live="polite" aria-busy="true">
                <WheelLoader />
                <span className="sr-only">Loading the LX 600</span>
              </div>
            ) : null}
          </>
        )}

        <div className="hero-overlay">
          {heroStages.map((item, index) => (
            <article
              key={item.id}
              className={`hero-copy ${item.pos}${index === 0 ? ' is-active' : ''}`}
              aria-hidden={index !== 0}
              ref={(node) => {
                if (node) copies.current[index] = node
              }}
            >
              <p className="kicker">{business.name} · LX 600</p>
              <h2 className="display">{item.title}</h2>
              <p>{item.copy}</p>
              {'detail' in item && item.detail ? <p className="meta">{item.detail}</p> : null}
              {'actions' in item && item.actions ? (
                <div className="hero-actions">
                  <Magnetic>
                    <Button to="/booking">Book a car</Button>
                  </Magnetic>
                  <Button to="/fleet" variant="ghost">
                    Explore the fleet
                  </Button>
                </div>
              ) : null}
              {'reserve' in item && item.reserve ? (
                <div className="hero-actions">
                  <Magnetic>
                    <Button to="/booking">Reserve your drive</Button>
                  </Magnetic>
                </div>
              ) : null}
            </article>
          ))}

          <div className="scroll-hint" ref={hint}>
            Scroll to play · Drag to look
            <i />
          </div>

          <div className="hero-progress" aria-hidden="true">
            <span ref={bar} />
          </div>
        </div>
      </div>
    </section>
  )
}
