import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { storyChapters } from '@/data/content'
import { FleetImg } from '@/components/ui/Primitives'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useScrollReady } from '@/context/LenisProvider'
import { useSectionScrub } from '@/hooks/useScrollProgress'

gsap.registerPlugin(ScrollTrigger)

export function HorizontalStory() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const scrollReady = useScrollReady()
  useSectionScrub(section, section, !reduced && scrollReady)

  useLayoutEffect(() => {
    const el = section.current
    const row = track.current
    if (!el || !row || reduced || !scrollReady) return

    const ctx = gsap.context(() => {
      const distance = () => row.scrollWidth - window.innerWidth
      gsap.to(row, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [reduced, scrollReady])

  return (
    <section ref={section} className={reduced ? 'section' : 'story'} aria-label="Every road, one fleet">
      <div ref={track} className="story-track" style={reduced ? { display: 'grid' } : undefined}>
        {storyChapters.map((chapter) => (
          <article className="story-chapter" key={chapter.id}>
            <FleetImg src={chapter.image} alt="" width={1200} height={900} />
            <div className="story-copy">
              <p className="kicker">{chapter.kicker}</p>
              <p className="meta">Every road / one fleet</p>
              <h2 className="display">{chapter.title}</h2>
              <p>{chapter.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
