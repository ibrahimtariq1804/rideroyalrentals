import { useCallback, useLayoutEffect, useRef } from 'react'
import { FleetImg } from '@/components/ui/Primitives'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useScrollProgress, useSectionScrub } from '@/hooks/useScrollProgress'

type Cell = {
  src: string
  alt: string
  layer: 'outer' | 'middle' | 'inner' | 'center'
}

const DESKTOP: Cell[] = [
  { layer: 'outer', src: '/images/fleet/hires/suzuki-alto.png', alt: 'Suzuki Alto' },
  { layer: 'middle', src: '/images/fleet/hires/toyota-gli-2014.png', alt: 'Toyota Corolla GLI' },
  { layer: 'inner', src: '/images/fleet/hires/honda-civic-11th.png', alt: 'Honda Civic 11th Gen' },
  { layer: 'middle', src: '/images/fleet/hires/honda-brv.png', alt: 'Honda BRV' },
  { layer: 'outer', src: '/images/fleet/hires/toyota-vigo-black.png', alt: 'Toyota Vigo' },
  { layer: 'middle', src: '/images/fleet/hires/honda-civic-reborn.png', alt: 'Honda Civic Reborn' },
  { layer: 'inner', src: '/images/fleet/hires/toyota-revo.png', alt: 'Toyota Revo' },
  { layer: 'center', src: '/images/fleet/hires/land-cruiser-2019.png', alt: 'Land Cruiser 2019' },
  { layer: 'inner', src: '/images/fleet/hires/prado-2019.png', alt: 'Prado 2019' },
  { layer: 'middle', src: '/images/fleet/hires/hiace-hiroof-200.png', alt: 'Hiace Hiroof' },
  { layer: 'outer', src: '/images/fleet/hires/toyota-coaster.png', alt: 'Toyota Coaster' },
  { layer: 'middle', src: '/images/fleet/hires/honda-city-2012.png', alt: 'Honda City' },
  { layer: 'inner', src: '/images/fleet/hires/audi-a6-2012.png', alt: 'Audi A6' },
  { layer: 'middle', src: '/images/fleet/hires/hiace-grand-cabin.png', alt: 'Hiace Grand Cabin' },
  { layer: 'outer', src: '/images/fleet/hires/mercedes-c180-2022.png', alt: 'Mercedes C180' },
]

const MOBILE: Cell[] = [
  { layer: 'middle', src: '/images/fleet/hires/toyota-corolla-altis.png', alt: 'Corolla Altis' },
  { layer: 'inner', src: '/images/fleet/hires/honda-civic-11th.png', alt: 'Honda Civic 11th Gen' },
  { layer: 'middle', src: '/images/fleet/hires/honda-brv.png', alt: 'Honda BRV' },
  { layer: 'inner', src: '/images/fleet/hires/toyota-revo.png', alt: 'Toyota Revo' },
  { layer: 'center', src: '/images/fleet/hires/land-cruiser-2019.png', alt: 'Land Cruiser 2019' },
  { layer: 'inner', src: '/images/fleet/hires/prado-2019.png', alt: 'Prado 2019' },
  { layer: 'middle', src: '/images/fleet/hires/honda-city-2012.png', alt: 'Honda City' },
  { layer: 'inner', src: '/images/fleet/hires/audi-a6-2012.png', alt: 'Audi A6' },
  { layer: 'middle', src: '/images/fleet/hires/hiace-hiroof-200.png', alt: 'Hiace Hiroof' },
]

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function easeOut(t: number, power: number) {
  return 1 - (1 - clamp01(t)) ** power
}

function layerValues(progress: number, start: number, end: number, power: number) {
  const local = clamp01((progress - start) / Math.max(end - start, 0.001))
  const scale = easeOut(clamp01((local - 0.3) / 0.7), power)
  const opacity = clamp01((local - 0.55) / 0.45)
  return { scale, opacity }
}

function setLayer(nodes: NodeListOf<Element>, scale: number, opacity: number) {
  nodes.forEach((node) => {
    const el = node as HTMLElement
    el.style.transform = `scale(${scale})`
    el.style.opacity = String(opacity)
  })
}

export function ExpandingFleetGrid() {
  const section = useRef<HTMLElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const center = useRef<HTMLDivElement>(null)
  const layers = useRef<{ inner: NodeListOf<Element>; middle: NodeListOf<Element>; outer: NodeListOf<Element> } | null>(
    null,
  )
  const mobile = useMediaQuery('(max-width: 1024px)')
  const reduced = usePrefersReducedMotion()
  const cells = mobile ? MOBILE : DESKTOP

  const apply = useCallback(
    (progress: number) => {
      const pinEl = pin.current
      const centerEl = center.current
      if (!pinEl || !centerEl) return
      if (!layers.current) {
        layers.current = {
          inner: pinEl.querySelectorAll('[data-layer="inner"]'),
          middle: pinEl.querySelectorAll('[data-layer="middle"]'),
          outer: pinEl.querySelectorAll('[data-layer="outer"]'),
        }
      }

      const cellW = Math.max(centerEl.offsetWidth, 1)
      const cellH = Math.max(centerEl.offsetHeight, 1)
      const cover = Math.max(pinEl.clientWidth / cellW, pinEl.clientHeight / cellH) * 0.92
      const inner = layerValues(progress, 0.22, 0.7, 2)
      const middle = layerValues(progress, 0.3, 0.82, 3)
      const outer = layerValues(progress, 0.38, 0.96, 4)

      centerEl.style.transformOrigin = 'center center'
      centerEl.style.transform = `scale(${cover + (1 - cover) * clamp01(progress / 0.42)})`
      setLayer(layers.current.inner, inner.scale, inner.opacity)
      setLayer(layers.current.middle, middle.scale, middle.opacity)
      if (!mobile) setLayer(layers.current.outer, outer.scale, outer.opacity)
    },
    [mobile],
  )

  useLayoutEffect(() => {
    layers.current = null
    if (reduced) {
      const pinEl = pin.current
      pinEl?.querySelectorAll('.expanding-cell').forEach((node) => {
        const el = node as HTMLElement
        el.style.transform = 'none'
        el.style.opacity = '1'
      })
      return
    }
    apply(0)
  }, [apply, reduced, cells])

  useScrollProgress(section, apply, !reduced)
  useSectionScrub(section, pin, !reduced)

  const isSmallMobile = useMediaQuery('(max-width: 768px)')
  if (isSmallMobile) return null

  return (
    <section ref={section} className={`expanding ${reduced ? 'is-static' : ''}`} aria-label="Fleet campaign grid">
      <div ref={pin} className="expanding-sticky">
        <div className="expanding-grid" style={mobile ? { gridTemplateColumns: 'repeat(3, 1fr)' } : undefined}>
          {cells.map((cell, index) => (
            <div
              key={`${cell.layer}-${cell.src}-${index}`}
              className={`expanding-cell ${cell.layer === 'center' ? 'expanding-center' : ''}`}
              data-layer={cell.layer}
              ref={cell.layer === 'center' ? center : undefined}
            >
              <FleetImg src={cell.src} alt={cell.alt} width={800} height={500} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
