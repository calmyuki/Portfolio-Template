import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import './Hero.css'

export default function Hero() {
  const heroRef = useRef(null)
  const lineLeftRef = useRef(null)
  const lineCenterRef = useRef(null)
  const lineRightRef = useRef(null)
  const introRef = useRef(null)
  const line1Ref = useRef(null)
  const line2Ref = useRef(null)

  useGSAP(
    () => {
      // Check user reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      if (prefersReducedMotion) {
        gsap.set(
          [
            lineLeftRef.current,
            lineCenterRef.current,
            lineRightRef.current,
            introRef.current,
            line1Ref.current,
            line2Ref.current,
          ],
          { opacity: 1, y: '0%' }
        )
        return
      }

      // Sophisticated, deliberate entrance timeline
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.12,
      })

      // Reveal the 3 parallel diagonal lines together
      tl.fromTo(
        [lineLeftRef.current, lineCenterRef.current, lineRightRef.current],
        { opacity: 0 },
        { opacity: 1, duration: 1.2, stagger: 0.08, ease: 'power2.inOut' }
      )
        // Intro label smooth vertical reveal
        .fromTo(
          introRef.current,
          { y: '105%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 0.9, ease: 'power4.out', clearProps: 'transform' },
          '-=0.8'
        )
        // Main oversized headline clipping-mask reveal
        .fromTo(
          [line1Ref.current, line2Ref.current],
          { y: '108%' },
          {
            y: '0%',
            duration: 1.2,
            ease: 'power4.out',
            stagger: 0.13,
            clearProps: 'transform',
          },
          '-=0.75'
        )
    },
    { scope: heroRef }
  )

  return (
    <section ref={heroRef} id="hero" className="brutalist-hero">
      {/* ── 3 Parallel Diagonal Lines: Edges Completely Covered + 300px Center Band ── */}
      <svg
        className="hero-diagonal-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Left Edge Line: Slices and completely covers the Top-Left Corner/Edge */}
        <line
          ref={lineLeftRef}
          x1="38"
          y1="-32"
          x2="-32"
          y2="38"
          className="hero-diagonal-line hero-line-edge"
        />

        {/* Center Master Line (300px) */}
        <line
          ref={lineCenterRef}
          x1="115"
          y1="-15"
          x2="-15"
          y2="115"
          className="hero-diagonal-line hero-line-center"
        />

        {/* Right Edge Line: Slices and completely covers the Bottom-Right Corner/Edge */}
        <line
          ref={lineRightRef}
          x1="132"
          y1="62"
          x2="62"
          y2="132"
          className="hero-diagonal-line hero-line-edge"
        />
      </svg>

      {/* ── Foreground Content Stage: Crisp, High Legibility ── */}
      <div className="hero-content-stage">
        {/* Supporting Intro Label */}
        <div className="hero-intro-wrapper">
          <span ref={introRef} className="hero-intro-text">
            WELCOME
          </span>
        </div>

        {/* Oversized Headline: Balanced Two-Line Condensed Typography */}
        <h1 className="hero-massive-headline">
          <div className="hero-headline-row">
            <span ref={line1Ref} className="hero-headline-text">
              CREATIVE
            </span>
          </div>
          <div className="hero-headline-row">
            <span ref={line2Ref} className="hero-headline-text">
              TECHNOLOGIST
            </span>
          </div>
        </h1>
      </div>
    </section>
  )
}
