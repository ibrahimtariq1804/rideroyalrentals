import { useEffect, useId, useMemo, useRef, useState } from 'react'

const WEEK = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function toIsoDate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function todayIso() {
  return toIsoDate(new Date())
}

export function formatDeskDate(iso: string) {
  if (!iso) return 'Select date'
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function startOfMonth(year: number, month: number) {
  return new Date(year, month, 1)
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function mondayIndex(date: Date) {
  return (date.getDay() + 6) % 7
}

type Props = {
  name: string
  label: string
  value: string
  onChange: (value: string) => void
  min?: string
  max?: string
}

export function DateField({ name, label, value, onChange, min, max }: Props) {
  const id = useId()
  const wrap = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const initial = value ? new Date(value) : new Date()
  const [cursor, setCursor] = useState({ year: initial.getFullYear(), month: initial.getMonth() })

  useEffect(() => {
    if (!open) return
    const source = value ? new Date(value) : new Date()
    setCursor({ year: source.getFullYear(), month: source.getMonth() })
    const onDoc = (event: MouseEvent) => {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, value])

  const cells = useMemo(() => {
    const first = startOfMonth(cursor.year, cursor.month)
    const count = daysInMonth(cursor.year, cursor.month)
    const lead = mondayIndex(first)
    const list: Array<{ iso: string; day: number; current: boolean }> = []
    for (let i = 0; i < lead; i += 1) list.push({ iso: '', day: 0, current: false })
    for (let day = 1; day <= count; day += 1) {
      list.push({ iso: `${cursor.year}-${pad(cursor.month + 1)}-${pad(day)}`, day, current: true })
    }
    return list
  }, [cursor])

  const title = new Date(cursor.year, cursor.month, 1).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })

  const disabled = (iso: string) => {
    if (!iso) return true
    if (min && iso < min) return true
    if (max && iso > max) return true
    return false
  }

  return (
    <div className={open ? 'date-field is-open' : 'date-field'} ref={wrap}>
      <span className="date-field-label" id={`${id}-label`}>
        {label}
      </span>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        className="date-field-trigger"
        aria-labelledby={`${id}-label`}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((next) => !next)}
      >
        {formatDeskDate(value)}
      </button>
      {open ? (
        <div className="date-cal" role="dialog" aria-label={`${label} calendar`}>
          <div className="date-cal-nav">
            <button
              type="button"
              onClick={() =>
                setCursor((c) =>
                  c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 },
                )
              }
              aria-label="Previous month"
            >
              ‹
            </button>
            <p className="display">{title}</p>
            <button
              type="button"
              onClick={() =>
                setCursor((c) =>
                  c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 },
                )
              }
              aria-label="Next month"
            >
              ›
            </button>
          </div>
          <div className="date-cal-week">
            {WEEK.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="date-cal-grid">
            {cells.map((cell, index) =>
              cell.current ? (
                <button
                  type="button"
                  key={cell.iso}
                  className={cell.iso === value ? 'is-on' : undefined}
                  disabled={disabled(cell.iso)}
                  onClick={() => {
                    onChange(cell.iso)
                    setOpen(false)
                  }}
                >
                  {cell.day}
                </button>
              ) : (
                <span key={`e-${index}`} />
              ),
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
