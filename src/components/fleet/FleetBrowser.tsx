import { Link, useSearchParams } from 'react-router-dom'
import {
  categoryLabels,
  fleetDisclaimer,
  formatRate,
  vehicles,
  type DriveMode,
  type IntendedUse,
  type Transmission,
  type VehicleCategory,
} from '@/data/fleet'
import { FleetImg, QuoteChip } from '@/components/ui/Primitives'

const uses: IntendedUse[] = ['city', 'airport', 'intercity', 'wedding', 'corporate', 'family', 'group']

function Chip({
  on,
  children,
  onClick,
}: {
  on: boolean
  children: string
  onClick: () => void
}) {
  return (
    <button className={on ? 'chip is-on' : 'chip'} type="button" onClick={onClick} aria-pressed={on}>
      {children}
    </button>
  )
}

export function FleetFilters({ count }: { count: number }) {
  const [params, setParams] = useSearchParams()
  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }
  const category = params.get('category') ?? ''
  const drive = params.get('drive') ?? ''
  const transmission = params.get('transmission') ?? ''

  return (
    <div className="fleet-toolbar">
      <div className="fleet-toolbar-top">
        <label className="desk-field fleet-search">
          <span>Search</span>
          <input
            placeholder="Name or maker"
            value={params.get('q') ?? ''}
            onChange={(event) => set('q', event.target.value)}
            aria-label="Search fleet"
          />
        </label>
        <p className="meta fleet-count">{count} cars</p>
      </div>
      <div className="chip-row">
        <Chip on={!category} onClick={() => set('category', '')}>
          All classes
        </Chip>
        {Object.entries(categoryLabels).map(([value, label]) => (
          <Chip key={value} on={category === value} onClick={() => set('category', value)}>
            {label}
          </Chip>
        ))}
      </div>
      <div className="chip-row chip-row--quiet">
        <Chip on={!drive} onClick={() => set('drive', '')}>
          Any drive
        </Chip>
        <Chip on={drive === 'self-drive'} onClick={() => set('drive', 'self-drive')}>
          Self-drive
        </Chip>
        <Chip on={drive === 'chauffeur'} onClick={() => set('drive', 'chauffeur')}>
          Chauffeur
        </Chip>
        <Chip on={!transmission} onClick={() => set('transmission', '')}>
          Any gearbox
        </Chip>
        <Chip on={transmission === 'automatic'} onClick={() => set('transmission', 'automatic')}>
          Automatic
        </Chip>
        <Chip on={transmission === 'manual'} onClick={() => set('transmission', 'manual')}>
          Manual
        </Chip>
        <label className="chip-select">
          <span className="sr-only">Intended use</span>
          <select value={params.get('use') ?? ''} onChange={(event) => set('use', event.target.value)} aria-label="Intended use">
            <option value="">Any use</option>
            {uses.map((use) => (
              <option key={use} value={use}>
                {use}
              </option>
            ))}
          </select>
        </label>
        <label className="chip-select">
          <span className="sr-only">Seats</span>
          <select value={params.get('seats') ?? ''} onChange={(event) => set('seats', event.target.value)} aria-label="Seats">
            <option value="">Any seats</option>
            <option value="4">4 seats</option>
            <option value="5">5 seats</option>
            <option value="7">7+ seats</option>
            <option value="10">10+ seats</option>
          </select>
        </label>
        <button className="chip" type="button" onClick={() => setParams(new URLSearchParams())}>
          Reset
        </button>
      </div>
    </div>
  )
}

export function useFilteredFleet() {
  const [params] = useSearchParams()
  const q = (params.get('q') ?? '').toLowerCase()
  const category = params.get('category') as VehicleCategory | null
  const seats = Number(params.get('seats') ?? 0)
  const transmission = params.get('transmission') as Transmission | null
  const drive = params.get('drive') as DriveMode | null
  const use = params.get('use') as IntendedUse | null
  const sort = params.get('sort') ?? 'name'

  const list = vehicles.filter((vehicle) => {
    if (q && !`${vehicle.name} ${vehicle.maker}`.toLowerCase().includes(q)) return false
    if (category && vehicle.category !== category) return false
    if (seats && vehicle.seats < seats) return false
    if (transmission && vehicle.transmission !== 'both' && vehicle.transmission !== transmission) return false
    if (drive && vehicle.driveMode !== 'both' && vehicle.driveMode !== drive) return false
    if (use && !vehicle.intendedUses.includes(use)) return false
    return true
  })

  list.sort((a, b) => {
    if (sort === 'category') return a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
    return a.name.localeCompare(b.name)
  })

  return list
}

export function FleetCard({
  slug,
  featured = false,
  tall = false,
}: {
  slug: string
  featured?: boolean
  tall?: boolean
}) {
  const vehicle = vehicles.find((item) => item.slug === slug)
  if (!vehicle) return null
  const cls = ['fleet-card', featured ? 'is-featured' : '', tall ? 'is-tall' : ''].filter(Boolean).join(' ')
  return (
    <article className={cls}>
      <Link to={`/vehicle/${vehicle.slug}`}>
        <div
          className="fleet-card-media"
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect()
            event.currentTarget.style.setProperty('--px', `${((event.clientX - rect.left) / rect.width) * 100}%`)
            event.currentTarget.style.setProperty('--py', `${((event.clientY - rect.top) / rect.height) * 100}%`)
          }}
        >
          <span className="fleet-card-tag">{categoryLabels[vehicle.category]}</span>
          <FleetImg src={vehicle.heroImage} alt={vehicle.name} width={800} height={500} />
          <FleetImg className="alt" src={vehicle.altImage} alt="" width={800} height={500} />
        </div>
        <div className="fleet-card-body">
          <p className="fleet-card-detail">{vehicle.detail}</p>
          <h3 className="fleet-card-name">{vehicle.name}</h3>
          <div className="fleet-card-foot">
            <strong className="fleet-card-rate">{formatRate(vehicle.ratePerDay)}</strong>
            <QuoteChip />
          </div>
        </div>
      </Link>
    </article>
  )
}

export function FleetNote() {
  return <p className="meta">{fleetDisclaimer}</p>
}
