import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { categoryLabels, formatRate, orbitVehicles, transmissionLabels } from '@/data/fleet'
import { Button, FleetImg } from '@/components/ui/Primitives'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const CARD_W = 320

export function ChooseOrbit() {
  const reduced = usePrefersReducedMotion()
  const items = orbitVehicles
  const count = items.length
  const [index, setIndex] = useState(0)
  const [inView, setInView] = useState(false)
  const section = useRef<HTMLElement>(null)
  const spin = useRef<HTMLDivElement>(null)
  const rotation = useRef(0)
  const velocity = useRef(0)
  const dragging = useRef(false)
  const lastX = useRef(0)
  const lastIndex = useRef(0)

  const radius = useMemo(() => {
    const n = Math.max(count, 3)
    return Math.round(CARD_W / 2 / Math.tan(Math.PI / n)) + 48
  }, [count])

  const step = (Math.PI * 2) / Math.max(count, 1)

  const applySpin = () => {
    if (spin.current) {
      const deg = (rotation.current * 180) / Math.PI
      spin.current.style.transform = `translateZ(${-radius}px) rotateY(${deg}deg)`
    }
    const next = ((Math.round(-rotation.current / step) % count) + count) % count
    if (next !== lastIndex.current) {
      lastIndex.current = next
      setIndex(next)
    }
  }

  useEffect(() => {
    const el = section.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '80px', threshold: 0.05 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    applySpin()
  }, [radius, count])

  useEffect(() => {
    if (!inView || reduced || count < 1) return
    let frame = 0
    const tick = () => {
      if (!dragging.current) {
        velocity.current *= 0.94
        rotation.current += 0.004 + velocity.current
      }
      applySpin()
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduced, count, step, radius])

  const snapTo = (next: number) => {
    const wrapped = ((next % count) + count) % count
    setIndex(wrapped)
    lastIndex.current = wrapped
    rotation.current = -wrapped * step
    velocity.current = 0
    applySpin()
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = true
    lastX.current = event.clientX
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    const dx = event.clientX - lastX.current
    lastX.current = event.clientX
    velocity.current = -dx * 0.004
    rotation.current += velocity.current
    applySpin()
  }

  const onPointerUp = () => {
    dragging.current = false
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') snapTo(index + 1)
      if (event.key === 'ArrowLeft') snapTo(index - 1)
    }
    const el = section.current
    el?.addEventListener('keydown', onKey)
    return () => el?.removeEventListener('keydown', onKey)
  }, [index, count])

  const vehicle = items[index]
  if (!vehicle) return null

  return (
    <section ref={section} className="section orbit-section" tabIndex={0} aria-label="Choose your orbit">
      <div className="container">
        <p className="kicker">Selector</p>
        <h2 className="display orbit-title">Choose your orbit</h2>

        <div className="orbit-layout">
          <div
            className="orbit-stage"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            role="application"
            aria-label="Orbiting vehicle cards"
          >
            <div className="orbit-ring" style={{ ['--orbit-radius' as string]: `${radius}px` }}>
              <div ref={spin} className="orbit-ring-spin">
                {items.map((item, itemIndex) => {
                  const angle = (360 / count) * itemIndex
                  const isFront = itemIndex === index
                  return (
                    <article
                      key={item.slug}
                      className={`orbit-card ${isFront ? 'is-front' : ''}`}
                      style={{ transform: `rotateY(${angle}deg) translateZ(${radius}px)` }}
                    >
                      <button type="button" onClick={() => snapTo(itemIndex)} aria-label={item.name}>
                        <div className="orbit-card-media">
                          <FleetImg src={item.heroImage} alt={item.name} width={640} height={400} />
                        </div>
                        <div className="orbit-card-label">
                          <span>{categoryLabels[item.category]}</span>
                          <strong>{item.name}</strong>
                        </div>
                      </button>
                    </article>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="orbit-meta">
            <p className="meta">{categoryLabels[vehicle.category]}</p>
            <h3 className="display">{vehicle.name}</h3>
            <p className="orbit-meta-copy">{vehicle.summary}</p>
            <p className="meta" style={{ marginTop: 16 }}>
              {vehicle.detail} · {transmissionLabels[vehicle.transmission]}
            </p>
            <p className="meta" style={{ marginTop: 8 }}>
              {formatRate(vehicle.ratePerDay)}
            </p>
            <div className="orbit-controls">
              <button className="btn btn--ghost" type="button" onClick={() => snapTo(index - 1)} aria-label="Previous">
                <ChevronLeft size={16} />
              </button>
              <button className="btn btn--ghost" type="button" onClick={() => snapTo(index + 1)} aria-label="Next">
                <ChevronRight size={16} />
              </button>
            </div>
            <div style={{ marginTop: 24 }}>
              <Button to={`/vehicle/${vehicle.slug}`}>View vehicle</Button>
            </div>
            <p className="meta" style={{ marginTop: 16 }}>
              Listed rate · Confirm at quote
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
