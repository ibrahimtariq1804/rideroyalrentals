import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Container } from '@/components/ui/Primitives'
import { DateField, todayIso } from '@/components/ui/DateField'
import { categoryLabels } from '@/data/fleet'

export function BookingStrip() {
  const today = todayIso()
  const [pickup, setPickup] = useState('')
  const [ret, setRet] = useState('')

  const onPickup = (value: string) => {
    setPickup(value)
    if (ret && value && ret < value) setRet('')
  }

  return (
    <section className="desk" aria-label="Request desk">
      <Container>
        <div className="desk-grid">
          <div className="desk-copy">
            <p className="kicker">Availability</p>
            <h2 className="display">Dates first. Rates later.</h2>
            <p>
              Tell us when and where. This is a request desk, not a live calendar — we quote after we check the real
              cars.
            </p>
            <p className="meta">
              <Link to="/booking">Open the full itinerary form</Link>
            </p>
          </div>
          <form className="desk-form" action="/booking" method="get">
            <DateField name="pickup" label="Pickup" value={pickup} min={today} onChange={onPickup} />
            <DateField
              name="return"
              label="Return"
              value={ret}
              min={pickup || today}
              onChange={setRet}
            />
            <label className="desk-field">
              <span>Class</span>
              <select name="category" defaultValue="">
                <option value="">Any class</option>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="desk-field">
              <span>City</span>
              <input name="city" placeholder="Lahore, Karachi…" />
            </label>
            <Button type="submit">Request a quote</Button>
          </form>
        </div>
      </Container>
    </section>
  )
}
