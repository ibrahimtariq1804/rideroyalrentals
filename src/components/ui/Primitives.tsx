import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { business } from '@/data/business'
import { MotionButtonShell } from '@/components/animation/MotionBits'

type ButtonProps = {
  to?: string
  href?: string
  children: ReactNode
  variant?: 'solid' | 'ghost'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
}

export function Button({
  to,
  href,
  children,
  variant = 'solid',
  className = '',
  type = 'button',
  disabled,
  onClick,
}: ButtonProps) {
  const cls = `btn ${variant === 'ghost' ? 'btn--ghost' : ''} ${className}`.trim()
  const inner = (() => {
    if (to) {
      return (
        <Link className={cls} to={to} onClick={onClick}>
          {children}
        </Link>
      )
    }
    if (href) {
      return (
        <a className={cls} href={href} target="_blank" rel="noreferrer" onClick={onClick}>
          {children}
        </a>
      )
    }
    return (
      <button className={cls} type={type} disabled={disabled} onClick={onClick}>
        {children}
      </button>
    )
  })()

  if (disabled) return inner
  return <MotionButtonShell>{inner}</MotionButtonShell>
}

export function QuoteChip() {
  return <span className="quote-chip">Request a quote</span>
}

export function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`container ${className}`.trim()}>{children}</div>
}

export function SectionHead({
  kicker,
  title,
  copy,
}: {
  kicker: string
  title: string
  copy?: string
}) {
  return (
    <div className="section-head">
      <div>
        <p className="kicker">{kicker}</p>
        <h2 className="display">{title}</h2>
      </div>
      {copy ? <p style={{ color: 'var(--text-dim)', maxWidth: '42ch' }}>{copy}</p> : <span />}
    </div>
  )
}

export function FleetImg({
  src,
  alt,
  fallback = '/images/fleet/hires/land-cruiser-2019.png',
  width,
  height,
  className,
  loading = 'lazy',
}: {
  src: string
  alt: string
  fallback?: string
  width?: number
  height?: number
  className?: string
  loading?: 'lazy' | 'eager'
}) {
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      fetchPriority={loading === 'eager' ? 'high' : 'auto'}
      onError={(event) => {
        if (event.currentTarget.src.endsWith(fallback)) return
        event.currentTarget.src = fallback
      }}
    />
  )
}

export function WhatsAppCta({ label = 'Continue on WhatsApp' }: { label?: string }) {
  if (!business.whatsAppNumber) {
    return (
      <Button disabled variant="ghost">
        {label}
      </Button>
    )
  }
  return (
    <Button href={`https://wa.me/${business.whatsAppNumber.replace(/[^\d]/g, '')}`} variant="ghost">
      {label}
    </Button>
  )
}
