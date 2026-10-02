import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { business, isWhatsAppConfigured } from '@/data/business'
import { useLenis } from '@/context/LenisProvider'
import { ThemeToggle } from '@/components/navigation/ThemeToggle'

const links = [
  { to: '/', label: 'Home' },
  { to: '/fleet', label: 'Fleet' },
  { to: '/services', label: 'Services' },
  { to: '/booking', label: 'Booking' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const closeRef = useRef<HTMLButtonElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)
  const solid = location.pathname !== '/'

  const lenis = useLenis()

  useEffect(() => {
    const read = () => setScrolled((lenis?.scroll ?? window.scrollY) > 24)
    read()
    window.addEventListener('scroll', read, { passive: true })
    lenis?.on('scroll', read)
    return () => {
      window.removeEventListener('scroll', read)
      lenis?.off('scroll', read)
    }
  }, [lenis])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!open) return
    lastFocus.current = document.activeElement as HTMLElement
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      lastFocus.current?.focus()
    }
  }, [open])

  const whatsAppHref = isWhatsAppConfigured
    ? `https://wa.me/${business.whatsAppNumber.replace(/[^\d]/g, '')}`
    : undefined

  return (
    <>
      <header className={`header ${scrolled || solid || open ? 'is-scrolled' : ''} ${solid ? 'is-solid' : ''}`}>
        <div className="header-inner">
          <NavLink to="/" className="logo" aria-label={`${business.name} home`}>
            <img
              className="logo-img"
              src="/brand/logo-full.webp"
              alt={business.name}
              width={180}
              height={48}
              onError={(e) => {
                e.currentTarget.src = '/brand/logo-full.png'
              }}
            />
          </NavLink>
          <nav className="nav-desktop" aria-label="Primary">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'}>
                {link.label}
              </NavLink>
            ))}
            {whatsAppHref ? (
              <a href={whatsAppHref} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            ) : (
              <span className="meta" title="Set VITE_WHATSAPP_NUMBER to enable">
                WhatsApp
              </span>
            )}
            <ThemeToggle />
          </nav>
          <div className="header-actions">
            <ThemeToggle className="theme-toggle-mobile" />
            <button
              className="menu-toggle"
              type="button"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true">
                <path d="M0 1h18M0 6h18M0 11h12" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mobile-nav ${open ? 'is-open' : ''}`}
        id="mobile-nav"
        aria-hidden={!open}
        inert={!open || undefined}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="header-inner">
          <span className="logo">
            <img className="logo-img" src="/brand/logo-full.webp" alt={business.name} width={160} height={42} />
          </span>
          <div className="header-actions">
            <ThemeToggle />
            <button ref={closeRef} className="menu-toggle" type="button" onClick={() => setOpen(false)}>
              <span className="sr-only">Close menu</span>
              Close
            </button>
          </div>
        </div>
        <nav>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={() => setOpen(false)}>
              {link.label}
            </NavLink>
          ))}
          {whatsAppHref ? (
            <a href={whatsAppHref} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          ) : (
            <span className="meta">WhatsApp unset</span>
          )}
        </nav>
      </div>
    </>
  )
}
