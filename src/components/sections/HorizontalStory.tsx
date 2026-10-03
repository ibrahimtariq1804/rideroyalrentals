import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { storyChapters } from '@/data/content'
import { FleetImg } from '@/components/ui/Primitives'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useScrollReady } from '@/context/LenisProvider'
import { useSectionScrub } from '@/hooks/useScrollProgress'

gsap.registerPlugin(ScrollTrigger)

export function HorizontalStory() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const mobile = useMediaQuery('(max-width: 768px)')
  const scrollReady = useScrollReady()
  
  const disableScroll = reduced || mobile
  useSectionScrub(section, section, !disableScroll && scrollReady)

  const [mobileIndex, setMobileIndex] = useState(0)

  // Auto-scroll for mobile
  useEffect(() => {
    if (!disableScroll) return
    const interval = setInterval(() => {
      setMobileIndex((prev) => (prev >= storyChapters.length - 1 ? 0 : prev + 1))
    }, 3000)
    return () => clearInterval(interval)
  }, [disableScroll])

  // Scroll to index on mobile
  useEffect(() => {
    if (disableScroll && track.current) {
      const child = track.current.children[mobileIndex] as HTMLElement
      if (child) {
        track.current.scrollTo({
          left: child.offsetLeft - (window.innerWidth - child.offsetWidth) / 2,
          behavior: 'smooth',
        })
      }
    }
  }, [mobileIndex, disableScroll])

  const goPrev = () => setMobileIndex((p) => (p === 0 ? storyChapters.length - 1 : p - 1))
  const goNext = () => setMobileIndex((p) => (p >= storyChapters.length - 1 ? 0 : p + 1))

  useLayoutEffect(() => {
    const el = section.current
    const row = track.current
    if (!el || !row || disableScroll || !scrollReady) return

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
  }, [disableScroll, scrollReady])

  return (
    <section 
      ref={section} 
      className={disableScroll ? 'section' : 'story'} 
      aria-label="Every road, one fleet" 
      style={disableScroll ? { position: 'relative', padding: '60px 0', overflow: 'hidden' } : undefined}
    >
      {disableScroll && (
        <>
          <button 
            onClick={goPrev} 
            style={{ position: 'absolute', left: 16, top: '50%', zIndex: 10, transform: 'translateY(-50%)', background: 'var(--bg-deep)', border: '1px solid var(--line-strong)', borderRadius: '50%', width: 44, height: 44, display: 'grid', placeItems: 'center', color: 'var(--accent)' }}
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={goNext} 
            style={{ position: 'absolute', right: 16, top: '50%', zIndex: 10, transform: 'translateY(-50%)', background: 'var(--bg-deep)', border: '1px solid var(--line-strong)', borderRadius: '50%', width: 44, height: 44, display: 'grid', placeItems: 'center', color: 'var(--accent)' }}
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      <div 
        ref={track} 
        className="story-track" 
        style={disableScroll ? { display: 'flex', width: '100%', overflowX: 'hidden', gap: '24px', padding: '0 40px', scrollBehavior: 'smooth' } : undefined}
      >
        {storyChapters.map((chapter) => (
          <article 
            className="story-chapter" 
            key={chapter.id}
            style={disableScroll ? { minWidth: '85vw', opacity: 1, pointerEvents: 'none' } : undefined}
          >
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
