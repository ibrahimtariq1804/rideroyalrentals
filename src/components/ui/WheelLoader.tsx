import { useId } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

function pt(r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180
  return `${(100 + r * Math.cos(a)).toFixed(2)} ${(100 + r * Math.sin(a)).toFixed(2)}`
}

function spokePath(deg: number) {
  return [
    `M ${pt(26, deg - 10)}`,
    `L ${pt(46, deg - 6)}`,
    `L ${pt(73, deg - 16)}`,
    `L ${pt(76, deg - 9)}`,
    `L ${pt(76, deg + 9)}`,
    `L ${pt(73, deg + 16)}`,
    `L ${pt(46, deg + 6)}`,
    `L ${pt(26, deg + 10)}`,
    'Z',
  ].join(' ')
}

function SportAlloy({ rimId, tireId, lipId, dishId }: { rimId: string; tireId: string; lipId: string; dishId: string }) {
  return (
    <svg viewBox="0 0 200 200" width="88" height="88" aria-hidden="true">
      <defs>
        <radialGradient id={tireId} cx="36%" cy="28%" r="76%">
          <stop offset="0" stopColor="#3a3a40" />
          <stop offset="0.52" stopColor="#141418" />
          <stop offset="1" stopColor="#070709" />
        </radialGradient>
        <linearGradient id={lipId} x1="28" y1="8" x2="176" y2="190" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f7f3ea" />
          <stop offset="0.38" stopColor="#9aa0a8" />
          <stop offset="0.72" stopColor="#3e434a" />
          <stop offset="1" stopColor="#ddd6c8" />
        </linearGradient>
        <linearGradient id={rimId} x1="40" y1="18" x2="168" y2="176" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f3eee4" />
          <stop offset="0.28" stopColor="#c5c0b6" />
          <stop offset="0.58" stopColor="#6d737c" />
          <stop offset="1" stopColor="#2b3036" />
        </linearGradient>
        <radialGradient id={dishId} cx="42%" cy="32%" r="70%">
          <stop offset="0" stopColor="#2a2d33" />
          <stop offset="1" stopColor="#0a0b0e" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="99" fill={`url(#${tireId})`} />
      <circle cx="100" cy="100" r="84" fill="#0b0b0e" />
      <circle cx="100" cy="100" r="81.5" fill="none" stroke={`url(#${lipId})`} strokeWidth="5.5" />
      <circle cx="100" cy="100" r="76" fill={`url(#${dishId})`} />
      {Array.from({ length: 5 }, (_, i) => {
        const deg = i * 72
        return <path key={i} d={spokePath(deg)} fill={`url(#${rimId})`} />
      })}
      <circle cx="100" cy="100" r="27" fill="#16181e" stroke={`url(#${lipId})`} strokeWidth="2.2" />
      <circle cx="100" cy="100" r="16" fill="#0c0d11" stroke="#e0b15a" strokeWidth="1.3" />
      <circle cx="100" cy="100" r="6" fill="#08080a" />
    </svg>
  )
}

export function WheelLoader() {
  const reduced = usePrefersReducedMotion()
  const rimId = useId().replace(/:/g, '')
  const tireId = useId().replace(/:/g, '')
  const lipId = useId().replace(/:/g, '')
  const dishId = useId().replace(/:/g, '')

  return (
    <div className="wheel-loader">
      <div className="wheel-stack">
        <div className="wheel-ground" />
        <div className={`wheel-disc ${reduced ? '' : 'is-spinning'}`}>
          <SportAlloy
            rimId={`rim-${rimId}`}
            tireId={`tire-${tireId}`}
            lipId={`lip-${lipId}`}
            dishId={`dish-${dishId}`}
          />
        </div>
        {!reduced ? (
          <div className="wheel-smoke-layer" aria-hidden="true">
            <span className="wheel-haze" />
            <span className="wheel-wisp" />
            <span className="wheel-wisp" />
            <span className="wheel-wisp" />
            <span className="wheel-wisp" />
            <span className="wheel-wisp" />
            <span className="wheel-wisp" />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function PageLoader({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={compact ? 'page-loader page-loader--compact' : 'page-loader'}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <WheelLoader />
      <span className="sr-only">Loading</span>
    </div>
  )
}
