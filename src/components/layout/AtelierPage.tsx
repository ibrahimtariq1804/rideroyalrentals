import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { Button, FleetImg } from '@/components/ui/Primitives'

export function AtelierPage({
  kicker,
  title,
  lede,
  image,
  imageAlt,
  cta,
  children,
}: {
  kicker: string
  title: string
  lede: string
  image: string
  imageAlt: string
  cta?: { to: string; label: string }
  children?: ReactNode
}) {
  const reduce = useReducedMotion()

  return (
    <div className="atelier">
      <header className="atelier-hero">
        <motion.div
          className="atelier-hero-media"
          initial={reduce ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <FleetImg src={image} alt={imageAlt} width={1600} height={960} loading="eager" />
        </motion.div>
        <div className="atelier-hero-shade" />

        <div className="atelier-hero-inner">
          <motion.div
            className="atelier-placard"
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="atelier-kicker">{kicker}</p>
            <h1 className="atelier-display">{title}</h1>
            <p className="atelier-lede">{lede}</p>
            {cta ? (
              <div className="atelier-cta-row">
                <Button to={cta.to}>{cta.label}</Button>
              </div>
            ) : null}
          </motion.div>
        </div>
      </header>

      <div className="atelier-stage">{children}</div>
    </div>
  )
}

export function BentoServiceCard({
  to,
  image,
  index,
  title,
  kicker,
  featured = false,
}: {
  to: string
  image: string
  index: string
  title: string
  kicker: string
  featured?: boolean
}) {
  return (
    <div className={featured ? 'bento-card is-feature' : 'bento-card'}>
      <Link to={to} className="bento-link">
        <div className="bento-media">
          <FleetImg src={image} alt="" width={900} height={600} />
        </div>
        <div className="bento-meta">
          <span className="bento-index">{index}</span>
          <div>
            <p className="atelier-kicker">{kicker}</p>
            <h3 className="bento-title">{title}</h3>
          </div>
          <span className="bento-arrow" aria-hidden="true">
            →
          </span>
        </div>
      </Link>
    </div>
  )
}
