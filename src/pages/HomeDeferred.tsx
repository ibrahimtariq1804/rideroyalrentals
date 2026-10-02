import { ExpandingFleetGrid } from '@/components/sections/ExpandingFleetGrid'
import { ChooseOrbit } from '@/components/sections/ChooseOrbit'
import { HorizontalStory } from '@/components/sections/HorizontalStory'
import { MirrorHall } from '@/components/sections/MirrorHall'
import {
  AirportCta,
  CorporateStory,
  HomeFaq,
  Newsletter,
  TrustProcess,
} from '@/components/sections/Stories'

/** Below-fold home sections — loaded as one lazy chunk after first paint. */
export function HomeDeferred() {
  return (
    <>
      <ExpandingFleetGrid />
      <ChooseOrbit />
      <HorizontalStory />
      <MirrorHall />
      <CorporateStory />
      <AirportCta />
      <TrustProcess />
      <HomeFaq />
      <Newsletter />
    </>
  )
}
