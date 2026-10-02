import { useEffect, type RefObject } from 'react'
import { useLenis } from '@/context/LenisProvider'

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

export function sectionScrollProgress(el: HTMLElement) {
  const total = Math.max(el.offsetHeight - window.innerHeight, 1)
  return clamp01(-el.getBoundingClientRect().top / total)
}

export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress: (progress: number) => void,
  enabled = true,
) {
  const lenis = useLenis()

  useEffect(() => {
    if (!enabled) return

    let frame = 0
    let running = false
    let visible = false
    let current = 0
    let target = 0
    let seeded = false

    const read = () => {
      const el = ref.current
      if (!el) return
      target = sectionScrollProgress(el)
      if (!seeded) {
        current = target
        seeded = true
        onProgress(target)
      }
    }

    const tick = () => {
      current += (target - current) * 0.16
      if (Math.abs(target - current) < 0.00035) {
        current = target
        onProgress(current)
        running = false
        return
      }
      onProgress(current)
      frame = window.requestAnimationFrame(tick)
    }

    const kick = () => {
      if (!visible) return
      read()
      if (!running) {
        running = true
        frame = window.requestAnimationFrame(tick)
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) kick()
        else {
          running = false
          window.cancelAnimationFrame(frame)
        }
      },
      { rootMargin: '12% 0px', threshold: 0 },
    )

    const el = ref.current
    if (el) io.observe(el)

    lenis?.on('scroll', kick)
    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', kick)

    kick()

    return () => {
      running = false
      window.cancelAnimationFrame(frame)
      io.disconnect()
      lenis?.off('scroll', kick)
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', kick)
    }
  }, [ref, onProgress, enabled, lenis])
}

export function useSectionScrub(
  sectionRef: RefObject<HTMLElement | null>,
  surfaceRef: RefObject<HTMLElement | null>,
  enabled = true,
) {
  const lenis = useLenis()

  useEffect(() => {
    const section = sectionRef.current
    const surface = surfaceRef.current
    if (!section || !surface || !enabled) return

    const drag = {
      active: false,
      startX: 0,
      startY: 0,
      startScroll: 0,
      top: 0,
      range: 1,
    }

    const interactive = (node: EventTarget | null) =>
      node instanceof Element && Boolean(node.closest('a, button, input, select, textarea, [role="button"]'))

    const scrollNow = (y: number) => {
      if (lenis) lenis.scrollTo(y, { immediate: true })
      else window.scrollTo({ top: y, left: 0, behavior: 'auto' })
    }

    const onDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || event.button !== 0) return
      if (interactive(event.target)) return
      const current = lenis?.scroll ?? window.scrollY
      drag.active = true
      drag.startX = event.clientX
      drag.startY = event.clientY
      drag.startScroll = current
      drag.top = current + section.getBoundingClientRect().top
      drag.range = Math.max(section.offsetHeight - window.innerHeight, 1)
      surface.setPointerCapture(event.pointerId)
      surface.classList.add('is-scrubbing')
      if (event.target instanceof HTMLElement) event.preventDefault()
    }

    const onMove = (event: PointerEvent) => {
      if (!drag.active) return
      const dx = event.clientX - drag.startX
      const dy = event.clientY - drag.startY
      const unit = Math.max(window.innerWidth * 0.7, 1)
      const next = drag.startScroll + dx * (drag.range / unit) + dy * 0.85
      scrollNow(Math.min(drag.top + drag.range, Math.max(drag.top, next)))
    }

    const onUp = (event: PointerEvent) => {
      if (!drag.active) return
      drag.active = false
      surface.classList.remove('is-scrubbing')
      if (surface.hasPointerCapture(event.pointerId)) surface.releasePointerCapture(event.pointerId)
    }

    surface.addEventListener('pointerdown', onDown)
    surface.addEventListener('pointermove', onMove)
    surface.addEventListener('pointerup', onUp)
    surface.addEventListener('pointercancel', onUp)

    return () => {
      surface.classList.remove('is-scrubbing')
      surface.removeEventListener('pointerdown', onDown)
      surface.removeEventListener('pointermove', onMove)
      surface.removeEventListener('pointerup', onUp)
      surface.removeEventListener('pointercancel', onUp)
    }
  }, [sectionRef, surfaceRef, enabled, lenis])
}
