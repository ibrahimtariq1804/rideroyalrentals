import { AtelierPage } from '@/components/layout/AtelierPage'
import { Container, Button } from '@/components/ui/Primitives'
import { FleetCard, FleetFilters, FleetNote, useFilteredFleet } from '@/components/fleet/FleetBrowser'
import { Reveal } from '@/components/animation/MotionBits'

export function FleetPage() {
  const list = useFilteredFleet()

  return (
    <AtelierPage
      kicker="Fleet"
      title="The inventory."
      lede="Islamabad stock, listed with rates. Filter hard. Confirm at quote."
      image="/images/fleet/hires/land-cruiser-2019.png"
      imageAlt="Land Cruiser 2019"
      cta={{ to: '/booking', label: 'Request a quote' }}
    >
      <Container>
        <Reveal>
          <div className="atelier-toolbar">
            <FleetFilters count={list.length} />
          </div>
        </Reveal>
        <div className="atelier-note">
          <FleetNote />
        </div>

        {list.length === 0 ? (
          <div className="atelier-empty">
            <h2 className="atelier-display">Nothing in this cut.</h2>
            <p>Reset filters or try another class.</p>
            <Button to="/fleet">Clear filters</Button>
          </div>
        ) : (
          <div className="atelier-fleet-grid">
            {list.map((vehicle) => (
              <FleetCard key={vehicle.slug} slug={vehicle.slug} />
            ))}
          </div>
        )}
      </Container>
    </AtelierPage>
  )
}
