import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Phone, MessageCircle } from 'lucide-react'
import { business, isWhatsAppConfigured } from '@/data/business'
import { useLenis } from '@/context/LenisProvider'
import { useTheme } from '@/context/ThemeProvider'
import { ThemeToggle } from '@/components/navigation/ThemeToggle'
import { Marquee } from '@/components/animation/MotionBits'

const links = [
  { to: '/', label: 'Home' },
  { to: '/fleet', label: 'Fleet' },
  { to: '/services', label: 'Services' },
  { to: '/booking', label: 'Booking' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" style={{ overflow: 'visible' }}>
      <line x1="4" y1="8" x2="20" y2="8" stroke="currentColor" strokeWidth="1.5" style={{ transformOrigin: '12px 12px', transform: open ? 'translateY(4px) rotate(45deg)' : 'none', transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} />
      <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" style={{ opacity: open ? 0 : 1, transition: 'opacity 0.4s ease' }} />
      <line x1="4" y1="16" x2={open ? "20" : "14"} y2="16" stroke="currentColor" strokeWidth="1.5" style={{ transformOrigin: '12px 12px', transform: open ? 'translateY(-4px) rotate(-45deg)' : 'none', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} />
    </svg>
  )
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const closeRef = useRef<HTMLButtonElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)
  const solid = location.pathname !== '/'

  const lenis = useLenis()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const logoSrc = isDark ? '/brand/logo-full.webp' : '/brand/logo-dark.png'

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

  const cleanPhone = business.whatsAppNumber.replace(/[^\d]/g, '')
  const whatsAppHref = isWhatsAppConfigured
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello Ride Royal Rentals! I would like to inquire about car rental availability.')}`
    : undefined

  return (
    <>
      <header className={`header ${scrolled || solid || open ? 'is-scrolled' : ''} ${solid ? 'is-solid' : ''}`}>
        <div className="header-inner">
          <NavLink to="/" className="logo" aria-label={`${business.name} home`}>
            <img
              className="logo-img"
              src={logoSrc}
              alt={business.name}
              width={190}
              height={48}
              onError={(e) => {
                e.currentTarget.src = isDark ? '/brand/logo-full.png' : '/brand/logo-dark.png'
              }}
            />
          </NavLink>

          <nav className="nav-desktop" aria-label="Primary">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'}>
                {link.label}
              </NavLink>
            ))}

            <a href={`tel:${business.whatsAppNumber}`} className="nav-call-link" title="Call directly">
              <Phone size={14} />
              <span>0321 5373563</span>
            </a>

            {whatsAppHref ? (
              <a href={whatsAppHref} target="_blank" rel="noreferrer" className="nav-wa-badge">
                <MessageCircle size={15} />
                <span>WhatsApp</span>
              </a>
            ) : null}

            <ThemeToggle />
          </nav>

          <div className="header-actions">
            <a href={`tel:${business.whatsAppNumber}`} className="mobile-header-call" aria-label="Call Ride Royal Rentals">
              <Phone size={18} />
            </a>
            {whatsAppHref ? (
              <a href={whatsAppHref} target="_blank" rel="noreferrer" className="mobile-header-wa" aria-label="WhatsApp Ride Royal Rentals">
                <MessageCircle size={18} />
              </a>
            ) : null}
            <ThemeToggle className="theme-toggle-mobile" />
            <button
              className="menu-toggle"
              type="button"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <MenuIcon open={open} />
            </button>
          </div>
        </div>
      </header>

      <div className="header-marquee" style={{ position: 'fixed', top: 'var(--header)', left: 0, right: 0, height: 'var(--marquee-h, 36px)', zIndex: 39, background: 'var(--bg-panel)', borderBottom: '1px solid var(--line-strong)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <Marquee items={[
          '✦', 'PREMIUM CHAUFFEUR SERVICES', 
          '✦', 'INSTANT BOOKING VIA WHATSAPP', 
          '✦', `24/7 SUPPORT: ${business.whatsAppNumber}`, 
          '✦', 'LUXURY FLEET AVAILABLE NOW',
          '✦', 'NO HIDDEN FEES'
        ]} />
      </div>

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
            <img className="logo-img" src={logoSrc} alt={business.name} width={160} height={42} />
          </span>
          <div className="header-actions">
            <ThemeToggle />
            <button ref={closeRef} className="menu-toggle" type="button" onClick={() => setOpen(false)}>
              <span className="sr-only">Close menu</span>
              <MenuIcon open={open} />
            </button>
          </div>
        </div>
        <nav className="mobile-nav-links">
          {links.map((link, i) => (
            <NavLink 
              key={link.to} 
              to={link.to} 
              end={link.to === '/'} 
              onClick={() => setOpen(false)}
              className="mobile-link"
              style={{ transitionDelay: `${0.1 + i * 0.04}s` }}
            >
              <span className="mobile-link-num">0{i + 1}</span>
              <span className="mobile-link-text">{link.label}</span>
            </NavLink>
          ))}
          {whatsAppHref ? (
            <a 
              href={whatsAppHref} 
              target="_blank" 
              rel="noreferrer"
              className="mobile-link mobile-link-wa"
              style={{ transitionDelay: `${0.1 + links.length * 0.04}s` }}
            >
              <span className="mobile-link-num">WA</span>
              <span className="mobile-link-text">WhatsApp</span>
            </a>
          ) : (
            <span className="meta">WhatsApp unset</span>
          )}
        </nav>
        <div className="mobile-nav-footer">
          <p>Managed by <a href="https://lazyfoxxes.com" target="_blank" rel="noreferrer">Lazyfoxxes.com</a></p>
        </div>
      </div>
    </>
  )
}
