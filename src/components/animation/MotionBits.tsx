import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const springSoft = { type: 'spring' as const, stiffness: 380, damping: 28 }
const springPop = { type: 'spring' as const, stiffness: 520, damping: 22 }

export function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduce || window.matchMedia('(pointer: coarse)').matches) return

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const x = event.clientX - (rect.left + rect.width / 2)
      const y = event.clientY - (rect.top + rect.height / 2)
      el.style.transform = `translate(${x * 0.14}px, ${y * 0.14}px)`
    }
    const onLeave = () => {
      el.style.transform = 'translate(0, 0)'
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [reduce])

  return (
    <div ref={ref} className="magnetic">
      {children}
    </div>
  )
}

export function Marquee({ items }: { items: string[] }) {
  const loop = [...items, ...items]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </div>
  )
}

export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ ...springSoft, delay }}
    >
      {children}
    </motion.div>
  )
}

export function MotionButtonShell({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={`motion-btn-shell ${className}`.trim()}
      whileHover={reduce ? undefined : { y: -4, scale: 1.03 }}
      whileTap={reduce ? undefined : { scale: 0.97, y: 0 }}
      transition={springPop}
    >
      {children}
    </motion.div>
  )
}

export function JourneyStep({
  index,
  title,
  body,
  delay = 0,
}: {
  index: string
  title: string
  body: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.article
      className="journey-step"
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ ...springSoft, delay }}
      whileHover={reduce ? undefined : { y: -6 }}
    >
      <span className="journey-step-index">{index}</span>
      <h3 className="display journey-step-title">{title}</h3>
      {body ? <p>{body}</p> : null}
    </motion.article>
  )
}

export function PageFade({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
